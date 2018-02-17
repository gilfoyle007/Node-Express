const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
const locationSchema = new Schema({
    user_id: String,
    current:[
        {
            lat: String,
            lon: String
        }
    ],
    default:[
        {   lat: String,
            lon: String
        }
    ]
});*/


const locationSchema = new Schema({
    user_id: String,
    geolocation:{
        type: {
            type: String,
            default: "Point"},
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    status: String,
    expired_at: Date,
    created_at: {type: Date, default: Date.now()}

});

const Location = mongoose.model("location", locationSchema);
module.exports = Location;