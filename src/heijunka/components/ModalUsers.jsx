import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export const ModalUsers = ({ open, handleClose, handleAddNewElement, isClientModal }) => {
  const [newRole, setNewRole] = useState('');
  const [newSite, setNewSite] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newClientType, setNewClientType] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const handleSubmit = () => {
    if (isClientModal) {
      if (newSite && newClient && newClientType) {
        handleAddNewElement({
          site_id: newSite,
          name: newClient,
          type_id: newClientType,
        });
      } else {
        alert("Por favor, completa todos los campos de cliente.");
      }
    } else {
      if (newFirstName && newLastName && newEmail && newRole && newStatus) {
        handleAddNewElement({
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          role: newRole,
          status: newStatus,
        });
      } else {
        alert("Por favor, completa todos los campos de colaborador.");
      }
    }

    clearFields();
    handleClose();
  };

  const clearFields = () => {
    setNewRole('');
    setNewSite('');
    setNewClient('');
    setNewClientType('');
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewStatus('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isClientModal ? 'Agregar Cliente' : 'Agregar Colaborador'}</DialogTitle>
      <DialogContent>
        {isClientModal ? (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Site</InputLabel>
              <Select value={newSite} onChange={(e) => setNewSite(e.target.value)}>
                <MenuItem value={1}>MCC GREEN 1 </MenuItem>
                <MenuItem value={2}>MCC GREEN 2 </MenuItem>
                <MenuItem value={3}>LOGIKA</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Cliente"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Cliente</InputLabel>
              <Select value={newClientType} onChange={(e) => setNewClientType(e.target.value)}>
                <MenuItem value={1}>Mono Cliente</MenuItem>
                <MenuItem value={2}>Multi Cliente</MenuItem>
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Nombre"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Apellido"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Correo"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Rol</InputLabel>
              <Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalUsers.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddNewElement: PropTypes.func.isRequired,
  isClientModal: PropTypes.bool.isRequired,
};

