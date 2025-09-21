# Etapa 1: Construcción con Maven + JDK 17
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copia pom.xml primero para cachear dependencias
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copia todo el código fuente
COPY src ./src

# Compila el proyecto sin ejecutar tests
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución con JRE 17
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Instala curl para health checks (útil en Render)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copia el JAR compilado desde la etapa builder
COPY --from=builder /app/target/*.jar app.jar

# Puerto que Render asignará dinámicamente
EXPOSE 8080

# Variables de entorno para optimización en producción
ENV JAVA_OPTS="-Xmx512m -Xms256m -Djava.security.egd=file:/dev/./urandom"

# Comando de ejecución optimizado para Render
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -jar app.jar"]