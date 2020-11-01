import path from "path";

import chalk from "chalk";
import fs from "fs-extra";
import { parse } from "node-html-parser";

import { Durability, PlayerData, PlayerPosition } from "./playerData";
import {
    getAccuracy,
    getBats,
    getDurability,
    getHeight,
    getSignability,
    getThrows,
    getWeight,
} from "./utils";

const DATA: { [playerName: string]: PlayerData } = {};

export function draft() {
    console.log(chalk.bold("\nRunning draft mode..."));

    const fileLocations = {
        basic: path.resolve("./reports/basic.html"),
        stats: path.resolve("./reports/stats.html"),
        batting: path.resolve("./reports/batting.html"),
        fielding: path.resolve("./reports/fielding.html"),
        pitching: path.resolve("./reports/pitching.html"),
        pitches: path.resolve("./reports/pitches.html"),
    };

    parseBasicFile(fileLocations.basic);
    parseStatsFile(fileLocations.stats);
    parseBattingFile(fileLocations.batting);
    parseFieldingFile(fileLocations.fielding);
    parsePitchingFile(fileLocations.pitching);
    parsePitchesFile(fileLocations.pitches);
}

function parseBasicFile(fileLocation: fs.PathLike) {
    console.log("Parsing basic data...");

    fs.readFile(fileLocation, "utf8", (err, data) => {
        let basicParse = parse(data);
        let rows = basicParse.querySelectorAll("tr");

        rows.filter((_, index) => index > 1).forEach((row) => {
            let player: any = {};

            row.childNodes.forEach((child, index) => {
                let content = child.rawText;

                if (index == 3) player.position = content as PlayerPosition;
                if (index == 5) player.age = Number(content);
                if (index == 7) player.name = content;
                if (index == 11) player.birthdate = new Date(content);
                if (index == 13) player.age = Number(content);
                if (index == 15) player.nationality = content;
                if (index == 17) player.height = getHeight(content);
                if (index == 19) player.weight = getWeight(content);
                if (index == 21) player.bats = getBats(content);
                if (index == 23) player.throws = getThrows(content);
                if (index == 29) player.injuryProne = getDurability(content);
                if (index == 33) player.signability = getSignability(content);
                if (index == 35) player.accuracy = getAccuracy(content);
            });

            DATA[player.name] = player;
        });
    });
}

function parseStatsFile(fileLocation: fs.PathLike) {}

function parseBattingFile(fileLocation: fs.PathLike) {}

function parseFieldingFile(fileLocation: fs.PathLike) {}

function parsePitchingFile(fileLocation: fs.PathLike) {}

function parsePitchesFile(fileLocation: fs.PathLike) {}
