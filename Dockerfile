# Usar Node.js v22.11.0 para construir la aplicación
FROM node:22.11.0 as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY . .

# Crear el archivo .env con las variables de entorno necesarias
RUN echo "VITE_API_URL=http://localhost:8000/api" > .env

# Instalar dependencias
RUN yarn install --ignore-platform --ignore-engines

# Construir la aplicación
RUN yarn build

# Usar una imagen ligera para servir los archivos estáticos
FROM nginx:alpine

# Copiar los archivos construidos al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto en el que corre el servidor
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
