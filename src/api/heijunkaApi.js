import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL} = getEnvVariables();

const HeijunkaApi = axios.create({
    baseURL: VITE_API_URL
});

HeijunkaApi.interceptors.request.use( config => {

    config.headers = {
        ...config.headers,
        'Token': localStorage.getItem('token')
    }
    return config;
})


export default HeijunkaApi;