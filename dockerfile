# Usa una imagen oficial de Nginx
FROM nginx:alpine

# Copia los archivos del frontend al directorio de Nginx
COPY ./frontend /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80
