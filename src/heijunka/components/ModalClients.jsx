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

export const ModalClients = ({ open, handleClose, handleAddNewClient, handleEditClient, clientToEdit }) => {
  const [newSite, setNewSite] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newClientType, setNewClientType] = useState('');

  const handleCloseModal = () => {
    clearFields();
    handleClose();
  };

  useEffect(() => {
    if (clientToEdit) {
      console.log('Cliente a editar en ModalClients:', clientToEdit);
      setNewSite(clientToEdit.site_id || '');
      setNewClient(clientToEdit.name || '');
      setNewClientType(clientToEdit.type_id || '');
    } else {
      clearFields();
    }
  }, [clientToEdit]);

  const handleSubmit = () => {
    if (newSite && newClient && newClientType) {
      const clientData = {
        site_id: newSite,
        name: newClient,
        type_id: newClientType,
      };

      if (clientToEdit) {
        clientData.id = clientToEdit.id;
        handleEditClient(clientData);
      } else {
        handleAddNewClient(clientData);
      }

      clearFields();
      handleClose();
    } else {
      alert("Por favor, completa todos los campos de cliente.");
    }
  };

  const clearFields = () => {
    setNewSite('');
    setNewClient('');
    setNewClientType('');
  };

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogTitle>{clientToEdit ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {clientToEdit ? "Actualizar" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalClients.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddNewClient: PropTypes.func.isRequired,
  handleEditClient: PropTypes.func.isRequired,
  clientToEdit: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    site_id: PropTypes.number,
    type_id: PropTypes.number,
  }),
};
