FROM node:12.2

WORKDIR /app

COPY ./shop ./
COPY .env-docker ../.env
RUN npm ci --only=production

CMD node .