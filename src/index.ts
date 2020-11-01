import chalk from "chalk";
import inquirer from "inquirer";

import { draft } from "./draft";

function init() {
    console.log(chalk.bold(chalk.blueBright("\nOut Of The Stats 21\n")));

    inquirer
        .prompt({
            type: "list",
            name: "mode",
            message: "Operation mode?",
            choices: ["Draft"],
            filter: function (val) {
                return val.toLowerCase();
            },
        })
        .then(({ mode }) => {
            switch (mode) {
                case "draft":
                    return draft();
            }
        });
}

init();
