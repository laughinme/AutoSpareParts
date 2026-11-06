# Production image of the web app for the home server: static build behind nginx, which also proxies the API.
# Build context is the repository root.
FROM node:25-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --silent --no-audit --no-fund
COPY frontend/ ./
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:1.29-alpine
COPY deploy/home/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
