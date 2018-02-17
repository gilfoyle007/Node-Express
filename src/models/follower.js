const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
    user_id: String,
    follower_user_id: String,
    created_at: {type: Date, default: Date.now()}
});

const Follower = mongoose.model('follower', followerSchema);
module.exports = Follower;