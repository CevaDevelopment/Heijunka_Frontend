import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // Puedes cambiar el número de puerto si es necesario
        host: '0.0.0.0', // Esto permitirá que se acceda a la aplicación desde cualquier dirección
    },
    build: {
        outDir: 'dist',
    },
});

