FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./
COPY db_reopen.json ./db_reopen.json

EXPOSE 4000
CMD ["node", "server.js"]
