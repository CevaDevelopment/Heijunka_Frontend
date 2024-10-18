import { useEffect, useState } from 'react';
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

export const ModalUsers = ({ open, handleClose, handleAddNewElement, handleEditUser, userToEdit }) => {
  const [newRole, setNewRole] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPassword, setNewPassword ] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setNewFirstName(userToEdit.first_name || '');
      setNewLastName(userToEdit.last_name || '');
      setNewEmail(userToEdit.email || '');
      setNewRole(userToEdit.role || '');
      setNewStatus(userToEdit.is_active ? 'active' : 'inactive');
    } else {
      clearFields();
    }
  }, [userToEdit]);

  const handleSubmit = () => {
    const userData = {
      first_name: newFirstName,
      last_name: newLastName,
      email: newEmail,
      role: newRole,
      is_active: newStatus,
      password: newPassword
    };

    if (userToEdit) {
      userData.id = userToEdit.id; 
      handleEditUser(userData);
    } else {
      handleAddNewElement(userData);
    }

    clearFields();
    handleClose();
  };

  const clearFields = () => {
    setNewRole('');
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewStatus('');
    setNewPassword('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{userToEdit ? "Editar Colaborador" : "Agregar Colaborador"}</DialogTitle>
      <DialogContent>
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
          type='email'
          fullWidth
          label="Correo"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value={true}>Activo</MenuItem>
            <MenuItem value={false}>Inactivo</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="operator">Operator</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {userToEdit ? "Actualizar" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalUsers.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddNewElement: PropTypes.func.isRequired,
  handleEditUser: PropTypes.func.isRequired,
  userToEdit: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    is_active: PropTypes.bool,
  }),
};
