const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    date_created: {type: Date, default: Date.now}, // when the account was created a timestamp is automatically made,
});

module.exports = mongoose.model('users', UserSchema);
