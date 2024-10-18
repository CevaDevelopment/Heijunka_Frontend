import { useEffect, useState } from "react";
import { heijunkaApi } from "../../api";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await heijunkaApi.get("/users/");
        setUsers(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filterCollaboratorsBySite = (siteName) => {
    return users.filter(
      (user) => user.role === "operator" && user.site_name === siteName
    );
  };

  // Agregar usuario (sin incluir contraseña)
  const addUsers = async (newUser) => {
    try {
      const userData = {
        email: newUser.email,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        role: newUser.role,
        site_id: newUser.site_id,
        is_active: newUser.is_active,
        Password: newUser.password
      };
      const response = await heijunkaApi.post("/users/", userData);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      console.log("Usuario agregado", response.data);
    } catch (error) {
      console.error(
        "Error al agregar usuario:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    try {
      await heijunkaApi.delete(`/users/${id}/`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Editar usuario (con PATCH)
  const editUsers = async (userId, updatedUser) => {
    try {
      const response = await heijunkaApi.patch(
        `/users/${userId}/`,
        updatedUser
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? response.data : user))
      );
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return {
    users,
    loading,
    error,
    deleteUser,
    editUsers,
    addUsers,
    filterCollaboratorsBySite,
  };
};

export default useUsers;