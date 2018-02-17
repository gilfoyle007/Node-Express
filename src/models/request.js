const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    user_id: String,
    request_user_id: String,
    created_at: {type: Date, default: Date.now()}
});

const Request = mongoose.model('request', requestSchema);
module.exports = Request;