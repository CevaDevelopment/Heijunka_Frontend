import { useEffect, useState } from 'react';
import { heijunkaApi } from "../../api"; 

export const useSites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSites = async () => {
    const token = localStorage.getItem('token'); // Obtén el token

    console.log('Token:', token); // Asegúrate de que el token sea válido y no sea null

    try {
      const { data } = await heijunkaApi.get('/sites/');
      setSites(data);
    } catch (error) {
      console.error('Error al obtener sitios:', error.response?.data || error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    loading,
    error,
  };
};
