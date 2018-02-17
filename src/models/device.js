const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    user_id: String,
    device_id: String,
    android_version: String,
    model: String,
    brand: String,
    using: Boolean,
    removed: Boolean,
    change_at: Date,
    created_at: { type: Date, default: Date.now()}
});

const Devices = mongoose.model('device', deviceSchema);
module.exports = Devices;