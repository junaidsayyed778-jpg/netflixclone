const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
    },

    genre: {
        type: [String], //Action, Comedy, Drama
        required: true,
    },

    releaseYear: {
        type: Number,
    },
    duration:{
        type: Number, // in minutes
    },

    rating: {
        type: Number, //1 to 10
        default: 0,
    },

    poster:{
        type: String, //image URL
    },

    banner:{
        typpe: String, //her banner image
    },

    videoUrl: {
        type: String, // movie video
    },

    trailerUrl: {
        type: String, 
    },
    cast:[
        {
            name: String,
            photo: String,
        },
    ],
    isTrending: {
        type: String,
        default: false,
    },

    isPopular: {
        type: String,
        default: false,
    },
}, {timestamps: true});
movieSchema.index({ title: "text"})
const movieModel = mongoose.model("Movie", movieSchema);
module.exports = movieModel