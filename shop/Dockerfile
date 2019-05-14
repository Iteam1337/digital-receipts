FROM node:12.2

WORKDIR /app

COPY . ./
RUN npm ci --only=production

CMD node .