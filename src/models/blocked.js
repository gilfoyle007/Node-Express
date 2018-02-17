import mongoose, { Schema } from 'mongoose';

const blockedSchema = new Schema({
    user_id: String,
    blocked_user_id: String,
    created_at: { type: Date, default: Date.now() }
});

export default mongoose.model('blocked', blockedSchema);