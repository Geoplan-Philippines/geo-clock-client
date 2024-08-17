# Step 1: Build the Angular application
FROM node:18-alpine as BUILD

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy the Angular app source code
COPY . .

# Build the Angular app
RUN npm run build

# Step 2: Serve the Angular application using Nginx
FROM nginx:alpine

# Copy the built Angular files from the previous stage
COPY --from=build /app/dist/official-geoplan-site /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]