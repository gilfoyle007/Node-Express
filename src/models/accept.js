const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acceptSchema = new Schema({
    user_id: String,
    accept_user_id: String,
    created_at:{type: Date, default: Date.now()}
});

const Accept = mongoose.model('accept', acceptSchema);
module.exports = Accept;
