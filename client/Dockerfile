FROM arm64v8/node:20-alpine3.17 as build-env
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM arm64v8/nginx:1.25.1-alpine3.17 
COPY --from=build-env /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf && chmod +x /usr/share/nginx/html/set-env.sh
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 8080
CMD ["sh", "-c", "cd /usr/share/nginx/html/ && ./set-env.sh && nginx -g 'daemon off;'"]

