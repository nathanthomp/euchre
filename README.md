# EUCHRE

Turn based trick-taking card game.

To start playing this game, a client must connect to the server. Once this connection is established over a ws:// connection, the client must send a JOIN message with a playerId to be added to the game. If the client wants to leave the game voluntarily, the client must send a LEAVE message. Doing so will remove the player from the game, but keep the ws:// connection in tact. If in the event that the client disconnects from the ws:// connection, the player will be removed from the game, and the ws:// connection will be lost.

Once there are 4 clients connected to the server, the game can start. If any of the 4 clients leave or disconnect, the game will be paused. In the time that there are greater than 0 but less than 4 clients, the game will be in a waiting state.

## Understanding the Codebase

### Actions

Actions are parsed messages that come into the websocket.

```bash
# JOIN
{"type": "JOIN", "playerId": "player1"}

# LEAVE
{"type": "LEAVE"}

```

### Events

```bash

```

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
