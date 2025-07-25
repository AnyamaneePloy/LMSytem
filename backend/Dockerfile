FROM node:18-alpine

# Set working dir inside backend folder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --production

# Copy all backend files (including server.js and db)
COPY . .

# Expose and run
EXPOSE 4000
CMD ["node", "server.js"]
