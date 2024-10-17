import React, { useEffect, useState } from 'react';
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
    if (open && siteId && !hasFetched)  { 
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
        <FormControl fullWidth>
                    <Select
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                    >
                        <MenuItem value="not started">No Iniciada</MenuItem>
                        <MenuItem value="in progress">En Progreso</MenuItem>
                        <MenuItem value="completed">Finalizada</MenuItem>
                    </Select>
                </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          fullWidth
          disabled={loading || !taskDescription || !client || quantity <= 0}
        >
          Agregar
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskModal;
