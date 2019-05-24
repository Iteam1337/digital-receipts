FROM node:12.2

WORKDIR /app

COPY ./user-email ./
COPY .env ../
RUN npm ci --only=production

CMD node .