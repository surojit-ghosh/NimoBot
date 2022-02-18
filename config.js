import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

export default {
    token: process.env.TOKEN || '',
    db: process.env.DB || '',

    color: {

    }
}