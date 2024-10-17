// useTasks.js
import { useState } from 'react';
import HeijunkaApi from '../../api/heijunkaApi';

export const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assignTask = async (taskData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await HeijunkaApi.post('/api/task-parameters/', taskData);
        return response.data; // Devuelve la respuesta del servidor
    } catch (err) {
      setError(err);
      console.error("Error al asignar la tarea:", err);
      throw err; // Vuelve a lanzar el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };

  return { assignTask, loading, error };
};
