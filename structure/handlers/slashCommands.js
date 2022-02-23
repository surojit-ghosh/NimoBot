import { readdirSync } from 'fs';

const slashCommands = (client) => {
    let cmds = [];
    readdirSync('./slashCommands').forEach((folder) => {
        readdirSync('./slashCommands/' + folder).filter((file) => file.endsWith('.js')).forEach((command) => {
            import('../../slashCommands/' + folder + '/' + command).then((cmd) => {
                cmd = cmd.default;
                if (!cmd.run || !cmd.data) return console.log(`[Slash Command] unable to load the :: ${command}`);
                let name = cmd.data.name || command.replace('.js', '');
                cmd.category = cmd.category || folder;
                cmds.push(cmd.data);
                console.log(`[Slash Command] successfully loaded :: ${command}`);
                client.slashCommands.set(name, cmd);
            });
        });
    });
    client.on('ready', () => {
        if (cmds.length) client.guilds.cache.get(client.config.guild).commands.set(cmds).then(() => {
            console.log(`[Slash Command] successfully deployed`);
        }).catch((e) => console.log(e));
    });
};

export default slashCommands;