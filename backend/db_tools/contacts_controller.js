require('dotenv').config({path:__dirname+"/.env"});
const mongoose = require('mongoose');
const Contacts = require('./models/contacts');
const userAccount = require('./models/user_account');


exports.addContact = async (toAdd) =>{
    if(!mongoose.Types.ObjectId.isValid(toAdd.user_id)) return ({status: 400, error: "Invalid user id given."})
    const userCheck = await userAccount.findOne({_id:toAdd.user_id});
    if(!userCheck) return {status: 400, error:"User does not exist."}

    const result = new Contacts(toAdd);
    if(!result) return {status: 500, error: "Server or Database Error."};

    const res = await result.save();
    if(res) return {status: 201, data: res}
    return {status: 500, error: "Server or Database Error."}
}


exports.getContacts = async (user_id, company_name)=>{
    if(!mongoose.Types.ObjectId.isValid(user_id)) return ({status: 400, error: "Invalid user id given."})
    const userCheck = await userAccount.findOne({_id:user_id});
    if(!userCheck) return {status: 400, error:"User does not exist."}

    const result = await Contacts.find({user_id: user_id})
    if(!result) return {status: 500, error: "Server or Database Error."};
    let cleaned_result = result.map(x=>{
        return({
            id: x._id,
            email:x.email,
            first_name:x.first_name,
            last_name:x.last_name,
            company:x.company,
            title:x.title
        })
    })

    if(company_name) cleaned_result = cleaned_result.filter(y=>{return String(y.company)===String(company_name)})
    return {status:200, data:cleaned_result}
}


exports.updateContact = async (to_update) =>{
    if(!mongoose.Types.ObjectId.isValid(to_update.contact_id)) return ({status: 400, error: "Invalid contact id given."})
    const result = await Contacts.findOneAndUpdate({_id:to_update.contact_id}, to_update.update, {multi: true})
    if(!result) return ({status:404, error:"Could not find contact with this id."})
    return ({status: 204})
}


exports.deleteContact = async (contact_id) =>{
    if(!mongoose.Types.ObjectId.isValid(contact_id)) return ({status: 400, error: "Invalid contact id given."})
  
    const result = await Contacts.findOneAndDelete({_id:contact_id})
    if(!result) return {status: 500, error:"Server or Database error"}
    return {status: 204}
}


exports.getContactsByCompanyName = async (user_id, company_name)=>{
    if(!mongoose.Types.ObjectId.isValid(user_id)) return ({status: 400, error: "Invalid user id given."})
    const userCheck = await userAccount.findOne({_id:user_id});
    if(!userCheck) return {status: 400, error:"User does not exist."}

    const result = await Contacts.find({user_id: user_id})
    if(!result) return {status: 500, error: "Server or Database Error."};
    let cleaned_result = result.map(x=>{
        return({
            id: x._id,
            email:x.email,
            first_name:x.first_name,
            last_name:x.last_name,
            company:x.company,
            title:x.title
        })
    })

    if(company_name) cleaned_result = cleaned_result.filter(y=>{return String(y.company)===String(company_name)})
    return {status:200, data:cleaned_result.map(x=>{return x.first_name + " " + x.last_name})}
}

exports.getSingleContact = async (contact_id) =>{
    if(!mongoose.Types.ObjectId.isValid(contact_id)) return ({status: 400, error: "Invalid contact id given."})

    const result = await Contacts.findOne({_id: contact_id})
    if(!result) return {status: 500, error: "Server or Database Error."};
    let cleaned_result = {
        id: result._id,
        email:result.email,
        first_name:result.first_name,
        last_name:result.last_name,
        company:result.company,
        title:result.title
    }

    return {status:200, data:cleaned_result}
}