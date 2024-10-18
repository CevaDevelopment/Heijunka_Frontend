import { useState, useEffect } from 'react';
import { heijunkaApi } from '../../api';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await heijunkaApi.get('/clients/');
        setClients(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const fetchClientsBySite = async (siteId) => {
    if (!siteId) return;
    setLoading(true);
    try {
      const response = await heijunkaApi.get(`/clients/?siteId=${siteId}`);
      setClients(response.data);
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
      console.log("Cliente agregado", response.data);
    } catch (error) {
      console.error("Error al agregar cliente:", error.response?.data || error.message);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      await heijunkaApi.delete(`/clients/${id}/`);
      setClients((prevClients) => prevClients.filter(client => client.id !== id));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const editClient = async (clientId, updatedClient) => {
    try {
      const response = await heijunkaApi.patch(`/clients/${clientId}/`, updatedClient);
      setClients((prevClients) =>
        prevClients.map(client => (client.id === clientId ? response.data : client))
      );
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  return { clients, loading, error, deleteClient, editClient, addClient, fetchClientsBySite };
};

export default useClients;
