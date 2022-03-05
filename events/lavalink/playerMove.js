export default {
    run: async (client, player, oldChannel, newChannel) => {
        const guild = client.guilds.cache.get(player.guild)
        if (!guild) return;
        const channel = guild.channels.cache.get(player.textChannel);
        if (oldChannel === newChannel) return;
        if (newChannel === null || !newChannel) {
            if (!player) return;
            if (channel) await channel.send({
                embeds: [{
                    color: client.color.error,
                    description: 'I\'ve been disconnected from <#' + oldChannel + '>'
                }]
            });
            return player.destroy();
        } else {
            player.voiceChannel = newChannel;
            if (channel) await channel.send({
                embeds: [{
                    color: client.color.error,
                    description: 'Player voice channel moved to <#' + newChannel + '>'
                }]
            });
            // if (player.paused) player.pause(false);
        }
    }
};