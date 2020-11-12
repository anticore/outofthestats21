import path from "path";

import fs from "fs-extra";
import _ from "lodash";
import { parse } from "node-html-parser";

import * as formulae from "./formulae";
import { log, write } from "./md";
import { PlayerData } from "./playerData";
import { tableOrder } from "./tableOrder";

let players: any[] = [];

export async function rate() {
    const fileLocation = path.resolve("./data/data.html");
    await parseFile(fileLocation);
    await calcRatings();
    printBest(20, 25);
    write("report.md");
}

function parseFile(fileLocation: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileLocation, "utf8", (err, d) => {
            let data = parse(d);
            let rows = data.querySelectorAll("tr");

            rows.filter(
                (row, index) => index > 2 && index < rows.length - 1
            ).forEach((row, index) => {
                let player: any = {};

                row.childNodes
                    .filter((_, index) => index % 2 != 0)
                    .forEach((child, index) => {
                        let content = child.rawText;
                        player[tableOrder[index][0]] = tableOrder[index][1](
                            content
                        );
                    });

                players.push(player);
            });

            resolve();
        });
    });
}

function calcRatings() {
    const fs: {
        [position: string]: (player: PlayerData) => number;
    } = {
        c: formulae.rateC,
        fb: formulae.rate1B,
        sb: formulae.rate2B,
        ss: formulae.rateSS,
        tb: formulae.rate3B,
        lf: formulae.rateLF,
        cf: formulae.rateCF,
        rf: formulae.rateRF,
        p: formulae.rateP,
    };

    Object.values(players).forEach((player: PlayerData) => {
        player.ratings = {
            total: 0,
        };

        Object.keys(fs).forEach((position: string) => {
            (player.ratings as any)[position] = fs[position](player);
            player.ratings.total = player.ratings.total
                ? player.ratings.total + fs[position](player)
                : fs[position](player);
        });
    });
}

function printBest(amount: number, totalAmount: number) {
    log("Here are the best ranked players:");

    function sortByRating(ps: PlayerData[], r: string) {
        return ps.sort(function (a, b) {
            let kA = (a.ratings as any)[r];
            let kB = (b.ratings as any)[r];

            if (kA > kB) return -1;
            if (kA < kB) return 1;
            return 0;
        });
    }

    log("\n");
    log("### Catcher");
    _.take(sortByRating(players, "c"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name} [${player.ratings.c}]`)
    );

    log("\n");
    log("### First base");
    _.take(sortByRating(players, "fb"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name} [${player.ratings.fb}]`)
    );

    log("\n");
    log("### Second base");
    _.take(sortByRating(players, "sb"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name} [${player.ratings.sb}]`)
    );

    log("\n");
    log("### Shortstop");
    _.take(sortByRating(players, "ss"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name} [${player.ratings.ss}]`)
    );

    log("\n");
    log("### Third base");
    _.take(sortByRating(players, "tb"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name} [${player.ratings.tb}]`)
    );

    log("\n");
    log("### Left field");
    _.take(sortByRating(players, "lf"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name}  [${player.ratings.lf}]`)
    );

    log("\n");
    log("### Center field");
    _.take(sortByRating(players, "cf"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name}  [${player.ratings.cf}]`)
    );

    log("\n");
    log("### Right field");
    _.take(sortByRating(players, "rf"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name}  [${player.ratings.rf}]`)
    );

    log("\n");
    log("### Pitcher");
    _.take(sortByRating(players, "p"), amount).forEach((player: PlayerData) =>
        log(`* ${player.name}  [${player.ratings.p}]`)
    );

    log("\n");
    log("### Total");
    _.take(
        sortByRating(players, "total"),
        totalAmount
    ).forEach((player: PlayerData) =>
        log(`* ${player.name}  [${player.ratings.total}]`)
    );
}
