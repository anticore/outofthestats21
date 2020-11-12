export interface PlayerData {
    name: string;
    age: number;
    height: number;
    weight: number;
    bats: string;
    throws: string;
    injuryProne: string;
    school: string;

    // batting
    contactPot: number;
    gapPot: number;
    powerPot: number;
    eyePot: number;
    avoidKsPot: number;

    // pitching
    pitcherType: string;

    stuffPot: number;
    movementPot: number;
    controlPot: number;

    fastballPot: number;
    changeupPot: number;
    curveballPot: number;
    sliderPot: number;
    sinkerPot: number;
    splitterPot: number;
    cutterPot: number;
    forkballPot: number;
    circleChangePot: number;
    screwballPot: number;
    knuckleCurvePot: number;
    knuckleballPot: number;

    pitches: number;
    velocity: { min: number; max: number; avg: number };
    slot: string;
    hold: number;
    stamina: number;

    // Fielding
    infRange: number;
    infArm: number;
    turnDP: number;
    infError: number;
    outfRange: number;
    outfArm: number;
    outfError: number;
    catcherArm: number;
    catcherAbility: number;

    // baserunning
    speed: number;
    stealing: number;
    baserunning: number;

    // stats
    G: number;
    PA: number;
    AB: number;
    H: number;
    HR: number;
    BB: number;
    SO: number;
    AVG: number;
    OBP: number;
    SLG: number;
    wOBA: number;
    OPSp: number;
    wRCp: number;
    WAR: number;
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
    FIP: number;
    RNG: number;
    ZR: number;
    EFF: number;
    CERA: number;

    scoutAcc: string;

    ratings: {
        [position: string]: number;
    };
}
