import ObjectsToCsv from "objects-to-csv";

import { db } from "./db";
import { PlayerData } from "./playerData";

export async function writeDraftToCSV() {
    let players: { [playerName: string]: PlayerData } = await (db.get(
        "players"
    ) as any)
        .sortBy("ratings.stein")
        .value();

    console.log("Writing draft data to CSV file...");

    let rows: { name: string; position: string; stein: number }[] = [];

    Object.keys(players).forEach((playerName: string) => {
        let player = players[playerName];

        if (
            player.name &&
            player.position &&
            player.ratings &&
            player.ratings.stein
        )
            rows.push({
                name: player.name,
                position: player.position,
                stein: player.ratings.stein,
            });
    });

    const csv = new ObjectsToCsv(rows);

    await csv.toDisk("draft.csv");
}
