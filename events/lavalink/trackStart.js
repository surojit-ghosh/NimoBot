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
            .addComponents(new MessageButton()
                .setCustomId('play_pause')
                .setStyle('SECONDARY')
                .setEmoji('⏯️'),
                new MessageButton()
                    .setCustomId('stop')
                    .setStyle('SECONDARY')
                    .setEmoji('⏹'),
                new MessageButton()
                    .setCustomId('skip')
                    .setStyle('SECONDARY')
                    .setEmoji('⏭️'));
        client.channels.cache.get(player.textChannel).send({ embeds: [embed], components: [row] });
    }
};