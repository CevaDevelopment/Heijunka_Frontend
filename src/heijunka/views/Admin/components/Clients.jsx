import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const Clients = ({ clients, handleEditClient, handleDeleteClient }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editedClient, setEditedClient] = useState({ site_name: '', name: '', type_name: '' });

  const handleClickOpen = (client) => {
    setSelectedClient(client);
    setEditedClient({
        site: client.site_name,
        name: client.name,
        type: client.type_name 
      });
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedClient(null);
  };

  const handleSave = () => {
    handleEditClient(selectedClient.id, editedClient);
    handleClose();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo de Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.site_name}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.type_name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(client)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClient(client.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para editar cliente */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Site"
            fullWidth
            variant="outlined"
            value={editedClient.site}
            onChange={(e) => setEditedClient({ ...editedClient, site: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Cliente"
            fullWidth
            variant="outlined"
            value={editedClient.name}
            onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tipo de Cliente"
            fullWidth
            variant="outlined"
            value={editedClient.type}
            onChange={(e) => setEditedClient({ ...editedClient, type: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Agrega validaciones de prop-types
Clients.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      site: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleEditClient: PropTypes.func.isRequired,
  handleDeleteClient: PropTypes.func.isRequired,
};

export default Clients;
