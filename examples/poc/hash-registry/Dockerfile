FROM node:10.15

WORKDIR /app

COPY ./hash-registry ./
COPY .env-docker ../.env
RUN npm ci --only=production

CMD node .
