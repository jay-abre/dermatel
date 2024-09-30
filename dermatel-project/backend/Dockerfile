# Use an official OpenJDK runtime as a parent image
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Build the application
RUN ./mvnw clean install

# Run the application
CMD ["java", "-jar", "target/dermatel-0.0.1-SNAPSHOT.jar"]