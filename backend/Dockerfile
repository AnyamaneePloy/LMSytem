# Use Node.js 18 Alpine image
FROM node:18-alpine

# Create working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --production

# Copy app files
COPY server.js .
COPY db_reopen.json .

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
