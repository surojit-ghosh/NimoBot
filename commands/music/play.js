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
                var track = res.tracks[0];
                player.queue.add(track);
                if (!player.playing && !player.paused && !player.queue.size) return player.play();
                let embed = new MessageEmbed()
                    .setColor(client.color.default)
                    .setThumbnail(track.displayThumbnail())
                    .description(`Added [${track.title}](${track.uri}) to thr queue`)
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                const playlistEmbed = new MessageEmbed()
                    .setAuthor({ name: 'Playlist added to queue', iconURL: client.user.displayAvatarURL() })
                    .setColor(client.color.default)
                    .setDescription(`Added ${res.tracks.length} songs to queue from [${res.playlist.name}](${search})`)
                    .setTimestamp();
                return message.channel.send({ embeds: [playlistEmbed] });
            case 'SEARCH_RESULT':
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) return player.play();
                const searchEmbed = new MessageEmbed()
                    .setColor(client.color.default)
                    .setThumbnail(track.displayThumbnail())
                    .description(`Added [${track.title}](${track.uri}) to thr queue`)
                    .setTimestamp();
                return message.channel.send({ embeds: [searchEmbed] });
        };
    }
};