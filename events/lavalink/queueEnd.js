export default {
    run: async (client, player) => {
        const channel = client.channels.cache.get(player.textChannel);

        channel.send({
            embeds: [{
                color: client.color.default,
                description: 'Music queue ended'
            }]
        });

        client.setNowPlayingMessage();
    }
};