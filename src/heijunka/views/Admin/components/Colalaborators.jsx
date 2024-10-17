import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import { useUsers } from '../../../api/useUsers';

const Collaborators = () => {
  const { users, loading, error, deleteUser, editUsers } = useUsers();

  // Handler para editar usuario
  const handleEditUser = async (id) => {
    const newName = prompt("Introduce el nuevo nombre:");
    if (newName) {
      const userToUpdate = { id, firstName: newName };
      await editUsers(userToUpdate);
    }
  };

  // Handler para eliminar usuario
  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      await deleteUser(id);
    }
  };

  // Handler para asignar permisos
  const handleAssignPermissions = (id) => {
    console.log(`Asignar permisos al usuario con ID: ${id}`);
  };

  // Manejo de carga y errores
  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar usuarios: {error.message}</div>;

  return (
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Site</TableCell> {/* Nueva columna para Site */}
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.site_name}</TableCell> {/* Mostrar el nombre del sitio */}
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditUser(user.id)}>
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

export default Collaborators;
