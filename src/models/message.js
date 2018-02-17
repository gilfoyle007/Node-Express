const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user_id: String,
    message: String,
    msg_type: String,
    msg_pic_url: [String],
    msg_status: Number,
    created_at: {type: Date, default: Date.now()}
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;