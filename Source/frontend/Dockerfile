FROM node:14.20.0 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production image
FROM nginx:alpine

# COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]