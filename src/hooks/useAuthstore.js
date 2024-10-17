import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store';
import { heijunkaApi } from '../api';


export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();


    const startLogin =  async ({ email, password}) => {

        dispatch( onChecking() );
        
        try {
            const {data} = await heijunkaApi.post('/login/', { email, password });
            const fullName = `${data.first_Name} - ${data.last_Name}`;
            // console.log({ data })
            localStorage.setItem('token', data.Token );
            localStorage.setItem('refresh_token', data.refresh); // Guarda el refresh token// Guarda el refresh token
            localStorage.setItem('token-init-date', new Date().getTime() );
            
            dispatch( onLogin({ name: fullName, id: data.id}) );
    } catch {
        dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
    }
}

    const startRegister = async({ first_name,last_name,email, password }) => {
        dispatch( onChecking() );
        try {
            const { data } = await heijunkaApi.post('/register/',{ first_name,last_name,email, password });
            console.log({ data })
            localStorage.setItem('token', data.Token );
            localStorage.setItem('refresh_token', data.refreshToken);
            localStorage.setItem('token-init-date', new Date().getTime() );
            
            
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
            
        } catch (error) {
            dispatch( onLogout( error.response.data?.msg || 'Error Usuario ya existe' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    // const checkAuthToken = async () => {
    //     const token = localStorage.getItem('token');
    //     const refreshToken = localStorage.getItem('refresh_token');
    
    //     // console.log('Token:', token);
    //     // console.log('Refresh Token:', refreshToken);
    
    //     if (!token || !refreshToken) {
    //         return dispatch(onLogout());
    //     }
    
    //     try {
    //         const { data } = await heijunkaApi.post('/auth/renew/', {
    //             refresh: refreshToken, 
    //         });
    
    //         localStorage.setItem('token', data.token); // Asegúrate de que el servidor devuelva el nuevo token
    //         localStorage.setItem('token-init-date', new Date().getTime());
    //         dispatch(onLogin({ name: data.name, id: data.id }));
    //     } catch (error) {
    //         console.error('Error al renovar el token:', error.response?.data || error.message);
    //         localStorage.clear();
    //         dispatch(onLogout());
    //     }
    // };
    const checkAuthToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
      
        if (!refreshToken) {
          console.error("No hay refresh token disponible.");
          dispatch(onLogout());
          return false; // No hay refresh token
        }
      
        try {
          const { data } = await heijunkaApi.post('/auth/renew/', {
            refresh: refreshToken,
          });
      
          localStorage.setItem('token', data.token); // Almacena el nuevo token
          return true; // Renovación exitosa
        } catch (error) {
          console.error('Error al renovar el token:', error.response?.data || error.message);
          localStorage.clear(); // Limpiar localStorage si falla la renovación
          dispatch(onLogout());
          return false; // Renovación fallida
        }
      };
      
    
    
    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    };
    



    return {
        //* Propiedades
        errorMessage,
        status, 
        user, 

        //* Métodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }

}