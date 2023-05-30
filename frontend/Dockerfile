# Build step #1: build the React front end
FROM node:17-alpine as build-step
WORKDIR /app
COPY package.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN yarn build

COPY . .

EXPOSE 3000

CMD ["npm", "start" ]