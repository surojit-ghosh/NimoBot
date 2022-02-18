import chalk from "chalk";

const extraEvents = (client) => {
    client.on("disconnect", () => console.log(chalk.redBright("Bot is disconnecting...")));
    client.on("reconnecting", () => console.log(chalk.redBright("Bot reconnecting...")));
    client.on('warn', (error) => console.log(chalk.redBright(error)));
    client.on('error', (error) => console.log(chalk.redBright(error)));
    process.on('unhandledRejection', (error) => console.log(chalk.redBright(error)));
    process.on('uncaughtException', (error) => console.log(chalk.redBright(error)));
};

export default extraEvents;