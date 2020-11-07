import { PlayerData } from "./playerData";

export function rateOffense(player: PlayerData) {
    return (
        player.batting.potContact * 6 +
        player.batting.potGap * 2 +
        player.batting.potPower * 5 +
        player.batting.potEye * 4.5 +
        player.batting.potAvoidK * 2.5
    );
}

export function rateDraftC(player: PlayerData) {
    return (
        rateOffense(player) +
        player.fielding.catcherAbility * 3.5 +
        player.fielding.catcherArm * 1.5 +
        player.baserunning.potStealing
    );
}

export function rateDraft1B(player: PlayerData) {
    return (
        rateOffense(player) +
        player.height +
        (player.fielding.infieldRange * 3.5 +
            player.fielding.infieldError * 3 +
            player.fielding.infieldArm +
            player.fielding.turnDP +
            player.baserunning.potStealing) *
            0.5
    );
}

export function rateDraft2B(player: PlayerData) {
    if (player.throws == "L") return 0;

    return (
        rateOffense(player) +
        player.fielding.infieldRange * 2 +
        player.fielding.infieldError * 2 +
        player.fielding.infieldArm +
        player.fielding.turnDP +
        player.baserunning.potStealing
    );
}

export function rateDraftSS(player: PlayerData) {
    if (player.throws == "L") return 0;

    return (
        rateOffense(player) +
        player.fielding.infieldRange * 3 +
        player.fielding.infieldError * 2 +
        player.fielding.infieldArm * 2 +
        player.fielding.turnDP +
        player.baserunning.potStealing
    );
}

export function rateDraft3B(player: PlayerData) {
    if (player.throws == "L") return 0;

    return (
        rateOffense(player) +
        player.fielding.infieldRange * 2 +
        player.fielding.infieldError * 2 +
        player.fielding.infieldArm * 2 +
        player.fielding.turnDP +
        player.baserunning.potStealing
    );
}

export function rateDraftLF(player: PlayerData) {
    return (
        rateOffense(player) +
        player.fielding.outfieldRange * 2.5 +
        player.fielding.outfieldError +
        player.fielding.outfieldArm * 2 +
        player.baserunning.potStealing
    );
}

export function rateDraftCF(player: PlayerData) {
    return (
        rateOffense(player) +
        player.fielding.outfieldRange * 5 +
        player.fielding.outfieldError +
        player.fielding.outfieldArm +
        player.baserunning.potStealing
    );
}

export function rateDraftRF(player: PlayerData) {
    return (
        rateOffense(player) +
        player.fielding.outfieldRange * 2.5 +
        player.fielding.outfieldError +
        player.fielding.outfieldArm * 2 +
        player.baserunning.potStealing
    );
}

export function rateDraftP(player: PlayerData) {
    return (
        player.pitching.potStuff * 4 +
        player.pitching.potMovement * 2.5 +
        player.pitching.potControl * 3 +
        player.pitching.stamina * 1.2 +
        player.pitching.hold * 1.1 +
        player.pitching.velocity.avg * 2.5
    );
}
