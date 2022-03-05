export default {
    name: 'queue',
    category: 'music',
    usage: 'queue',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: [],
    description: 'Display all the songs in the queue',
    run: async (client, message, args) => {
        let player = await client.manager.get(message.guild.id);
        if (!player || !player?.queue || !player?.queue.length || player?.queue.length === 0) return message.reply({
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
        player.queue.clear();
        return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'Cleared the queue'
            }]
        });
    }
};