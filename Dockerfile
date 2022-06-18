FROM node:16-alpine

WORKDIR /app

RUN npm i -g pnpm@7.1.5

COPY package.json pnpm-lock.yaml ./ 

RUN pnpm setup && pnpm add nodemon

RUN pnpm install  

COPY . .

EXPOSE 4001

CMD pnpm run start

