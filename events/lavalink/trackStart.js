import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';

export default {
    run: async (client, player, track, payload) => {
        const embed = new MessageEmbed()
            .setColor(client.color.default)
            .setAuthor({ name: `Now playing`, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(player.queue.current.displayThumbnail())
            .setDescription(`Playing [${track.title}](${track.uri})`)
            .setFooter({ text: `Requested by: ${track.requester.username}#${track.requester.discriminator}` });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setStyle('SECONDARY').setEmoji('⏯️').setCustomId('play_pause'),
                new MessageButton().setStyle('SECONDARY').setEmoji('⏹').setCustomId('stop'),
                new MessageButton().setStyle('SECONDARY').setEmoji('⏭️').setCustomId('skip'),
                new MessageButton().setStyle('SECONDARY').setEmoji('🔉').setCustomId('volume_decrease'),
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

        collector.on("collect", async (i) => {
            if (i.customId == 'play_pause') {
                if (!player) return collector.stop();
                player.pause(!player.paused);
                let text = player.paused ? `Paused` : `Resumed`;
                i.reply({ embeds: [{ color: client.color.default, description: `Player **${text}**` }] });
                setTimeout(() => { i.deleteReply(); }, 3 * 1000);
            } else if (i.customId == 'stop') {
                if (!player) return collector.stop();
                await player.stop();
                await player.queue.clear();
                i.reply({ embeds: [{ color: client.color.default, description: `Queue cleared` }] });
                setTimeout(() => { i.deleteReply(); }, 3 * 1000);
            } else if (i.customId == 'skip') {
                if (!player) return collector.stop();
                await player.stop();
                i.reply({ embeds: [{ color: client.color.default, description: `Song skipped` }] });
                if (track.length === 1) return collector.stop();
                setTimeout(() => { i.deleteReply(); }, 3 * 1000);
            } else if (i.customId == 'volume_decrease') {
                if (!player) return collector.stop();
                if (Number(player.volume) <= 10) {
                    i.reply({ embeds: [{ color: client.color.default, description: `Volume can't be lower than \`10\`` }] });
                    setTimeout(() => { i.deleteReply(); }, 3 * 1000);
                    return;
                }
                let amount = Number(player.volume) - 10;
                await player.setVolume(amount);
                i.reply({ embeds: [{ color: client.color.default, description: `Volume decreased. Current volume: ${player.volume}` }] });
                setTimeout(() => { i.deleteReply(); }, 3 * 1000);
            } else if (i.customId == 'volume_increase') {
                if (!player) return collector.stop();
                if (Number(player.volume) >= 100) {
                    i.reply({ embeds: [{ color: client.color.default, description: `Volume can't be more than \`100\`` }] });
                    setTimeout(() => { i.deleteReply(); }, 3 * 1000);
                    return;
                }
                let amount = Number(player.volume) + 10;
                await player.setVolume(amount);
                i.reply({ embeds: [{ color: client.color.default, description: `Volume increased. Current volume: ${player.volume}` }] });
                setTimeout(() => { i.deleteReply(); }, 3 * 1000);
            }
        });
    }
};