# Usar imagem do Node.js como base
FROM node:latest AS build

WORKDIR /app

# Copiar package.json e package-lock.json para instalar as dependências
COPY package*.json ./
RUN npm install

# Copiar o projeto inteiro
COPY . .

# Construir o app Vue
RUN npm run build

# Estágio 2: Servir o app pronto para produção com uma imagem menor
FROM nginx:alpine

# Copiar o app construído do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
