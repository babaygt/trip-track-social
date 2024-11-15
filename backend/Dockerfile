FROM node:20.18.0-alpine3.19

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/bin/www.js"]