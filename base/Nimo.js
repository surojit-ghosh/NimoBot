import { Client, Intents, Collection } from 'discord.js';
import config from '../config.js';
import { loadCommands, loadEvents, loadSlashCommands } from './handlers.js';

export default class extends Client {
    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });

        this.config = config;
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.aliases = new Collection();

        loadCommands(this);
        loadSlashCommands(this);
        loadEvents(this);

        super.login(config.token);
    };
};