export default {
    name: 'loop',
    category: 'music',
    usage: 'disconnect',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    // djRole: true,
    aliases: ['repeat'],
    description: 'Loop the current track',
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

        if (player.trackRepeat) {
            player.setTrackRepeat(false);
            return message.reply({
                embeds: [{
                    color: client.color.default,
                    description: 'Disabled'
                }]
            });
        } else {
            player.setTrackRepeat(true);
            return message.reply({
                embeds: [{
                    color: client.color.default,
                    description: 'Enabled'
                }]
            });
        }
    }
};