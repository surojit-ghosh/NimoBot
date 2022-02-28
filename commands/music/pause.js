import { MessageEmbed } from "discord.js";

export default {
    name: 'pause',
    category: 'music',
    usage: 'pause',
    cooldown: 10 * 1000,
    permissions: {
        client: [],
        author: []
    },
    aliases: [],
    description: 'Pause the song',
    run: async (client, message, args) => {
        let player = await client.manager.get(message.guild.id);
        if (!player) return message.reply({
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

        if (player.paused) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'Player is already paused'
            }]
        });

        player.pause(true);
        return message.reply({
            embeds: [{
                color: client.color.default,
                description: 'Player is successfully paused.\nRun `' + client.prefix + 'resume` to continue playing'
            }]
        });
    }
};