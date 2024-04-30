FROM node:20.0.0 as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . ./

CMD ["npm", "run", "start:dev"]

FROM node:alpine as prod

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . ./

RUN npm run build

CMD ["npm", "run", "start:prod"]