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

export const ModalEditClients = ({ open, handleClose, handleEditClient, clientToEdit }) => {
  const [newSite, setNewSite] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newClientType, setNewClientType] = useState('');

  useEffect(() => {
    if (clientToEdit) {
      setNewSite(clientToEdit.site_id || '');
      setNewClient(clientToEdit.name || '');
      setNewClientType(clientToEdit.type_id || '');
    }
  }, [clientToEdit]);

  const handleSubmit = () => {
    const updatedClient = {
      id: clientToEdit.id,
      site_id: newSite,
      name: newClient,
      type_id: newClientType,
    };

    handleEditClient(updatedClient);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Cliente</DialogTitle>
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
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEditClients.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleEditClient: PropTypes.func.isRequired,
  clientToEdit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    site_id: PropTypes.number.isRequired,
    type_id: PropTypes.number.isRequired,
  }),
};
