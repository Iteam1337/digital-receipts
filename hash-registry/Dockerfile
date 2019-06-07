FROM node:10.15 as base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./lib ./lib
COPY apidoc.json ./
COPY jest.config.js ./

RUN npm run test
RUN npx apidoc -i lib

FROM node:10.15

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY ./lib ./lib
COPY --from=base /app/doc ./doc

CMD npm start
