# Use a more recent Maven image with OpenJDK 17
FROM maven:3.8.5-openjdk-17-slim

# Set the working directory
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy the project source
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Run the application
CMD ["java", "-jar", "target/dermatel-0.0.1-SNAPSHOT.jar"]