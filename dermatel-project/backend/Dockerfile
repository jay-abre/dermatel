# Use an official Maven image with OpenJDK 11
FROM maven:3.8.6-openjdk-11-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Build the application
RUN mvn clean install

# Run the application
CMD ["java", "-jar", "target/dermatel-0.0.1-SNAPSHOT.jar"]