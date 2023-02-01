
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobApplicationSchema = new mongoose.Schema({
    company_name: {type:String},
    user_id:  {type: mongoose.Types.ObjectId, ref: 'users'}, // FK
    date_applied: {type: Date, default: Date.now},
    job_title:{type: String, required:true},
    pay:{
      min:{type: Number, min:0, default: null},
      max:{type: Number, min:0, default: null},
    },
    location:{type: String, required: true},
    remote:{type:Boolean, required: true},
    status:{type:String, default:"Applied"},
    link:{type:String, required: false, default: null},
    skills:{type:[String]},
    contacts: [String]
});

module.exports = mongoose.model('jobApplications', JobApplicationSchema);
