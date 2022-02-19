import { Manager } from 'erela.js';
import chalk from 'chalk';
import { readdirSync } from 'fs';

const lavalink = (client) => {
    const manager = new Manager({
        nodes: [client.config.lavalink],
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    }).on("nodeConnect", (node) => {
        console.log(chalk.bgGreen(` [lavalink] `) + chalk.green(` node connected :: ${node.options.identifier}`));
    }).on("nodeCreate", (node) => {
        console.log(chalk.bgGreen(` [lavalink] `) + chalk.green(` node created :: ${node.options.identifier}`));
    }).on("nodeReconnect", (node) => {
        console.log(chalk.bgGreen(` [lavalink] `) + chalk.red(` node reconnecting... :: ${node.options.identifier}`));
    }).on("nodeDisconnect", (node) => {
        console.log(chalk.bgRed(` [lavalink] `) + chalk.red(` node disconnected :: ${node.options.identifier}`));
        setTimeout(() => node.connect(), 1 * 60 * 1000);
    }).on("nodeError", (node, error) => {
        console.log(chalk.bgRed(` [lavalink] `) + chalk.red(` node errored :: ${node.options.identifier}`));
        setTimeout(() => node.connect(), 1 * 60 * 1000);
    }).on("playerCreate", (player) => {
        console.log(chalk.bgGreen(` [lavalink] `) + chalk.green(` player has been created in :: ${player.guild}`));
    }).on("playerDestroy", (player) => {
        console.log(chalk.bgGreen(` [lavalink] `) + chalk.green(` player has been destroyed in :: ${player.guild}`));
    });


    readdirSync('./events/lavalink').filter((file) => file.endsWith('.js')).forEach((file) => {
        import('../../events/lavalink/' + file).then((event) => {
            event = event?.default;
            if (!event?.run) return;
            event.name = event.name || file.replace('.js', '');
            try {
                manager.on(event.name, event.run.bind(null, client));
            } catch (error) {
                console.log(chalk.bgRed(` [lavalink] `) + chalk.red(` error while executing :: ${file}`));
            };
        });
    });

    return manager;
};

export default lavalink;