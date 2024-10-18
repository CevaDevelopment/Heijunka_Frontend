import React, { useState } from 'react';
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

import { ModalUsers } from '../../../components/ModalUsers';
import useUsers from '../../../api/useUsers';

const Collaborators = () => {
  const { users, loading, error, deleteUser, editUsers, addUser } = useUsers();
    const [isModalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Handler para editar usuario
  const handleEditUser = async (id) => {
    const user = users.find(user => user.id === id);
    setUserToEdit(user); // Guardar el usuario a editar
    setModalOpen(true); // Abrir el modal
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
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nombre</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Apellido</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Correo</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Role</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Site</Typography>
            </TableCell> 
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Estado</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Acciones</Typography>
            </TableCell>
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
              <TableCell 
                sx={{
                  color: user.is_active ? 'green' : 'red', 
                  fontWeight: 'bold'
                }}
              >
                {user.is_active ? 'Activo' : 'Inactivo'}
              </TableCell>
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
      <ModalUsers
        open={isModalOpen}
        handleClose={() => {
          setModalOpen(false);
          setUserToEdit(null); // Limpiar el estado al cerrar
        }}
        handleAddNewElement={addUser} // Aquí deberías tener tu función para agregar
        handleEditUser={editUsers} // Pasar la función de editar
        userToEdit={userToEdit} // Pasar el usuario a editar
        isClientModal={false}
      />
    </TableContainer>
  );
};

export default Collaborators;
