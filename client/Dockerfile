FROM arm64v8/node:20.3.1-alpine3.17

WORKDIR /app
COPY . .
RUN apk update && \
    apk add --no-cache nodejs npm
RUN npm install

CMD npm start
EXPOSE 3000

