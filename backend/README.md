# Jira Clone – Backend API

This is the backend service for the Jira Clone project.

A REST API for managing projects, tickets, workflows, and authentication.

## Features

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
- Maven 
- Docker

## Getting started

### Prerequisites
Java 17, Maven, Docker (optional)

**Note:** Copy `.env.example` to `.env` and update the values before running.


### Option 1: Run with Docker (recommended)
```bash
docker-compose up -d
```
This will:
- Pull the latest image from Docker Hub (amirza041/jira-clone:latest)
- Start the backend service and database

### Option 2: Run locally without Docker
1. Create database
```bash
CREATE DATABASE jiraclone;
```
2. Run application
```bash
mvn spring-boot:run
```

### API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html

## Security

- JWT with access and refresh tokens
- Rate limited login (5 attempts/minute per IP)
- Account locks for 15 minutes after 5 failed logins
- Passwords must be 8+ chars with uppercase, lowercase, digit, and special char
- BCrypt hashing (12 rounds)

## CI/CD & Deployment
- CI/CD pipeline using GitHub Actions
- Docker image published to Docker Hub (`amirza041/jira-clone:latest`)
- Backend deployed on AWS EC2


## License

MIT
