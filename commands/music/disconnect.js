export default {
    name: 'disconnect',
    category: 'music',
    usage: 'disconnect',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['dc'],
    description: 'Stop the music and leave the voice channel',
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
        player.destroy();
        return message.reply({
            embeds: [{
                color: client.color.default,
                description: 'Disconnected'
            }]
        });
    }
};