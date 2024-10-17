import { useEffect, useState } from "react"
import HeijunkaApi from "../../api/heijunkaApi";

export const useUsers = () => {

    const [users, setUsers] =  useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () =>    {
            try {
                const response = await HeijunkaApi.get('/users/');
                setUsers(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    },[]);

    const filterCollaboratorsBySite = (siteName) => {
        return users.filter(user => user.role === 'operator' && user.site_name === siteName);
    };

    const addUsers = async (newUser) => {
        try {
            const response = await HeijunkaApi.post('/users/', newUser);
            setUsers([...users, response.data]);
        } catch (error) {
            console.error("Error adding user:", error.response?.data || error.message);
            throw error;
        }
    };

    const deleteUser = async (id) => {
        try {
            await HeijunkaApi.delete(`/users/${id}/`);
            setUsers(users.filter(user => user.id!== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const editUsers = async (newUser) => {
        try {
            const response = await HeijunkaApi.put(`/users/${newUser.id}/`, newUser);
            setUsers(users.map(user => (user.id === newUser.id? response.data : user)));
        } catch (error) {
            console.error("Error editing user:", error);
        }
    };

    return {users , loading, error, addUsers, deleteUser, editUsers, filterCollaboratorsBySite}
}
