# Utilizar una imagen de Node para construir el proyecto
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Construir el proyecto
RUN npm run build

# Utilizar una imagen de Nginx para servir la aplicación
FROM nginx:1.21-alpine

# Copiar los archivos de construcción de la imagen de Node.js al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar archivo de configuración de Nginx personalizado
COPY nginx.conf /etc/nginx/nginx.conf


# Exponer el puerto 80
EXPOSE 80

# Comando de inicio de Nginx
CMD ["nginx", "-g", "daemon off;"]
