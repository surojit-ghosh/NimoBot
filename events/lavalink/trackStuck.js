export default {
    run: async (client, player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel);
        channel.send({
            embeds: [{
                color: client.color.error,
                description: 'Error when loading song!'
            }]
        });
        console.log(`Error when loading song! Track is stuck in ${player.guild}`);
        if (!player.voiceChannel) player.destroy();
    }
};