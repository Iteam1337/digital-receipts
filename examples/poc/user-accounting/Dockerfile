FROM node:12.2

WORKDIR /app

COPY ./user-accounting ./
COPY .env-docker ../.env

RUN npm ci --only=production

CMD node .