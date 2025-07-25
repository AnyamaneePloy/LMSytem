# Use official Node image to build the React app
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app and build it
COPY . .
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
