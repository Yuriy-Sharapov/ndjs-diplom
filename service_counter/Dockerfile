FROM node:20.10-alpine

WORKDIR /app

ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm i
COPY ./src src/

CMD ["npm", "run", "start"]