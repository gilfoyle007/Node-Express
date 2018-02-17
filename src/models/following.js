const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const followingSchema = new Schema({
    user_id: String,
    following_user_id: String,
    created_at: {type: Date, default: Date.now()}
});

const Following = mongoose.model('following', followingSchema);
module.exports = Following;