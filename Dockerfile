FROM node:12.2

WORKDIR /app

COPY index.js ./
COPY package* ./
COPY .env-docker ./.env
RUN npm ci --only=production

CMD node .