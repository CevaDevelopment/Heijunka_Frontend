import { useEffect, useState } from "react";
import { heijunkaApi } from "../../api";


const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
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
    fetchClients();
  }, []);

  const filterCollaboratorsBySite = (siteName) => {
    return users.filter(
      (user) => user.role === "operator" && user.site_name === siteName
    );
  };

  const addUsers = async (newUser) => {
    try {
      const userData = {
        email: newUser.email,
        password: newUser.password,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        role: newUser.role,
        status: newUser.status,
        site_id: newUser.site_id,
        is_active: newUser.is_active,
      };
      const response = await heijunkaApi.post("/users/", userData);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      console.log("Datos del Cliente", response.data);
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await heijunkaApi.delete(`/users/${id}/`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUsers = async (userId, updatedUser) => {
    try {
      const response = await heijunkaApi.put(
        `/users/${userId.id}/`,
        updatedUser
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? response.data : user))
      );
    } catch (error) {
      console.error("Error editing user:", error);
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