import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import { PlayerData } from "./playerData";

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ players: {}, playerCount: 0 }).write();

export function addPlayer(playerName: string, player: PlayerData) {
    db.set("players." + playerName, player).write();
    db.update("playerCount", (n) => n + 1).write();
}

export function setPlayers(players: { [playerName: string]: PlayerData }) {
    db.set("players", players).write();
    db.set("playerCount", Object.keys(players).length).write();
}
