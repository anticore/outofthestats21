import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import { PlayerData } from "./playerData";

const adapter = new FileSync("db.json");
export const db = low(adapter);

db.defaults({ players: {}, playerCount: 0 }).write();

export async function addPlayer(playerName: string, player: PlayerData) {
    await db.set("players." + playerName, player).write();
    await db.update("playerCount", (n) => n + 1).write();
}

export async function setPlayers(players: {
    [playerName: string]: PlayerData;
}) {
    await db.set("players", players).write();
    await db.set("playerCount", Object.keys(players).length).write();
}
