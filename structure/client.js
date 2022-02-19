import { Client, Collection } from 'discord.js';
import config from '../config.js';
import { loadCommands, loadEvents, loadSlashCommands, connectDB, lavalinkManager, extraEvents } from './handlers.js';

export default class extends Client {
    constructor() {
        super({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'] });

        ['commands', 'slashCommands', 'aliases'].forEach((i) => this[i] = new Collection());
        this.config = config;
        this.color = config.color;
        this.manager = lavalinkManager(this);

        loadCommands(this);
        loadSlashCommands(this);
        loadEvents(this);
        connectDB(this);
        extraEvents(this);

        super.login(config.token);
    };
};