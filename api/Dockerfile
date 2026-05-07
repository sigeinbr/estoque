FROM node:20.14-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start"]
