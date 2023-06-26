FROM arm64v8/node:20.3.1-alpine3.17

WORKDIR /app
COPY .env.prod .env
COPY . .
RUN "npm install"
RUN "npx prisma init"

CMD [ "npx ts-node ./src/index.ts" ]
EXPOSE 3000

