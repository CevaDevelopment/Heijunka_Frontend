import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuthStore, useForm } from '../../hooks';

const loginFormFields = {
    loginEmail: "",
    loginPassword: "",
}

export const LoginPage = () => {

    const { startLogin, errorMessage } = useAuthStore();

    const { loginEmail, loginPassword, onInputChange } = useForm(loginFormFields);

    const loginSubmit = (event) => {
        event.preventDefault();
        // console.log({ loginEmail, loginPassword });
        startLogin({ email: loginEmail, password: loginPassword });
    }

    useEffect(() => {
      if ( errorMessage !== undefined) {
        Swal.fire('Error en la utentifcación', errorMessage, 'error');
      }
    }, [errorMessage])
    

    return (
        <AuthLayout title="Login">
            <form onSubmit={loginSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            required
                            label="Correo"
                            type="email"
                            placeholder="correo@cevalogistics.com"
                            name='loginEmail'
                            value={loginEmail}
                            onChange={onInputChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            required
                            label="Contraseña"
                            type="password"
                            placeholder="Contraseña"
                            name='loginPassword'
                            value={loginPassword}
                            onChange={onInputChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 2 , mt: 1, ml: 3 }}>
                        <Grid item xs={12} sm={6} alignItems="center">
                            <Button variant="contained" fullWidth type="submit">
                                Login
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="end">
                        <Link component={RouterLink} color="inherit" to="/auth/register">
                            Crear una cuenta
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    );
};

