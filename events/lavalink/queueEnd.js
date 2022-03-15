export default {
    run: async (client, player) => {
        const channel = client.channels.cache.get(player.textChannel);

        const msg = await channel.send({
            embeds: [{
                color: client.color.default,
                description: 'Music queue ended'
            }]
        });

        setTimeout(() => {
            msg?.delete();
        }, 10 * 1000);

        client.setNowPlayingMessage();
        player.pause(false);
        player.destroy();
    }
};