import { MessageEmbed } from 'discord.js';

export default {
    run: async (client, player, track, payload) => {
        const embed = new MessageEmbed()
            .setColor(client.color.default)
            .setAuthor({ name: `Now playing`, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(player.queue.current.displayThumbnail())
            .setDescription(`Playing [${track.title}](${track.uri})`)
            .addField('Requested By: ', `${track.requester}`, false)
            .setTimestamp();
        client.channels.cache.get(player.textChannel).send({ embeds: [embed] });
    }
}