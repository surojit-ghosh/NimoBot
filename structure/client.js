import { Client, Collection } from 'discord.js';
import config from '../config.js';
import { loadCommands, loadEvents, loadSlashCommands, connectDB } from './handlers.js';

export default class extends Client {
    constructor() {
        super({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] });

        ['commands', 'slashCommands', 'aliases'].forEach((i) => this[i] = new Collection());
        this.config = config;
        this.color = config.color;

        loadCommands(this);
        loadSlashCommands(this);
        loadEvents(this);
        connectDB(this);

        super.login(config.token);
    };
};