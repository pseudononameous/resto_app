FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_HOST=http://localhost:8000/api
ARG VITE_API_DOMAIN=http://localhost:8000
ARG VITE_APP_NAME=RestoApp
ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_API_DOMAIN=$VITE_API_DOMAIN
ENV VITE_APP_NAME=$VITE_APP_NAME

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
