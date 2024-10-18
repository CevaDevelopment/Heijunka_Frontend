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
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const ModalUsers = ({ open, handleClose, handleAddNewElement, handleEditUser, userToEdit, isClientModal }) => {
  const [newRole, setNewRole] = useState('');
  const [newSite, setNewSite] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newClientType, setNewClientType] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Cuando el usuario a editar cambia, llena los campos con los datos del usuario
    if (userToEdit) {
      setNewFirstName(userToEdit.first_name || '');
      setNewLastName(userToEdit.last_name || '');
      setNewEmail(userToEdit.email || '');
      setNewRole(userToEdit.role || '');
      setNewStatus(userToEdit.is_active ? 'active' : 'inactive'); // Asumiendo que `is_active` es un booleano
    } else {
      clearFields(); // Limpiar campos si no hay usuario para editar
    }
  }, [userToEdit]);

  const handleSubmit = () => {
    
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

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
      const userData = {
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        role: newRole,
        is_active: newStatus,
        password: newPassword, 
      };

      console.log("Datos del usuario a agregar/editar:", userData);


      if (userToEdit) {
        userData.id = userToEdit.id; // Añadimos el ID si es una edición
        console.log("Editando usuario:", userData);
        handleEditUser(userData);
      } else {
        console.log("Agregando nuevo colaborador:", userData);
        handleAddNewElement(userData); // Agregar nuevo colaborador
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
    setNewPassword('');
    setConfirmPassword('');
    console.log("Campos limpiados");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {isClientModal ? "Agregar Cliente" : "Agregar Colaborador"}
      </DialogTitle>
      <DialogContent>
        {isClientModal ? (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Site</InputLabel>
              <Select
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
              >
                <MenuItem value={1}>MCC GREEN 1</MenuItem>
                <MenuItem value={2}>MCC GREEN 2</MenuItem>
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
              <Select
                value={newClientType}
                onChange={(e) => setNewClientType(e.target.value)}
              >
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
            type='email'
              fullWidth
              label="Correo"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
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
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
  handleEditUser: PropTypes.func.isRequired,
  userToEdit: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string, // Cambiado a first_name
    last_name: PropTypes.string, // Cambiado a last_name
    email: PropTypes.string,
    role: PropTypes.string,
    is_active: PropTypes.bool, // Agregado is_active como booleano
  }),
  isClientModal: PropTypes.bool.isRequired,
};
