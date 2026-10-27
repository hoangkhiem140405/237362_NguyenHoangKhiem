# Stage 1: Build React
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Khai báo ARG để nhận URL Backend Render khi build
ARG REACT_APP_API_URL=https://api-237362.onrender.com/api/employees
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: Nginx Server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]