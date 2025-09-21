# 🏫 Gestor Escolar

Sistema web desarrollado con Spring Boot 3.5.4 para la gestión escolar con soporte para MySQL y PostgreSQL.

## 🛠️ Tecnologías

- **Java 17** + **Spring Boot 3.5.4**
- **Spring Data JPA** - Persistencia de datos
- **Spring Boot Validation** - Validación de datos
- **Spring Boot Actuator** - Monitoreo y métricas
- **SpringDoc OpenAPI** - Documentación de API
- **MySQL / PostgreSQL** - Base de datos
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código
- **Docker** - Containerización

## 📋 Requisitos

- Java 17+
- Maven 3.6+
- MySQL 8.0+ o PostgreSQL 12+

## 🗄️ Configuración de Base de Datos Local

### Opción 1: MySQL

1. **Instalar y configurar MySQL:**

```sql
-- Crear base de datos
CREATE DATABASE gestor_escolar;

-- Crear usuario
CREATE USER 'gestor_user'@'localhost' IDENTIFIED BY 'gestor123';
GRANT ALL PRIVILEGES ON gestor_escolar.* TO 'gestor_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Configurar application-local.properties:**

```properties
spring.application.name=gestor-escolar
server.port=8080

# MySQL Local
spring.datasource.url=jdbc:mysql://localhost:3306/gestor_escolar
spring.datasource.username=gestor_user
spring.datasource.password=gestor123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### Opción 2: PostgreSQL

1. **Instalar y configurar PostgreSQL:**

```bash
# Conectar a PostgreSQL
sudo -u postgres psql

# En PostgreSQL:
CREATE DATABASE gestor_escolar;
CREATE USER gestor_user WITH PASSWORD 'gestor123';
GRANT ALL PRIVILEGES ON DATABASE gestor_escolar TO gestor_user;
```

2. **Configurar application-local.properties:**

```properties
spring.application.name=gestor-escolar
server.port=8080

# PostgreSQL Local
spring.datasource.url=jdbc:postgresql://localhost:5432/gestor_escolar
spring.datasource.username=gestor_user
spring.datasource.password=gestor123
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## 🚀 Ejecutar la Aplicación

```bash
# Clonar proyecto
git clone https://github.com/neisserdev/gestor-escolar.git
cd gestor-escolar

# Ejecutar con perfil local
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# O en Windows
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

## 📚 Documentación de API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación de la API en:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🐳 Docker

El proyecto incluye un Dockerfile para facilitar el despliegue:

```bash
# Construir imagen
docker build -t gestor-escolar .

# Ejecutar contenedor
docker run -p 8080:8080 gestor-escolar
```

## 📝 Notas

- Las tablas se crean automáticamente con `hibernate.ddl-auto=update`
- Usa el perfil `local` para desarrollo
- El perfil por defecto usa la configuración de producción
- Spring Boot Actuator proporciona endpoints de monitoreo en `/actuator`

## 👨‍💻 Autor

**Neisser Torres Peña** - [@neisserdev](https://github.com/neisserdev)