import React, { useState } from 'react';
import {
  Grid,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { AddOutlined } from '@mui/icons-material';
import { ModalClients, ModalUsers, ModalEditClients, ModalEditUsers } from '../../components';

import useUsers from '../../api/useUsers';
import useClients from '../../api/useClients';
import Clients from './components/Clients';
import Collaborators from './components/Colaborators';

export const AdminView = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isClientModal, setIsClientModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);

  const { users, addUsers, editUsers, deleteUser, loading: loadingUsers, error: errorUsers } = useUsers();
  const { clients, addClient, editClient, deleteClient, loading: loadingClients, error: errorClients } = useClients();

  const handleOpenModal = (isClient = false) => {
    setIsClientModal(isClient);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setIsClientModal(false);
    setEditModalOpen(true);
  };

  const handleEditClient = (client) => {
    setClientToEdit(client);
    setIsClientModal(true);
    setEditModalOpen(true);
  };

  const handleAddNewElement = async (newElement) => {
    if (isClientModal) {
      await addClient(newElement);
    } else {
      await addUsers(newElement);
    }
    setModalOpen(false);
    resetState();
  };

  const handleUpdateElement = async (updatedElement) => {
    if (isClientModal) {
      await editClient(updatedElement.id, updatedElement);
    } else {
      await editUsers(updatedElement.id, updatedElement);
    }
    setEditModalOpen(false);
    resetState();
  };

  const resetState = () => {
    setUserToEdit(null);
    setClientToEdit(null);
  };

  if (loadingUsers || loadingClients) return <div>Loading...</div>;
  if (errorUsers) return <div>Error al cargar usuarios: {errorUsers.message}</div>;
  if (errorClients) return <div>Error al cargar clientes: {errorClients.message}</div>;

  return (
    <Grid container direction="column" spacing={3} sx={{ p: 3 }}>
      <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
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
            resetState();
          }}
          handleAddNewClient={handleAddNewElement}
        />
      ) : (
        <ModalUsers
          open={isModalOpen}
          handleClose={() => {
            setModalOpen(false);
            resetState();
          }}
          handleAddNewElement={handleAddNewElement}
        />
      )}

      {isClientModal ? (
        <ModalEditClients
          open={isEditModalOpen}
          handleClose={() => {
            setEditModalOpen(false);
            resetState();
          }}
          handleEditClient={handleUpdateElement}
          clientToEdit={clientToEdit}
        />
      ) : (
        <ModalEditUsers
          open={isEditModalOpen}
          handleClose={() => {
            setEditModalOpen(false);
            resetState();
          }}
          handleEditUser={handleUpdateElement}
          userToEdit={userToEdit}
        />
      )}
    </Grid>
  );
};
