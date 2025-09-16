# Build stage
FROM maven:3.9.9-eclipse-temurin-17-focal AS build
WORKDIR /app

# Copy only the backend directory contents
COPY pom.xml .
COPY src ./src

# Download dependencies and build
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine
ARG PORT=8080
ENV PORT=${PORT}

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT}

# Run the application
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]