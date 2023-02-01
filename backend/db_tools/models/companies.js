const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompaniesSchema = new mongoose.Schema({
    company_name: {type: String, required: true},
    employees:[
      {type: mongoose.Types.ObjectId, ref: 'users'}
    ]
});

module.exports = mongoose.model('companies', CompaniesSchema);
