# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install dependencies
RUN npm install

# Build the app for production
RUN npm run build

# Serve the app
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD ["serve", "-s", "build"]