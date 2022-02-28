import { MessageEmbed } from "discord.js";

export default {
    name: 'nowplaying',
    category: 'music',
    usage: 'nowplaying',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['np'],
    description: 'Display the currently playing song',
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

        let song = player.queue.current;
        let embed = new MessageEmbed()
            .setColor(client.color.default)
            .setThumbnail(song.displayThumbnail())
            .setDescription(`[${song.title}](${song.uri})`)
            .setFooter({ text: `Requested by: ${song.requester.username}#${song.requester.discriminator}` });

        return message.reply({ embeds: [embed] });
    }
};