import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

export default {
    run: async (client, player, track, payload) => {
        const embed = new MessageEmbed()
            .setColor(client.color.default)
            .setAuthor({ name: `Now playing`, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(player.queue.current.displayThumbnail())
            .setDescription(`Playing [${track.title}](${track.uri})`)
            .addField('Requested By: ', `${track.requester}`, false)
            .setTimestamp();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setStyle('SECONDARY').setEmoji('⏯️').setCustomId('play_pause'),
                new MessageButton().setStyle('SECONDARY').setEmoji('⏹').setCustomId('stop'),
                new MessageButton().setStyle('SECONDARY').setEmoji('⏭️').setCustomId('skip'),
                new MessageButton().setStyle('SECONDARY').setEmoji('🔈').setCustomId('volume_decrease'),
                new MessageButton().setStyle('SECONDARY').setEmoji('🔊').setCustomId('volume_increase')
            );
        let channel = await client.channels.cache.get(player.textChannel);
        let message = await channel.send({ embeds: [embed], components: [row] });
        client.setNowPlayingMessage(message);

        const collector = message.createMessageComponentCollector({
            filter: (m) => {
                if (m.guild.me.voice.channel && m.guild.me.voice.channelId === m.member.voice.channelId) return true;
                else {
                    m.reply({
                        embeds: [{
                            color: client.color.error,
                            description: `You must be in the same voice channel as me to use this button`
                        }],
                        ephemeral: true
                    });
                    return false;
                };
            },
            time: track.duration
        });
    }
};