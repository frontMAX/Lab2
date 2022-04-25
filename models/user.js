const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minLength: 8,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false,
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;