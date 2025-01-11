//File to connect to the database

require('dotenv').config()
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URI;

async function connectDB() {
    try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Database");
    } catch(err){
        console.log(err);
    }
}

module.exports = connectDB;