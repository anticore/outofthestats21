export const id = (str: string) => str;

export function strToNum(str: string): number {
    if (!str || str === "-") return 0;
    return Number(str);
}

export function getHeight(content: string): number {
    return 0;
}

export function getWeight(content: string): number {
    return 0;
}

export function getVelocity(
    content: string
): { min: number; max: number; avg: number } {
    let min = Number(content.split("-")[0]);
    let max = Number(content.split("-")[1].split(" ")[0]);
    let avg = max - (max - min) / 2;

    return { min, max, avg };
}
