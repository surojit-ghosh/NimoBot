import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default {
    name: 'help',
    category: 'info',
    usage: 'help [command]',
    example: 'help play',
    cooldown: 5 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['h', 'cmds', 'commands'],
    description: 'Provides you list of all commands.\nUse `{prefix}help <command>` to get details about the command.',
    run: async (client, message, args) => {
        if (args[0]) {
            let command = await client.commands.get(args[0]);
            if (!command) return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: `No command found with name \`${args[0]}\``
                }]
            });

            let embed = new MessageEmbed()
                .setColor(client.color.default)
                .setTitle(command.name)
                .setDescription(command.description.replace('{prefix}', client.prefix))
                .addField('Usage', '`' + client.prefix + command.usage + '`', true)
                .addField('Example', '`' + client.prefix + command.example + '`', true)
                .addField('Aliases', command.aliases.map((a) => '`' + a + '`').join(','), true);

            return message.reply({ embeds: [embed] });
        } else {
            const commands = await client.commands;
            let cmds = {};
            for (let cmd of [...commands]) {
                let category = cmd[1].category || 'Unknown';
                let name = cmd[1].name;
                if (!cmds[category]) cmds[category] = [];
                cmds[category].push(name);
            };

            let emb = new MessageEmbed()
                .setColor(client.color.default)
                .setDescription(' ')
                .setFooter({ text: `Use ${client.prefix}help <command> for details of that command` });

            for (const key in cmds) {
                emb.addField(`${key.charAt(0).toUpperCase()}${key.slice(1)}`, cmds[key].map((c) => '`' + c + '`').join(','))
            };

            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Support Server')
                        .setURL(client.config.supportServer),
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Invite Me')
                        .setURL(client.config.inviteLink)
                );

            return message.reply({ embeds: [emb], components: [row] });
        }
    }
};