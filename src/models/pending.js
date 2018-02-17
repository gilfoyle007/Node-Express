const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const pendingSchema = new Schema({
    user_id: String,
    pending_user_id: String,
    created_at: {type: Date, default: Date.now()}
});

const Pending = mongoose.model('pending', pendingSchema);
module.exports = Pending;