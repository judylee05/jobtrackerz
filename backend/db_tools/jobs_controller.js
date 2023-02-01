require('dotenv').config({path:__dirname+"/.env"});
const mongoose = require('mongoose');
const jobApplication = require('./models/job_applications');
const users = require("./user_controller")
const contacts = require("./contacts_controller")


exports.addJobApplication = async(to_add)=>{
  //if(!mongoose.Types.ObjectId.isValid(to_add.app_id)) return ({status: 400, error: "Invalid user id given."})

  const find_user = await users.getUserId(to_add.user_id)
  if(find_user.status !== 200) return ({status: 404, error: "Could not find user with this user id to add job application to."})

  const result = await new jobApplication({
    company_name: to_add.company_name,
    user_id:to_add.user_id,
    job_title:to_add.job_title,
    date_applied:to_add.date_applied,
    pay:{
      min:to_add.pay.min,
      max:to_add.pay.max
    },
    location:to_add.location,
    remote:to_add.remote,
    link: to_add.link,
    skills: to_add.skills
  })


  if(!result) return {status: 500, error: "Server or Database Error."};

  const res = await result.save();
  if(res) return {status: 201, data: res}
}


exports.getAllUsersJobApps = async (user_id) =>{
  if(!mongoose.Types.ObjectId.isValid(user_id)) return ({status: 400, error: "Invalid user id given."})

  const find_user = await users.getUserId(user_id)
  if(find_user.status !== 200) return ({status: 404, error: "Could not find user with this user id."})

  var find_apps = await jobApplication.find({user_id:user_id});
  if(!find_apps) return {status: 404, error:"Unable to find user or their job applications."}

  let result = []

  for(let x of find_apps){
    result.push({
      id:x._id,
      pay:x.pay,
      company_id:x.company_id,
      user_id:x.user_id,
      job_title:x.job_title,
      location:x.location,
      remote:x.remote,
      link:x.link,
      status:x.status,
      date_applied:x.date_applied,
      skills: x.skills,
      contacts: (await contacts.getContactsByCompanyName(x.user_id, x.company_name))["data"].slice(0,3),
      company_name: x.company_name
    })
  }

  return {status: 200, data:result}
}


exports.getJobApplication = async (app_id)=>{
  if(!mongoose.Types.ObjectId.isValid(app_id)) return ({status: 400, error: "Invalid application id given."})

  const find_app = await jobApplication.findOne({_id:app_id})
  if(!find_app) return {status: 404, error:"Could not find job application with this id."}
  const find_company = await companies.findOne({_id:find_app.company_id})

  const result = {
    id: find_app._id,
    company_id: find_app.company_id,
    user_id: find_app.user_id,
    job_title: find_app.job_title,
    pay: find_app.pay || null,
    location: find_app.location,
    remote: find_app.remote,
    link: find_app.link || null,
    status: find_app.status,
    date_applied: find_app.date_applied,
    skills: find_app.skills,
    company_name: find_app.company_name
  }

  if(!result) return ({status: 404, error: "Could not find job application with this id."})
  return ({status: 200, data: result})
}


exports.updateJobApplication = async (to_update)=>{
  if(!mongoose.Types.ObjectId.isValid(to_update.app_id)) return ({status: 400, error: "Invalid application id given."})
  const result = await jobApplication.findOneAndUpdate({_id:to_update.app_id}, to_update.update, {multi: true})
  if(!result) return ({status:404, error:"Could not find job application with this id."})
  return ({status: 204})
}


exports.deleteJobApp = async (app_id) =>{
  if(!mongoose.Types.ObjectId.isValid(app_id)) return ({status: 400, error: "Invalid application id given."})

  const result = await jobApplication.findOneAndDelete({_id:app_id})
  if(!result) return {status: 500, error:"Server or Database error"}
  return {status: 204}
}