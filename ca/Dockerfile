FROM node:10.15

WORKDIR /app

COPY ./ca ./
COPY .env ../
RUN npm ci --only=production

CMD node .
