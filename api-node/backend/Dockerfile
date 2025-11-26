FROM node:18-alpine

WORKDIR /app

# Necesario para compilar sqlite3 (node-gyp)
RUN apk add --no-cache python3 py3-setuptools make g++

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
