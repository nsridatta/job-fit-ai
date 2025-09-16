# Build stage
FROM maven:3.9.9-eclipse-temurin-17-focal AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine
ARG PORT=8080
ENV PORT=${PORT}
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT}
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]