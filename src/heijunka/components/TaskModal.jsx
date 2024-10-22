import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TaskModal = ({
  open,
  onClose,
  handleAddTask,
  taskDescription,
  setTaskDescription,
  client,
  setClient,
  quantity,
  setQuantity,
  clients,
  siteId,
  fetchClientsBySite,
  loading,
  error,
  taskStatus, 
  setTaskStatus
}) => {
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (open && siteId && !hasFetched) { 
      fetchClientsBySite(siteId);
      setHasFetched(true);
    }
  }, [open, siteId, fetchClientsBySite]);

  useEffect(() => {
    if (!open) {
      setHasFetched(false); // Resetea cuando se cierra el modal
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, bgcolor: 'white', borderRadius: 2, maxWidth: 400, margin: 'auto', marginTop: '15%' }}>
        <Typography variant="h6" gutterBottom>Agregar Tarea</Typography>
        {error && <Typography color="error">{error.message}</Typography>}
        <TextField
          label="Descripción de la Tarea"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            label="Cliente"
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.name}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Cantidad"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          fullWidth
          variant="outlined"
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Estado de la Tarea</InputLabel>
          <Select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            label="Estado de la Tarea"
          >
            <MenuItem value="not started">No Iniciada</MenuItem>
            <MenuItem value="in progress">En Progreso</MenuItem>
            <MenuItem value="completed">Finalizada</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleAddTask}
          fullWidth
          sx={{
            backgroundColor: "#FFFFFF", 
            color: "#0C1A52",
            "&:hover": {
              backgroundColor: "#091A40", 
            },
            mt: 2,
          }}
          disabled={loading || !taskDescription || !client || quantity <= 0}
        >
          Agregar
        </Button>
      </Box>
    </Modal>
  );
};

TaskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleAddTask: PropTypes.func.isRequired,
  taskDescription: PropTypes.string.isRequired,
  setTaskDescription: PropTypes.func.isRequired,
  client: PropTypes.string.isRequired,
  setClient: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  siteId: PropTypes.number.isRequired,
  fetchClientsBySite: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  taskStatus: PropTypes.string.isRequired,
  setTaskStatus: PropTypes.func.isRequired,
};

export default TaskModal;