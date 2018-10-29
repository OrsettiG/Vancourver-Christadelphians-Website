const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Profile Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    favoriteVerse: {
        type: String
    },
    phone: {
        type: String
    },
    email2: {
        type: String
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);