export type PlayerPosition =
    | "SP"
    | "RP"
    | "CL"
    | "1B"
    | "2B"
    | "3B"
    | "SS"
    | "LF"
    | "RF"
    | "CF"
    | "C";

export type Bats = "L" | "R" | "S";
export type Throws = "L" | "R";

export enum Durability {
    "Fragile",
    "Normal",
    "Durable",
}

export enum Signability {
    "VE",
    "E",
    "H",
    "EH",
}

export enum ScoutAccuracy {
    "High",
    "Average",
    "Low",
}

export enum Competition {
    "Poor",
    "Fair",
    "Average",
    "Good",
    "Great",
}

export enum HSCYear {
    "HS Junior",
    "HS Sophomore",
    "HS Senior",
    "JuCo Freshman",
    "JuCo Sophomore",
    "JuCo Senior",
    "CO Junior",
    "CO Sophomore",
    "CO Senior",
}

export type ArmSlot = "Normal" | "Over the Top" | "Sidearm";

export enum PitcherType {
    "NEU",
    "FB",
    "GB",
    "EX FB",
    "EX GB",
}

export interface PlayerData {
    position: PlayerPosition;
    number: number;
    name: string;
    birthdate: Date;
    age: number;
    nationality: string;
    height: number;
    weight: number;
    bats: Bats;
    throws: Throws;
    injuryProne: Durability;
    signability: Signability;
    accuracy: ScoutAccuracy;

    batting: {
        potContact: number;
        potGap: number;
        potPower: number;
        potEye: number;
        potAvoidK: number;
    };

    baserunning: {
        potSpeed: number;
        potStealing: number;
        potBserunning: number;
    };

    defense: {
        p: number;
        fb: number;
        sb: number;
        tb: number;
        ss: number;
        lf: number;
        cf: number;
        rf: number;
        c: number;
    };

    pitching: {
        type: PitcherType;

        potStuff: number;
        potMovement: number;
        potControl: number;
        holdRunners: number;

        potFB: number | null;
        potCHP: number | null;
        potCBP: number | null;
        potSL: number | null;
        potSI: number | null;
        potSPL: number | null;
        potCUT: number | null;
        potFRK: number | null;
        potCC: number | null;
        potSC: number | null;
        potKC: number | null;
        potKN: number | null;
        pitches: number;

        velocity: { min: number; max: number };
        slot: ArmSlot;

        stamina: number;
    };

    stats: {
        competition: Competition;
        hsc: HSCYear;

        G: number;
        PA: number;
        AB: number;
        H: number;
        HR: number;
        RBI: number;
        BB: number;
        SO: number;
        AVG: number;
        OBP: number;
        SLG: number;
        OPS: number;
        GP: number;
        GS: number;
        W: number;
        L: number;
        SV: number;
        IP: number;
        HA: number;
        HRA: number;
        BBA: number;
        K: number;
        ERA: number;
    };
}
