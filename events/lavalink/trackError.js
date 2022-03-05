export default {
    run: async (client, player, track, payload) => {
        console.error(payload.error);

        const channel = client.channels.cache.get(player.textChannel);
        channel.send({
            embeds: [{
                color: client.color.error,
                description: 'Error when loading song!'
            }]
        });
        console.log(`Error when loading song! error in :: ${player.guild}`);
        if (!player.voiceChannel) player.destroy();
    }
};