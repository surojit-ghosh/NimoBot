import mongoose from "mongoose";
import { stringify } from "querystring";

const guildModel = mongoose.model('guild', new mongoose.Schema({
    guildId: { type: String, required: true },
    prefix: { type: String, required: false },
    djRole: { type: String, required: false }
}));

export default guildModel;