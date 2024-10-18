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
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
        site: client.site_id,
        name: client.name,
        type: client.type_id 
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
              <TableCell>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Site
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Cliente
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Tipo de Cliente
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Acciones
                </Typography>
              </TableCell>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Site</InputLabel>
            <Select
              value={editedClient.site_id}
              onChange={(e) => setEditedClient({ ...editedClient, site_id: e.target.value })}
            >
              <MenuItem value={1}>MCC GREEN 1</MenuItem>
              <MenuItem value={2}>MCC GREEN 2</MenuItem>
              <MenuItem value={3}>LOGIKA</MenuItem>
            </Select>
          </FormControl>

            {/* Campo para nombre del cliente */}
          <TextField
            margin="dense"
            label="Cliente"
            fullWidth
            variant="outlined"
            value={editedClient.name}
            onChange={(e) =>
              setEditedClient({ ...editedClient, name: e.target.value })
            }
          />

          {/* Select para tipo de cliente */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo de Cliente</InputLabel>
            <Select
              value={editedClient.type_id}
              onChange={(e) => setEditedClient({ ...editedClient, type_id: e.target.value })}
            >
              <MenuItem value={1}>Mono Cliente</MenuItem>
              <MenuItem value={2}>Multi Cliente</MenuItem>
            </Select>
          </FormControl>
          
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
