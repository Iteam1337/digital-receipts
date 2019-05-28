FROM node:12.2

WORKDIR /app

COPY ./user-email ./
COPY .env-docker ../.env
RUN npm ci --only=production

CMD node .