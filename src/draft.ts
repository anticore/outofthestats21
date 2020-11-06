import path from "path";

import chalk from "chalk";
import fs from "fs-extra";
import { LowdbSync } from "lowdb";
import { parse } from "node-html-parser";

import { addPlayer, setPlayers } from "./db";
import { Durability, PlayerData, PlayerPosition } from "./playerData";
import {
    getAccuracy,
    getBats,
    getDurability,
    getHSCYear,
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

        rows.filter((_, index) => index > 2).forEach((row, index) => {
            let player: any = {};

            player.index = index;

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

        setPlayers(DATA);
    });
}

function parseStatsFile(fileLocation: fs.PathLike) {
    console.log("Parsing stats data...");

    fs.readFile(fileLocation, "utf8", (err, data) => {
        let statsParse = parse(data);
        let rows = statsParse.querySelectorAll("tr");

        rows.filter((_, index) => index > 2).forEach((row, index) => {
            let player: any = {};

            row.childNodes.forEach((child, index) => {
                let content = child.rawText;

                if (index == 7) {
                    player = DATA[content];
                    player.stats = {};
                }
                if (index == 17) player.school = content;
                if (index == 19) player.stats.competition = content;
                if (index == 21) player.stats.hsc = getHSCYear(content);
                if (index == 23) player.stats.G = content ? Number(content) : 0;
                if (index == 25) player.stats.PA = Number(content);
                if (index == 27) player.stats.AB = Number(content);
                if (index == 29) player.stats.H = Number(content);
                if (index == 31) player.stats.HR = Number(content);
                if (index == 33) player.stats.RBI = Number(content);
                if (index == 35) player.stats.BB = Number(content);
                if (index == 37) player.stats.SO = Number(content);
                if (index == 39) player.stats.AVG = Number(content);
                if (index == 41) player.stats.OBP = Number(content);
                if (index == 43) player.stats.SLG = Number(content);
                if (index == 45) player.stats.OPS = Number(content);
                if (index == 47) player.stats.GP = Number(content);
                if (index == 49) player.stats.GS = Number(content);
                if (index == 51) player.stats.W = Number(content);
                if (index == 53) player.stats.L = Number(content);
                if (index == 55) player.stats.SV = Number(content);
                if (index == 57) player.stats.IP = Number(content);
                if (index == 59) player.stats.HA = Number(content);
                if (index == 61) player.stats.HRA = Number(content);
                if (index == 63) player.stats.BBA = Number(content);
                if (index == 65) player.stats.K = Number(content);
                if (index == 67) player.stats.ERA = Number(content);
            });

            DATA[player.name] = player;
        });

        setPlayers(DATA);
    });
}

function parseBattingFile(fileLocation: fs.PathLike) {}

function parseFieldingFile(fileLocation: fs.PathLike) {}

function parsePitchingFile(fileLocation: fs.PathLike) {}

function parsePitchesFile(fileLocation: fs.PathLike) {}
