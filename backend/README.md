# Jira Clone

A simple ticketing system I built to learn more about Spring Boot and REST APIs. It's loosely inspired by Jira but kept minimal - just the stuff I actually needed for tracking issues.

## Why this exists

I wanted a place to manage projects and tickets where each project can have its own workflow. Instead of being stuck with predefined statuses, you can define what statuses actually make sense for your team. Plus, role-based access keeps things organized.

## What's included

- Projects with custom statuses and transitions
- Member roles: Admin, Manager, Developer, Reporter
- Tickets with assignees, priorities, and comments
- JWT authentication with refresh tokens
- Rate limiting and account lockout for security

## Tech I used

- Java 17 + Spring Boot 3.1.4
- Spring Data JPA (Hibernate)
- PostgreSQL
- Spring Security with JWT
- Swagger for API docs
- Maven + Docker

## Getting started

### Prerequisites
Java 17, Maven, Docker (optional)

### Option 1: Docker (easiest)
```bash
docker-compose up -d
```
This starts the app and database together.

**Note:** Copy `.env.example` to `.env` and update the values before running.

### Option 2: Run locally with Docker Postgres
1. Set required environment variables in your shell or IDE run configuration (at minimum `JWT_SECRET`; optionally `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
2. Run:
```bash
docker-compose up -d postgres
mvn clean package
java -jar target/jira-clone-0.1.0.jar
```

### Option 3: Your own PostgreSQL
1. Create a database called `jiraclone`
2. Set `JWT_SECRET` and your DB credentials as environment variables (in your shell or IDE).
3. Run:
```bash
mvn spring-boot:run
```

### Check it out
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Some API examples

### Register
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"SecurePass1!"}'
```

### Login
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"SecurePass1!"}'
```

### Create a project
```bash
curl -X POST "http://localhost:8080/api/projects" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"key":"PROJ","name":"My Project","description":"Example","statuses":["TODO","IN_PROGRESS","DONE"]}'
```

## Security

- JWT with access and refresh tokens
- Rate limited login (5 attempts/minute per IP)
- Account locks for 15 minutes after 5 failed logins
- Passwords must be 8+ chars with uppercase, lowercase, digit, and special char
- BCrypt hashing (12 rounds)

## Running in production

- Change `JWT_SECRET` in your environment
- Use strong database credentials

## License

MIT
