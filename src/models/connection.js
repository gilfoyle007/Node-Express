const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conncetionSchema = new Schema ({
    user_id: String,
    user_two: String,
    status: String,
    //actionUserId: String,
    created_at: {type: Date, default: Date.now()}
});

const Connection = mongoose.model('connection', conncetionSchema);
module.exports = Connection;