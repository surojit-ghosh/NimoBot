import { MessageEmbed } from "discord.js";

export default {
    name: 'queue',
    category: 'music',
    usage: 'queue',
    cooldown: 5 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: ['q'],
    description: 'Display all the songs in the queue',
    run: async (client, message, args) => {
        let player = await client.manager.get(message.guild.id);
        if (!player || !player?.queue || !player?.queue?.current) return message.reply({
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

        let queue = player.queue;
        let queueLength = queue?.length;

        if (!queueLength) {
            let emb = new MessageEmbed()
                .setColor(client.color.default)
                .setDescription(` `)
                .addField(`Now Playing`, `[${queue.current.title}](${queue.current.uri}) - \`${queue.current.requester.username}\``)
                .addField(`Queue List`, '`No songs in queue`');
            message.reply({ embeds: [emb] });
        };

        let embeds = [];

        while (queueLength > 0) {
            let songs = [];
            for (let index = 0; index < ((queueLength > 10) ? 10 : queueLength); index++) {
                songs.push(queue[index]);
                queue.shift();
            };

            let emb = new MessageEmbed()
                .setColor(client.color.default)
                .setDescription(` `)
                .addField(`Now Playing`, `[${queue.current.title}](${queue.current.uri}) - \`${queue.current.requester.username}\``)
                .addField(`Queue List`, '`No songs in queue`');

            embeds.push(emb);
        };
    }
};