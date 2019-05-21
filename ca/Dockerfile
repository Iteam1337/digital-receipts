FROM node:10.15

WORKDIR /app

COPY . ./
RUN npm ci --only=production

CMD node .
