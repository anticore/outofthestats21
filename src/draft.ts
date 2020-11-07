import path from "path";

import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import _ from "lodash";
import { parse } from "node-html-parser";

import { db, setPlayers } from "./db";
import {
    rateDraft1B,
    rateDraft2B,
    rateDraft3B,
    rateDraftC,
    rateDraftCF,
    rateDraftLF,
    rateDraftP,
    rateDraftRF,
    rateDraftSS,
} from "./formulae";
import { PlayerData, PlayerPosition } from "./playerData";
import {
    getAccuracy,
    getBats,
    getDurability,
    getHSCYear,
    getHeight,
    getPitcherType,
    getSignability,
    getThrows,
    getVelocity,
    getWeight,
} from "./utils";

const DATA: { [playerName: string]: PlayerData } = {};

export async function draft() {
    console.log(chalk.bold("\nRunning draft mode..."));

    const fileLocations = {
        basic: path.resolve("./reports/basic.html"),
        stats: path.resolve("./reports/stats.html"),
        batting: path.resolve("./reports/batting.html"),
        fielding: path.resolve("./reports/fielding.html"),
        defense: path.resolve("./reports/defense.html"),
        pitching: path.resolve("./reports/pitching.html"),
        pitches: path.resolve("./reports/pitches.html"),
    };

    await parseBasicFile(fileLocations.basic);
    await parseStatsFile(fileLocations.stats);
    await parseBattingFile(fileLocations.batting);
    await parseFieldingFile(fileLocations.fielding);
    await parseDefenseFile(fileLocations.defense);
    await parsePitchingFile(fileLocations.pitching);
    await parsePitchesFile(fileLocations.pitches);
    console.log(chalk.bold(chalk.green("Done parsing.\n")));

    await calcRatings();
    console.log(chalk.bold(chalk.green("Done calculating ratings.\n")));

    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What to do with the results?",
            choices: ["Print"],
            filter: function (val) {
                return val.toLowerCase();
            },
        })
        .then(({ action }) => {
            switch (action) {
                case "print":
                    return printBest(20, 30);
            }
        });
}

function parseBasicFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
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
                    if (index == 29)
                        player.injuryProne = getDurability(content);
                    if (index == 33)
                        player.signability = getSignability(content);
                    if (index == 35) player.accuracy = getAccuracy(content);
                });

                DATA[player.name] = player;
            });

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function parseStatsFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
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
                    if (index == 23)
                        player.stats.G = content ? Number(content) : 0;
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

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function parseBattingFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
        console.log("Parsing batting data...");

        fs.readFile(fileLocation, "utf8", (err, data) => {
            let statsParse = parse(data);
            let rows = statsParse.querySelectorAll("tr");

            rows.filter((_, index) => index > 2).forEach((row, index) => {
                let player: any = {};

                row.childNodes.forEach((child, index) => {
                    let content = child.rawText;

                    if (index == 7) {
                        player = DATA[content];
                        player.batting = {};
                        player.baserunning = {};
                    }
                    if (index == 19)
                        player.batting.potContact = Number(content);
                    if (index == 21) player.batting.potGap = Number(content);
                    if (index == 23) player.batting.potPower = Number(content);
                    if (index == 25) player.batting.potEye = Number(content);
                    if (index == 27) player.batting.potAvoidK = Number(content);
                    if (index == 29)
                        player.baserunning.potSpeed = Number(content);
                    if (index == 31)
                        player.baserunning.potStealing = Number(content);
                    if (index == 33)
                        player.baserunning.potBaserunning = Number(content);
                });

                DATA[player.name] = player;
            });

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function parseFieldingFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
        console.log("Parsing fielding data...");

        fs.readFile(fileLocation, "utf8", (err, data) => {
            let statsParse = parse(data);
            let rows = statsParse.querySelectorAll("tr");

            rows.filter((_, index) => index > 2).forEach((row, index) => {
                let player: any = {};

                row.childNodes.forEach((child, index) => {
                    let content = child.rawText;

                    if (index == 7) {
                        player = DATA[content];
                        player.fielding = {};
                    }

                    if (index == 17)
                        player.fielding.infieldRange = Number(content);
                    if (index == 19)
                        player.fielding.infieldArm = Number(content);
                    if (index == 21) player.fielding.turnDP = Number(content);
                    if (index == 23)
                        player.fielding.infieldError = Number(content);
                    if (index == 25)
                        player.fielding.outfieldRange = Number(content);
                    if (index == 27)
                        player.fielding.outfieldArm = Number(content);
                    if (index == 29)
                        player.fielding.outfieldError = Number(content);
                    if (index == 31)
                        player.fielding.catcherArm = Number(content);
                    if (index == 33)
                        player.fielding.catcherAbility = Number(content);
                });

                DATA[player.name] = player;
            });

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function parseDefenseFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
        console.log("Parsing defense data...");

        fs.readFile(fileLocation, "utf8", (err, data) => {
            let statsParse = parse(data);
            let rows = statsParse.querySelectorAll("tr");

            rows.filter((_, index) => index > 2).forEach((row, index) => {
                let player: any = {};

                row.childNodes.forEach((child, index) => {
                    let content = child.rawText;

                    if (index == 7) {
                        player = DATA[content];
                        player.defense = {};
                    }

                    if (index == 17)
                        player.defense.def =
                            content === "-" ? 0 : Number(content);
                    if (index == 19)
                        player.defense.p =
                            content === "-" ? 0 : Number(content);
                    if (index == 21)
                        player.defense.fb =
                            content === "-" ? 0 : Number(content);
                    if (index == 23)
                        player.defense.sb =
                            content === "-" ? 0 : Number(content);
                    if (index == 25)
                        player.defense.tb =
                            content === "-" ? 0 : Number(content);
                    if (index == 27)
                        player.defense.ss =
                            content === "-" ? 0 : Number(content);
                    if (index == 29)
                        player.defense.lf =
                            content === "-" ? 0 : Number(content);
                    if (index == 31)
                        player.defense.cf =
                            content === "-" ? 0 : Number(content);
                    if (index == 33)
                        player.defense.rf =
                            content === "-" ? 0 : Number(content);
                    if (index == 35)
                        player.defense.c =
                            content === "-" ? 0 : Number(content);
                });

                DATA[player.name] = player;
            });

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function parsePitchingFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
        console.log("Parsing pitching data...");

        fs.readFile(fileLocation, "utf8", (err, data) => {
            let statsParse = parse(data);
            let rows = statsParse.querySelectorAll("tr");

            rows.filter((_, index) => index > 2).forEach((row, index) => {
                let player: any = {};

                row.childNodes.forEach((child, index) => {
                    let content = child.rawText;

                    if (index == 7) {
                        player = DATA[content];
                        player.pitching = {};
                    }

                    if (index == 19) player.pitching.potStuff = Number(content);
                    if (index == 21)
                        player.pitching.potMovement = Number(content);
                    if (index == 23)
                        player.pitching.potControl = Number(content);
                    if (index == 25)
                        player.pitching.velocity = getVelocity(content);
                    if (index == 27) player.pitching.stamina = Number(content);
                    if (index == 29)
                        player.pitching.type = getPitcherType(content);
                    if (index == 31) player.pitching.hold = Number(content);
                });

                DATA[player.name] = player;
            });

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function parsePitchesFile(fileLocation: fs.PathLike) {
    return new Promise((resolve, reject) => {
        console.log("Parsing individual pitches data...");

        fs.readFile(fileLocation, "utf8", (err, data) => {
            let statsParse = parse(data);
            let rows = statsParse.querySelectorAll("tr");

            rows.filter((_, index) => index > 2).forEach((row, index) => {
                let player: any = {};

                row.childNodes.forEach((child, index) => {
                    let content = child.rawText;

                    if (index == 7) {
                        player = DATA[content];
                        player.pitching = player.pitching || {};
                    }

                    if (index == 15)
                        player.pitching.potFB =
                            content === "-" ? 0 : Number(content);
                    if (index == 17)
                        player.pitching.potCHP =
                            content === "-" ? 0 : Number(content);
                    if (index == 19)
                        player.pitching.potCBP =
                            content === "-" ? 0 : Number(content);
                    if (index == 21)
                        player.pitching.potSL =
                            content === "-" ? 0 : Number(content);
                    if (index == 23)
                        player.pitching.potSI =
                            content === "-" ? 0 : Number(content);
                    if (index == 25)
                        player.pitching.potSPL =
                            content === "-" ? 0 : Number(content);
                    if (index == 27)
                        player.pitching.potCUT =
                            content === "-" ? 0 : Number(content);
                    if (index == 29)
                        player.pitching.potFRK =
                            content === "-" ? 0 : Number(content);
                    if (index == 31)
                        player.pitching.potCC =
                            content === "-" ? 0 : Number(content);
                    if (index == 33)
                        player.pitching.potSC =
                            content === "-" ? 0 : Number(content);
                    if (index == 35)
                        player.pitching.potKC =
                            content === "-" ? 0 : Number(content);
                    if (index == 37)
                        player.pitching.potKN =
                            content === "-" ? 0 : Number(content);
                    if (index == 39) player.pitching.pitches = Number(content);
                });

                DATA[player.name] = player;
            });

            setPlayers(DATA).then(() => resolve());
        });
    });
}

function calcRatings() {
    console.log("Calculating draft ratings...");

    const formulae: { [position: string]: (player: PlayerData) => number } = {
        c: rateDraftC,
        fb: rateDraft1B,
        sb: rateDraft2B,
        ss: rateDraftSS,
        tb: rateDraft3B,
        lf: rateDraftLF,
        cf: rateDraftCF,
        rf: rateDraftRF,
        p: rateDraftP,
    };

    Object.values(DATA).forEach((player: PlayerData) => {
        player.ratings = {
            custom: {
                total: 0,
            },
        };

        if (player.name)
            Object.keys(formulae).forEach((position: string) => {
                (player.ratings.custom as any)[position] = formulae[position](
                    player
                );
                player.ratings.custom.total = player.ratings.custom.total
                    ? player.ratings.custom.total + formulae[position](player)
                    : formulae[position](player);
            });
    });

    setPlayers(DATA);
}

async function printBest(amount: number, totalAmount: number) {
    console.log(
        chalk.bold(chalk.blueBright("\nHere are the best rated players:"))
    );

    let players: PlayerData[] = Object.values(DATA).filter(
        (player) => !!player.name
    );

    function sortByRating(ps: PlayerData[], r: string) {
        return ps.sort(function (a, b) {
            let kA = (a.ratings.custom as any)[r];
            let kB = (b.ratings.custom as any)[r];

            if (kA > kB) return -1;
            if (kA < kB) return 1;
            return 0;
        });
    }

    console.log("\n");
    console.log(chalk.bold("Catcher"));
    _.take(sortByRating(players, "c"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name} [${player.ratings.custom.c}]`)
    );

    console.log("\n");
    console.log(chalk.bold("First base"));
    _.take(sortByRating(players, "fb"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name} [${player.ratings.custom.fb}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Second base"));
    _.take(sortByRating(players, "sb"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name} [${player.ratings.custom.sb}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Shortstop"));
    _.take(sortByRating(players, "ss"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name} [${player.ratings.custom.ss}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Third base"));
    _.take(sortByRating(players, "tb"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name} [${player.ratings.custom.tb}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Left field"));
    _.take(sortByRating(players, "lf"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name}  [${player.ratings.custom.lf}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Center field"));
    _.take(sortByRating(players, "cf"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name}  [${player.ratings.custom.cf}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Right field"));
    _.take(sortByRating(players, "rf"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name}  [${player.ratings.custom.rf}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Pitcher"));
    _.take(sortByRating(players, "p"), amount).forEach((player: PlayerData) =>
        console.log(`${player.name}  [${player.ratings.custom.p}]`)
    );

    console.log("\n");
    console.log(chalk.bold("Total"));
    _.take(
        sortByRating(players, "total"),
        totalAmount
    ).forEach((player: PlayerData) =>
        console.log(`${player.name}  [${player.ratings.custom.total}]`)
    );
}
