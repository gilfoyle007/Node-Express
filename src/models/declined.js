const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const declinedSchema = new Schema({
    user_id: String,
    declined_user_id: String,
    created_at: {type: Date, default: Date.now()}
});

const Declined = mongoose.model('declined', declinedSchema);
module.exports = Declined;