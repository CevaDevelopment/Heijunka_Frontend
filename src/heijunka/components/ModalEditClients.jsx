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

// Mapeo de site_name a site_id y type_name a type_id
const siteMapping = {
  'MCC GREEN 1': 1,
  'MCC GREEN 2': 2,
  'LOGIKA': 3,
};

const typeMapping = {
  'Mono Cliente': 1,
  'Multi Cliente': 2,
};


export const ModalEditClients = ({ open, handleClose, handleEditClient, clientToEdit }) => {
  const [newSite, setNewSite] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newClientType, setNewClientType] = useState('');

  useEffect(() => {
    if (clientToEdit) {
      // Depuramos para ver qué valores tiene clientToEdit
      console.log('Cliente a editar:', clientToEdit);

      // Mapeamos el nombre del sitio a su ID correspondiente
      const siteId = siteMapping[clientToEdit.site_name];
      if (siteId) {
        setNewSite(siteId);
      } else {
        console.warn('No se encontró site_name en el mapeo:', clientToEdit.site_name);
      }

      setNewClient(clientToEdit.name || '');
      // Mapeamos el tipo de cliente a su ID correspondiente
      const clientTypeId = typeMapping[clientToEdit.type_name];
      if (clientTypeId) {
        setNewClientType(clientTypeId);
      } else {
        console.warn('No se encontró type_name en el mapeo:', clientToEdit.type_name);
      }
    }
  }, [clientToEdit]);

  const handleSubmit = () => {
    const updatedClient = {
      id: clientToEdit.id,
      site_id: newSite,  // Ya estamos manejando el site_id directamente
      name: newClient,
      type_id: newClientType,  // Ya estamos manejando el type_id directamente
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
            <MenuItem value={1}>MCC1</MenuItem>
            <MenuItem value={2}>MCC2</MenuItem>
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
    site_name: PropTypes.string.isRequired,  // El site_name viene en la respuesta
    type_name: PropTypes.string.isRequired,  // El type_name viene en la respuesta
  }),
};