import React, { useState } from 'react';
import {
  Grid,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { AddOutlined } from '@mui/icons-material';
import { ModalClients, ModalUsers } from '../../components';  // Modal para usuarios

import useUsers from '../../api/useUsers';
import useClients from '../../api/useClients';
import Clients from './components/Clients';
import Collaborators from './components/Colaborators';


export const AdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isClientModal, setIsClientModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);  // Estado para editar clientes

  // Hooks personalizados para usuarios y clientes
  const { users, addUsers, editUsers, deleteUser, loading: loadingUsers, error: errorUsers } = useUsers();
  const { clients, addClient, editClient, deleteClient, loading: loadingClients, error: errorClients } = useClients();

  const handleOpenModal = (isClient = false) => {
    setIsClientModal(isClient);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setIsClientModal(false);
    setModalOpen(true);
  };

  const handleEditClient = (client) => {
    setClientToEdit(client);
    setIsClientModal(true);
    setModalOpen(true);
  };

  const handleAddNewElement = async (newElement) => {
    if (isClientModal) {
      await addClient(newElement);  // Usamos el hook para agregar cliente
    } else {
      await addUsers(newElement);  // Usamos el hook para agregar usuario
    }
    setModalOpen(false);
  };

  const handleUpdateElement = async (updatedElement) => {
    if (isClientModal) {
      await editClient(updatedElement.id, updatedElement);  // Usamos el hook para editar cliente
    } else {
      await editUsers(updatedElement.id, updatedElement);  // Usamos el hook para editar usuario
    }
    setModalOpen(false);
  };

  if (loadingUsers || loadingClients) return <div>Loading...</div>;
  if (errorUsers) return <div>Error al cargar usuarios: {errorUsers.message}</div>;
  if (errorClients) return <div>Error al cargar clientes: {errorClients.message}</div>;

  return (
    <Grid container direction="column" spacing={3} sx={{ p: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
      >
        <Tab label="Clientes" />
        <Tab label="Colaboradores" />
      </Tabs>

      {tabIndex === 0 && (
        <Grid item>
          <Clients
            clients={clients}
            handleDeleteClient={deleteClient}
            handleEditClient={handleEditClient}
          />
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid item>
          <Collaborators
            users={users}
            handleEditUser={handleEditUser}
            handleDeleteUser={deleteUser}
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

      {isClientModal ? (
        <ModalClients
          open={isModalOpen}
          handleClose={() => {
            setModalOpen(false);
            setClientToEdit(null);
          }}
          handleAddNewClient={handleAddNewElement}
          handleEditClient={handleUpdateElement}
          clientToEdit={clientToEdit}
        />
      ) : (
        <ModalUsers
          open={isModalOpen}
          handleClose={() => {
            setModalOpen(false);
            setUserToEdit(null);
          }}
          handleAddNewElement={handleAddNewElement}
          handleEditUser={handleUpdateElement}
          userToEdit={userToEdit}
        />
      )}
    </Grid>
  );
};