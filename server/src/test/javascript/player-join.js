import Client from "./client.js";

export async function join(playerId, teamId) {
    const client = new Client(URL, playerId);
    client.connect();

    const message = JSON.stringify({
        type: "JOIN",
        playerId: playerId,
        teamId: teamId
    });

    await client.send(message);
}

const playerId = "player1";
const teamId = "RED"
await join(playerId, teamId);
