# Use an official OpenJDK runtime as a parent image
FROM openjdk:11-jre-slim

# Set the JAVA_HOME environment variable
ENV JAVA_HOME=/usr/local/openjdk-11
ENV PATH=$JAVA_HOME/bin:$PATH

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Grant execute permission to mvnw
RUN chmod +x ./mvnw

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN ./mvnw clean install

# Run the application
CMD ["java", "-jar", "target/your-app.jar"]