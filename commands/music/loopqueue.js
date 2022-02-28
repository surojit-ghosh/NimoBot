export default {
    name: 'loop',
    category: 'music',
    usage: 'disconnect',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['repeat'],
    description: 'Loop the current queue',
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

        if (player.queueRepeat) {
            player.setQueueRepeat(false);
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: 'Queue Loop disabled'
                }]
            });
        } else {
            player.setQueueRepeat(true);
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: 'Queue Loop enabled'
                }]
            });
        }
    }
};