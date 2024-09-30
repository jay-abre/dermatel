# Use an official OpenJDK runtime as a parent image
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Grant execute permission to mvnw
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean install

# Run the application
CMD ["java", "-jar", "target/your-app.jar"]