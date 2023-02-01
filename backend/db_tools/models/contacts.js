const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactsSchema = new mongoose.Schema({
    user_id:  {type: mongoose.Types.ObjectId, ref: 'users'}, // FK
    email: {type: String, required: true, unique: false},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    company: {type: String, default: null},
    title: {type: String}
});

module.exports = mongoose.model('contacts', ContactsSchema);