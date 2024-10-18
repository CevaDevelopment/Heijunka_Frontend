import React, { useEffect, useState } from 'react';
import {
  Grid,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { AddOutlined } from '@mui/icons-material';
import axios from 'axios';
import { ModalUsers } from '../../components';
import Clients from './components/Clients';
import useClients from '../../api/useClients';
import Collaborators from './components/Colalaborators';
 // Asegúrate que el nombre sea correcto

export const AdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isClientModal, setIsClientModal] = useState(false);
  const roles = ['Admin', 'Operator', 'Manager'];
  const [userToEdit, setUserToEdit] = useState(null);


  const { clients, loading, error, deleteClient, addClient } = useClients();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditUser = (userId) => {
    console.log("Editando colaborador con ID:", userId);
    // Implementar lógica para editar un colaborador
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAssignPermissions = (userId) => {
    console.log("Asignando permisos al colaborador con ID:", userId);
  };

  const handleOpenModal = (isClient = false) => {
    setIsClientModal(isClient);
    setModalOpen(true);
  };

  const handleAddNewElement = async (newElement) => {
    try {
      if (isClientModal) {
        await addClient(newElement);
      } else {
        // Asegúrate de tener implementado el método para agregar colaborador
        const response = await axios.post('/api/users', newElement); // Ajusta según tu backend
        setUsers([...users, response.data]); // Agrega el nuevo colaborador a la lista
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding new element:", error);
    }
  };

  if (loading) return <div>Loading clients...</div>;
  if (error) return <div>Error loading clients: {error.message}</div>;

  return (
    <Grid container direction="column" spacing={3} sx={{ p: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
      >
        <Tab label="Clientes" />
        <Tab label="Colaboradores"/>
      </Tabs>

      {tabIndex === 0 && (
        <Grid item>
          <Clients
            clients={clients}
            handleDeleteClient={deleteClient}
            handleOpenModal={() => handleOpenModal(true)}
          />
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid item>
          <Collaborators
            users={users}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            handleAssignPermissions={handleAssignPermissions}
            handleOpenModal={() => handleOpenModal(false)}
          />
        </Grid>
      )}

      <IconButton
        size="large"
        sx={{
          color: "white",
          backgroundColor: "error.main",
          ":hover": { backgroundColor: "error.main", opacity: 0.9 },
          position: "fixed",
          right: 50,
          bottom: 50,
        }}
        onClick={() => handleOpenModal(tabIndex === 0)}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>

      <ModalUsers
        open={isModalOpen}
        handleClose={() => {
          setModalOpen(false);
          setUserToEdit(null); // Limpiar el estado al cerrar
        }}
        handleAddNewElement={handleAddNewElement}
        handleEditUser={handleEditUser} // Pasar la función de edición aquí
        userToEdit={userToEdit} // Pasar el usuario a editar aquí
        roles={roles}
        isClientModal={isClientModal}
      />
    </Grid>
  );
};