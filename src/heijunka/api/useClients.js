import { useState, useEffect } from 'react';
import { heijunkaApi } from '../../api';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los clientes al inicio
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await heijunkaApi.get('/clients/'); // URL para obtener todos los clientes
        setClients(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Función para buscar clientes por siteId
  const fetchClientsBySite = async (siteId) => {
    if (!siteId) return; // Si no hay siteId, no hacer la solicitud

    setLoading(true);
    try {
      const response = await heijunkaApi.get(`/clients/?siteId=${siteId}`);
      setClients(response.data); // Actualiza la lista de clientes con los filtrados
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (newClient) => {
    try {
      const response = await heijunkaApi.post('/clients/', newClient);
      setClients((prevClients) => [...prevClients, response.data]);
      console.log("Datos del Cliente", response.data);
    } catch (error) {
      console.error("Error adding client:", error.response?.data || error.message);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await heijunkaApi.delete(`/clients/${id}/`);
      setClients((prevClients) => prevClients.filter(client => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const editClient = async (clientId, updatedClient) => {
    try {
      const response = await heijunkaApi.put(`/clients/${clientId}/`, updatedClient);
      setClients((prevClients) =>
        prevClients.map(client => (client.id === clientId ? response.data : client))
      );
    } catch (error) {
      console.error("Error editing client:", error);
    }
  };

  return { clients, loading, error, deleteClient, editClient, addClient, fetchClientsBySite };
};

export default useClients;
