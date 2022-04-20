import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

export default {
    token: process.env.TOKEN || '',
    db: process.env.DB || '',
    prefix: 'n!',
    inviteLink: 'https://discord.com/api/oauth2/authorize?client_id=949697116836610109&permissions=1099511627775&scope=bot%20applications.commands',
    supportServer: 'https://discord.gg/sasz7Hc923',
    color: {
        default: '00FFFF',
        error: 'RED'
    },
    lavalink: {
        id: 'Main',
        host: process.env.LAVALINK_HOST || '',
        port: parseInt(process.env.LAVALINK_PORT) || 2333,
        password: process.env.LAVALINK_PASSWORD || ''
    }
};