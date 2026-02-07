## Multi-stage build: compile with Maven, produce minimal runtime image
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy pom and download dependencies first (leverages layer caching)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy sources and build
COPY . .
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
