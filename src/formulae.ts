import { PlayerData } from "./playerData";

export function rateOffense(player: PlayerData) {
    return (
        player.contactPot * 6 +
        player.gapPot * 2 +
        player.powerPot * 5 +
        player.eyePot * 4.5 +
        player.avoidKsPot * 2.5
    );
}

export function rateC(player: PlayerData) {
    return (
        rateOffense(player) +
        player.catcherAbility * 3.5 +
        player.catcherArm * 1.5 +
        player.stealing
    );
}

export function rate1B(player: PlayerData) {
    return (
        rateOffense(player) +
        player.height +
        (player.infRange * 3.5 +
            player.infError * 3 +
            player.infArm +
            player.turnDP +
            player.stealing) *
            0.5
    );
}

export function rate2B(player: PlayerData) {
    if (player.throws == "L") return 0;

    return (
        rateOffense(player) +
        player.infRange * 2 +
        player.infError * 2 +
        player.infArm +
        player.turnDP +
        player.stealing
    );
}

export function rateSS(player: PlayerData) {
    if (player.throws == "L") return 0;

    return (
        rateOffense(player) +
        player.infRange * 3 +
        player.infError * 2 +
        player.infArm * 2 +
        player.turnDP +
        player.stealing
    );
}

export function rate3B(player: PlayerData) {
    if (player.throws == "L") return 0;

    return (
        rateOffense(player) +
        player.infRange * 2 +
        player.infError * 2 +
        player.infArm * 2 +
        player.turnDP +
        player.stealing
    );
}

export function rateLF(player: PlayerData) {
    return (
        rateOffense(player) +
        player.outfRange * 2.5 +
        player.outfError +
        player.outfArm * 2 +
        player.stealing
    );
}

export function rateCF(player: PlayerData) {
    return (
        rateOffense(player) +
        player.outfRange * 5 +
        player.outfError +
        player.outfArm +
        player.stealing
    );
}

export function rateRF(player: PlayerData) {
    return (
        rateOffense(player) +
        player.outfRange * 2.5 +
        player.outfError +
        player.outfArm * 2 +
        player.stealing
    );
}

export function rateP(player: PlayerData) {
    return (
        player.stuffPot * 4 +
        player.movementPot * 2.5 +
        player.controlPot * 3 +
        player.stamina * 1.2 +
        player.hold * 1.1 +
        player.velocity.avg * 2.5
    );
}
