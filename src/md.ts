import fs from "fs-extra";

let fileContent = "";

export function log(msg: string) {
    fileContent += msg + "\n";
}

export function write(fileLocation: string) {
    fs.writeFileSync(fileLocation, fileContent);
}
