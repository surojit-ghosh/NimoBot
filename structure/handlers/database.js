import mongoose from "mongoose";

const databse = (client) => {
    mongoose.connect(client.config.db).then((db) => {
        console.log(`Database connected :: ${db.connections[0].name}`);
    }).catch((err) => {
        console.log(`Error while connecting to database :: ${err.message}`);
    });
};

export default databse;