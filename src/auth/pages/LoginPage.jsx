import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Box } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuthStore, useForm } from '../../hooks';
import logo from "../../../public/logo.png"; // Importa el logo

const loginFormFields = {
    loginEmail: "",
    loginPassword: "",
}

export const LoginPage = () => {

    const { startLogin, errorMessage } = useAuthStore();

    const { loginEmail, loginPassword, onInputChange } = useForm(loginFormFields);

    const loginSubmit = (event) => {
        event.preventDefault();
        startLogin({ email: loginEmail, password: loginPassword });
    }

    useEffect(() => {
      if (errorMessage !== undefined) {
        Swal.fire('Error en la autenticación', errorMessage, 'error');
      }
    }, [errorMessage]);

    return (
        <AuthLayout title="Login">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <img src={logo} alt="Logo" style={{ width: '140px', marginBottom: '20px' }} />
            </Box>

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

                    <Grid container spacing={2} sx={{ mb: 2, mt: 1, ml: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                                sx={{
                                    backgroundColor: "#CC3329",
                                    "&:hover": { backgroundColor: "#b32b23" },
                                    color: "#FFFFFF",
                                }}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="end">
                        <Link component={RouterLink} color="inherit" to="/auth/register" sx={{ color: "#0C1A52" }}>
                            Crear una cuenta
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    );
};
