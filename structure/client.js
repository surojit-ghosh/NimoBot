import { Client, Collection, Message } from 'discord.js';
import { readdirSync } from 'fs';
import mongoose from "mongoose";
import { Manager } from 'erela.js';

import config from '../config.js';

export default class extends Client {
    constructor() {
        super({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'] });

        ['commands', 'slashCommands', 'aliases'].forEach((i) => this[i] = new Collection());
        this.config = config;
        this.color = config.color;

        // connect to mongoDB
        mongoose.connect(config.db).then((db) => {
            console.log(`[Database] connected :: ${db.connections[0].name}`);
        }).catch((err) => {
            console.log(`[Database] error while connecting to database :: ${err.message}`);
        });

        // load commands
        readdirSync('./commands').forEach((folder) => {
            readdirSync('./commands/' + folder).filter((file) => file.endsWith('.js')).forEach((command) => {
                import('../commands/' + folder + '/' + command).then((cmd) => {
                    cmd = cmd.default;
                    if (!cmd.run) return console.log(`[Command] unable to load :: ${command}`);
                    cmd.name = cmd.name || command.replace('.js', '');
                    cmd.category = cmd.category || folder;
                    console.log(`[Command] successfully loaded :: ${command}`);
                    this.commands.set(cmd.name, cmd);
                    if (cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach((alias) => this.aliases.set(alias, cmd.name));
                });
            });
        });

        // load slash commands
        readdirSync('./slashCommands').forEach((folder) => {
            readdirSync('./slashCommands/' + folder).filter((file) => file.endsWith('.js')).forEach((command) => {
                import('../slashCommands/' + folder + '/' + command).then((cmd) => {
                    cmd = cmd.default;
                    if (!cmd.run || !cmd.data) return console.log(`[Slash Command] unable to load the :: ${command}`);
                    let name = cmd.data.name || command.replace('.js', '');
                    cmd.category = cmd.category || folder;
                    console.log(`[Slash Command] successfully loaded :: ${command}`);
                    this.slashCommands.set(name, cmd);
                });
            });
        });

        // load client events
        readdirSync('./events/client').filter((file) => file.endsWith('.js')).forEach((file) => {
            import('../events/client/' + file).then((event) => {
                event = event?.default;
                if (!event?.run) return console.log(`[Event] unable to load :: ${file}`);
                event.name = event.name || file.replace('.js', '');
                try {
                    this.on(event.name, event.run.bind(null, this));
                    console.log(`[Event] successfully loaded :: ${file}`);
                } catch (error) {
                    console.log(`[Event] error while executing :: ${file}`);
                }
            });
        });

        this.on("disconnect", () => console.log("Bot is disconnecting..."))
            .on("reconnecting", () => console.log("Bot reconnecting..."))
            .on('warn', (error) => console.log(error))
            .on('error', (error) => console.log(error));

        process.on('unhandledRejection', (error) => console.log(error))
            .on('uncaughtException', (error) => console.log(error));

        this.manager = new Manager({
            nodes: [config.lavalink],
            send(id, payload) {
                const guild = this.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        }).on("nodeConnect", (node) => console.log(`[lavalink] node connected :: ${node.options.identifier}`))
            .on("nodeCreate", (node) => console.log(`[lavalink] node created :: ${node.options.identifier}`))
            .on("nodeReconnect", (node) => console.log(`[lavalink] node reconnecting... :: ${node.options.identifier}`))
            .on("playerCreate", (player) => console.log(`[lavalink] player has been created in :: ${player.guild}`))
            .on("playerDestroy", (player) => console.log(`[lavalink] player has been destroyed in :: ${player.guild}`))
            .on("nodeDisconnect", (node) => {
                console.log(`[lavalink] node disconnected :: ${node.options.identifier}`);
                setTimeout(() => node.connect(), 1 * 60 * 1000);
            }).on("nodeError", (node, error) => {
                console.log(`[lavalink] node errored :: ${node.options.identifier}`);
                setTimeout(() => node.connect(), 1 * 60 * 1000);
            });

        super.login(config.token);
    };

    /**
    * @param {Message} message
    */
    setNowPlayingMessage(mesage) {
        if (this.nowPlayingMessage && this.nowPlayingMessage.deletable) this.nowPlayingMessage.delete();
        return (this.nowPlayingMessage = mesage);
    };
};