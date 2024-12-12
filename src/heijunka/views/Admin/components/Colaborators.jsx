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
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3, borderRadius: "12px", overflow: "hidden" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#0C1A52" }}>
          <TableRow>
            {['Nombre', 'Apellido', 'Correo', 'Role', 'Site', 'Estado', 'Acciones'].map((header) => (
              <TableCell key={header}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                  {header}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.site_name}</TableCell>
              <TableCell sx={{ color: user.is_active ? 'green' : 'red', fontWeight: 'bold' }}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditUser(user)} sx={{ color: "#0C1A52" }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteUser(user.id)} sx={{ color: "#CC3329" }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleAssignPermissions(user.id)} sx={{ color: "#4C6EF5" }}>
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
