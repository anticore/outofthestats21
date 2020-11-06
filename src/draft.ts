import path from "path";

import chalk from "chalk";
import fs from "fs-extra";
import { parse } from "node-html-parser";

import { writeDraftToCSV } from "./csv";
import { setPlayers } from "./db";
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

    await calcStein();

    console.log(chalk.bold(chalk.green("\nDONE!\n")));

    await writeDraftToCSV();
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

function calcStein() {
    console.log("Calculating Stein ratings...");

    const formulae = {
        C: (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.infieldRange * 3.5 +
                player.fielding.infieldError * 3 +
                player.baserunning.potStealing
            );
        },
        "1B": (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                (player.fielding.infieldRange * 3.5 +
                    player.fielding.infieldError * 3 +
                    player.fielding.infieldArm +
                    player.fielding.turnDP +
                    player.baserunning.potStealing) *
                    0.5
            );
        },
        "2B": (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.infieldRange * 2 +
                player.fielding.infieldError * 2 +
                player.fielding.infieldArm +
                player.fielding.turnDP +
                player.baserunning.potStealing
            );
        },
        SS: (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.infieldRange * 2 +
                player.fielding.infieldError * 2 +
                player.fielding.infieldArm * 2 +
                player.fielding.turnDP +
                player.baserunning.potStealing
            );
        },
        "3B": (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.infieldRange * 2 +
                player.fielding.infieldError * 2 +
                player.fielding.infieldArm * 2 +
                player.fielding.turnDP +
                player.baserunning.potStealing
            );
        },
        LF: (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.outfieldRange * 2.5 +
                player.fielding.outfieldError +
                player.fielding.outfieldArm * 2 +
                player.baserunning.potStealing
            );
        },
        CF: (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.outfieldRange * 5 +
                player.fielding.outfieldError +
                player.fielding.outfieldArm +
                player.baserunning.potStealing
            );
        },
        RF: (player: PlayerData) => {
            return (
                player.batting.potContact * 6 +
                player.batting.potGap * 2 +
                player.batting.potPower * 5 +
                player.batting.potEye * 4.5 +
                player.batting.potAvoidK * 2.5 +
                player.fielding.outfieldRange * 2.5 +
                player.fielding.outfieldError +
                player.fielding.outfieldArm * 2 +
                player.baserunning.potStealing
            );
        },
        SP: (player: PlayerData) => {
            return (
                player.pitching.potStuff * 4 +
                player.pitching.potMovement * 2.5 +
                player.pitching.potControl * 3 +
                player.pitching.stamina * 1.2 +
                player.pitching.holdRunners * 1.1 +
                player.pitching.velocity.avg * 2.5
            );
        },
        RP: (player: PlayerData) => {
            return (
                player.pitching.potStuff * 4 +
                player.pitching.potMovement * 2.5 +
                player.pitching.potControl * 3 +
                player.pitching.stamina * 1.2 +
                player.pitching.holdRunners * 1.1 +
                player.pitching.velocity.avg * 2.5
            );
        },
        CL: (player: PlayerData) => {
            return (
                player.pitching.potStuff * 4 +
                player.pitching.potMovement * 2.5 +
                player.pitching.potControl * 3 +
                player.pitching.stamina * 1.2 +
                player.pitching.holdRunners * 1.1 +
                player.pitching.velocity.avg * 2.5
            );
        },
    };

    Object.keys(DATA).forEach((playerName: string) => {
        let player: PlayerData = DATA[playerName];

        if (!formulae[player.position]) {
            console.log(
                chalk.yellow(
                    "formula not found for position " + player.position
                )
            );
            console.log(playerName, player);
            console.log("\n\n");
        } else {
            player.ratings = {
                stein: formulae[player.position](player),
            };
        }
    });

    setPlayers(DATA);
}
