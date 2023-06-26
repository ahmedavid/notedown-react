FROM arm64v8/node:20.3.1-alpine3.17

WORKDIR /app
COPY . .
COPY .env.prod .env
RUN apk update && \
    apk add --no-cache nodejs npm
RUN npm install && npx prisma generate

CMD [ "npx ts-node src/index.ts" ]
EXPOSE 3000

