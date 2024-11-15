FROM node:20.18.0-alpine3.19 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Serve the frontend with a static server
FROM node:20.18.0-alpine3.19

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Expose port 8080
EXPOSE 8080

# Start the static server
CMD ["serve", "-s", "dist", "-l", "8080"]