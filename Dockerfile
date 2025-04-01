# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Set up Nginx to serve the production build
FROM nginx:alpine3.18

# Copy the build folder from the build container to the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set correct permissions for the files
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]