import chalk from "chalk";

const extraEvents = (client) => {
    this.on("disconnect", () => console.log(chalk.redBright("Bot is disconnecting...")));
    this.on("reconnecting", () => console.log(chalk.redBright("Bot reconnecting...")));
    this.on('warn', (error) => console.log(chalk.redBright(error)));
    this.on('error', (error) => console.log(chalk.redBright(error)));
    process.on('unhandledRejection', (error) => console.log(chalk.redBright(error)));
    process.on('uncaughtException', (error) => console.log(chalk.redBright(error)));
};

export default extraEvents;