const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user1_id : String,
    user2_id: String,
    user1_pic: String,
    user2_pic: String,
    chat_type: String,
    status_body: {
        type: Schema.Types.ObjectId,
        ref: 'status'
    },
    message:{
      type: Schema.Types.ObjectId,
      ref: 'message'
    },
    created_at: {type: Date, default: Date.now()}
});

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;