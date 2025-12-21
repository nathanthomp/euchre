import Client from "./client.js"
import Player from "./player.js";

const players = [
    new Player('player1', "RED"),
    new Player('player2', "RED"),
    new Player('player3', "BLACK"),
    new Player('player4', "BLACK")
];

const clients = players.map(player => new Client(player));

clients.forEach((client, i) => {
    client.connect();
});

for (const client of clients) {
    await client.wait(500);
    
    client.send(JSON.stringify({
        type: 'JOIN',
        playerId: client.player.id,
        teamId: client.player.teamId
    }));
}

const firstClient = clients[0];

await firstClient.wait(500);

firstClient.send(JSON.stringify({
    type: "START_GAME"
}))