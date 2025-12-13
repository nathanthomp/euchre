# EUCHRE

Turn based trick-taking card game.

## Server

Implemented with web sockets, the Euchre Server listens to HTTP requests from the client, and broadcasts messages back to client.

The Euchre Server is a Spring Boot 4 project written in Java 21.

```bash
# Run
mvn spring-boot:run

# Build
mvn clean package
```

## Client

The Euchre Client is a Angular 17 project written in Node 22.

```bash
# Run
ng serve

# Build
ng build
```
