const levels = {
    none: 0.0,
    low: 0.2,
    medium: 0.3,
    high: 0.4,
};

export default {
    name: 'bassboost',
    category: 'music',
    usage: 'clear',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['bb', 'bass'],
    description: 'Clear the server queue',
    run: async (client, message, args) => {
        let player = await client.manager.get(message.guild.id);
        if (!player) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'Nothing is playing right now'
            }]
        });

        if (message.guild.me.voice?.channel && message.member.voice?.channel.id !== message.guild.me.voice?.channel.id) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'You must be in the same voice channel as me to use this command'
            }]
        });

        if (!args[0]) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'Please provide a bassboost level. \nAvailable Levels: `none`, `low`, `medium`, `high`'
            }]
        });

        if (args.length && !(args[0].toLowerCase() in levels)) {
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: 'Please provide a valid bassboost level. \nAvailable Levels: `none`, `low`, `medium`, `high`'
                }]
            });
        } else {
            let level = args[0].toLowerCase();
            player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: `Bassboost level set to \`${level}\``
                }]
            });
        }
    }
};