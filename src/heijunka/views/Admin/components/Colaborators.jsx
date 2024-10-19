import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';

const Collaborators = ({ users, handleEditUser, handleDeleteUser, handleAssignPermissions }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre</Typography></TableCell>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Apellido</Typography></TableCell>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Correo</Typography></TableCell>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Role</Typography></TableCell>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Site</Typography></TableCell>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado</Typography></TableCell>
            <TableCell><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Acciones</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.site_name}</TableCell>
              <TableCell sx={{ color: user.is_active ? 'green' : 'red', fontWeight: 'bold' }}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditUser(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleAssignPermissions(user.id)}>
                  <SecurityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Definición de PropTypes para validación de tipos
Collaborators.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      site_name: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleEditUser: PropTypes.func.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
  handleAssignPermissions: PropTypes.func.isRequired,
};

export default Collaborators;