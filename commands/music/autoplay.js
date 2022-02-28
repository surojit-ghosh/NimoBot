export default {
    name: 'autoplay',
    category: 'music',
    usage: 'clear',
    cooldown: 5 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['ap'],
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

        const autoplay = await player.get('autoplay')

        if (!autoplay || autoplay === false) {
            const identifier = player.queue.current.identifier;
            player.set("autoplay", true);
            player.set("requester", message.author);
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            let res = await player.search(search, message.author);
            player.queue.add(res.tracks[1]);
            return message.channel.send({
                embeds: [{
                    color: client.color.default,
                    description: `Auto play is now **enabled**`
                }]
            });
        } else {
            player.set("autoplay", false);
            player.queue.clear();
            return message.channel.send({
                embeds: [{
                    color: client.color.default,
                    description: `Auto play is now **disabled**`
                }]
            });
        }
    }
};