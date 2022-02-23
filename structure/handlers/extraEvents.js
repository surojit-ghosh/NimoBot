const extraEvents = (client) => {
    client.on("disconnect", () => console.log("Bot is disconnecting..."));
    client.on("reconnecting", () => console.log("Bot reconnecting..."));
    client.on('warn', (error) => console.log(error));
    client.on('error', (error) => console.log(error));
    process.on('unhandledRejection', (error) => console.log(error));
    process.on('uncaughtException', (error) => console.log(error));
};

export default extraEvents;