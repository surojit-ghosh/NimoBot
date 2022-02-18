import mongoose from "mongoose";

const userModel = mongoose.model('user', new mongoose.Schema({
    userId: { type: String, required: true }
}));

export default userModel;