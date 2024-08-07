# Base Stage for all following stages
# called first to install deps and profit from caching
FROM node:16-alpine as base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN yarn install

# App Stage
FROM base as app

# Define a default PORT if not set
ENV PORT=8080

# Expose the port the app runs on
EXPOSE $PORT

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Start the application
ENTRYPOINT ["yarn", "start"]
