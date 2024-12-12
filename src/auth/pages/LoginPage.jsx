import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Box, InputAdornment } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuthStore, useForm } from '../../hooks';
import logo from "../../../public/logo.png";
import { EmailOutlined, LockOutlined } from '@mui/icons-material';

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
    <AuthLayout title="Iniciar Sesión">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '60vh',
        }}
      >
        {/* Formulario centrado */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            p: 3,
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 2,
          }}
        >
          <form onSubmit={loginSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Correo"
                  type="email"
                  placeholder="correo@cevalogistics.com"
                  name="loginEmail"
                  value={loginEmail}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  label="Contraseña"
                  type="password"
                  placeholder="Contraseña"
                  name="loginPassword"
                  value={loginPassword}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      backgroundColor: "#CC3329",
                      "&:hover": { backgroundColor: "#b32b23" },
                      color: "#FFFFFF",
                      py: 1.5,
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent="center">
                <Link component={RouterLink} to="/auth/register" sx={{ color: "#0C1A52", textDecoration: 'underline' }}>
                  Crear una cuenta
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Logo como marca de agua fuera del formulario */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            opacity: 0.1,
          }}
        >
          <img src={logo} alt="Marca de agua" style={{ width: '100px' }} />
        </Box>
      </Box>
    </AuthLayout>
  );
};
