const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StatusSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    status: [{
        radar_type: String,
        status_type: String,
        status_body: String,
        privacy: Number,
        status_images: [{
            type: String
        }],
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        edited_at: Date
    }],
    deleted: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("status", StatusSchema);