FROM arm64v8/node:20-bullseye-slim as build-env
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM arm64v8/nginx:1.25.1-alpine3.17 
COPY --from=build-env /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

