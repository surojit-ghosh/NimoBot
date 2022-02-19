import { MessageEmbed } from "discord.js";

export default {
    name: 'play',
    category: 'music',
    usage: 'play <song name or url | playlist url>',
    cooldown: 1 * 1000,
    permissions: {
        client: ['CONNECT', 'SPEAK'],
        author: []
    },
    aliases: ['p'],
    description: 'Play a song or a playlist',
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!message.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'I need `CONNECT` and `SPEAK` permission in `' + channel.name + '`'
            }]
        });

        if (!channel) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'You must be in a voice channel to play something'
            }]
        });

        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.reply({
            embeds: [{
                color: client.color.error,
                description: 'You must be in the same voice channel as me to use this command'
            }]
        });

        let search = args.join(" ");
        if (!search) return message.reply({
            embeds: [{
                color: client.color.error,
                description: `Usage - \`${client.prefix}play <song name or url | playlist url>\``
            }]
        });

        var player = await client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
            volume: 80
        });

        if (player && player.node && !player.node.connected) await player.node.connect();

        if (player.state != "CONNECTED") await player.connect();
        let res;
        try {
            res = await player.search(search, message.author);
            if (res.loadType === "LOAD_FAILED") {
                if (!player.queue.current) player.destroy();
                return message.reply({
                    embeds: [{
                        color: client.color.error,
                        description: 'Unable to load the track'
                    }]
                });
            };
        } catch (error) {
            return message.reply({
                embeds: [{
                    color: client.color.error,
                    description: 'there was an error while searching'
                }]
            });
        };

        switch (res.loadType) {
            case "LOAD_FAILED":
                if (!player.queue.current) {
                    player.destroy();
                    return message.reply({
                        embeds: [{
                            color: client.color.error,
                            description: 'Unable to load the track'
                        }]
                    });
                }
            case "NO_MATCHES":
                if (!player.queue.current) {
                    player.destroy();
                    return message.reply({
                        embeds: [{
                            color: client.color.error,
                            description: `No matches found for - ${search}`
                        }]
                    });
                }
            case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) return player.play();
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                const embed = new MessageEmbed()
                    .setColor(client.color.default)
                    .setTimestamp()
                    .setDescription(`**Added playlist to queue** ${res.tracks.length} Songs [${res.playlist.name}](${search})`)
                return message.channel.send({ embeds: [embed] });
            case 'SEARCH_RESULT':
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) {
                    return player.play();
                } else {
                    const thing = new MessageEmbed()
                        .setColor(client.embedColor)
                        .setTimestamp()
                        .setThumbnail(track.displayThumbnail("hqdefault"))
                        .setDescription(`**Added song to queue**\n[${track.title}](${track.uri})`)
                    return message.channel.send({ embeds: [thing] });
                }
        };
    }
};