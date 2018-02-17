const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    full_name: String,
    email:  String,
    mobile:  String,
    gender: String,
    account_provider: String,
    account_id: {type: String, unique: true},
    location: [{
        type: Schema.Types.ObjectId,
        ref: 'location'
    }],
    devices: [{
        type: Schema.Types.ObjectId,
        ref: 'device'
    }],
    status: [{
        type: Schema.Types.ObjectId,
        ref: 'status'
    }],
    connections: [{
        type: Schema.Types.ObjectId,
        ref: 'connection'
    }],
    following: [{
       type: Schema.Types.ObjectId,
       ref: 'following'
    }],
    follower: [{
       type: Schema.Types.ObjectId,
       ref: 'follower'
    }],
    request: [{
       type: Schema.Types.ObjectId,
       ref: 'request'
    }],
    pending: [{
       type: Schema.Types.ObjectId,
       ref: 'pending'
    }],
    accept: [{
        type: Schema.Types.ObjectId,
        ref: 'accept'
    }],
    blocked: [{
       type: Schema.Types.ObjectId,
       ref: 'blocked'
    }],
    declined: [{
       type: Schema.Types.ObjectId,
       ref: 'declined'
    }],

    about_me: String,
    profile_picture_url: String,
    last_logged_in: Date,
    updated_at: Date,
    created_at: { type: Date, default: Date.now()}
});

const User = mongoose.model('user', userSchema);
module.exports = User;
