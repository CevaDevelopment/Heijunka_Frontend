import { useState } from 'react';
import { heijunkaApi } from '../../api';

export const useTaskAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState([]);

  const fetchTaskAssignments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await heijunkaApi.get('/task-assignments/');
      setTaskAssignments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const assignTask = async (taskData) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await heijunkaApi.post('/task-assignments/', taskData, { signal });
      return response.data;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Solicitud cancelada');
      } else {
        setError(err.response?.data?.message || 'Error al asignar tarea');
        throw err;
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  const resetTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await heijunkaApi.delete('/task-assignments/delete_all/'); // Actualiza el endpoint para borrar todas las tareas
      fetchTaskAssignments(); // Vuelve a cargar las tareas después de eliminar
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer las tareas');
    } finally {
      setLoading(false);
    }
  };

  return { taskAssignments, fetchTaskAssignments, assignTask, resetTasks, loading, error };
};
