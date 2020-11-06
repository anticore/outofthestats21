import {
    Bats,
    Durability,
    HSCYear,
    PitcherType,
    ScoutAccuracy,
    Signability,
    Throws,
} from "./playerData";

export function getHeight(content: string): number {
    return 0;
}

export function getWeight(content: string): number {
    return 0;
}

export function getBats(content: string): Bats {
    switch (content) {
        case "Right":
            return "R";
        case "Left":
            return "L";
        case "Switch":
            return "S";
        default:
            return "R";
    }
}

export function getThrows(content: string): Throws {
    switch (content) {
        case "Right":
            return "R";
        case "Left":
            return "L";
        default:
            return "R";
    }
}

export function getDurability(content: string): Durability {
    switch (content) {
        case "Normal":
            return Durability.Normal;
        case "Fragile":
            return Durability.Fragile;
        case "Durable":
            return Durability.Durable;
        default:
            return Durability.Normal;
    }
}

export function getSignability(content: string): Signability {
    switch (content) {
        case "Very Easy":
            return Signability.VE;
        case "Easy":
            return Signability.E;
        case "Hard":
            return Signability.H;
        default:
            return Signability.EH;
    }
}

export function getAccuracy(content: string): ScoutAccuracy {
    switch (content) {
        case "High":
            return ScoutAccuracy.High;
        case "Average":
            return ScoutAccuracy.Average;
        case "Low":
            return ScoutAccuracy.Low;
        default:
            return ScoutAccuracy.Average;
    }
}

export function getHSCYear(content: string): HSCYear {
    return HSCYear["CO Junior"];
}

export function getVelocity(
    content: string
): { min: number; max: number; avg: number } {
    let min = Number(content.split("-")[0]);
    let max = Number(content.split("-")[1].split(" ")[0]);
    let avg = (max - min) / 2;

    return { min, max, avg };
}

export function getPitcherType(content: string): PitcherType {
    return PitcherType["EX FB"];
}
