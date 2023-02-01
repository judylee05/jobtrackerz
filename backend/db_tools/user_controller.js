require('dotenv').config({path:__dirname+"/.env"});
const mongoose = require('mongoose');
const userAccount = require('./models/user_account');

// INITIAL DB CONNECTION
exports.connectDB = () =>{
  const db_connection_parameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  try{
    mongoose.connect(process.env.DB_URL, db_connection_parameters);
    console.log("Connected to database.")
  }catch(error){
    console.error("Error connecting to mongoDB: ", error)
  }
}


// register the new user in to the database
exports.registerNewUser = async (user)=>{
  // function that checks if the user already exists in the database
  // if so send an error, else put them in the database :)

  // email must be unique
  const emailCheck = await userAccount.findOne({email:user.email});
  if(emailCheck) return {status: 409, error:"Email already exist."}

  const result = await new userAccount(user);
  if(!result) return {status: 500, error: "Server or Database Error."};

  const res = await result.save();
  if(res) return {status: 201, data: res}
  return {status: 500, error: "Server or Database Error."}
}


exports.updateUser = async (to_update)=>{
  if(!mongoose.Types.ObjectId.isValid(to_update.user_id)) return ({status: 400, error: "Invalid user id given."})
  const result = await userAccount.findOneAndUpdate({_id:to_update.user_id}, to_update.update, {multi: true})
  if(!result) return ({status:404, error:"Could not find user with this id."})
  return ({status: 204})

}


exports.getUser = async (user)=>{
  // find user based on email
  const result = await userAccount.findOne({email:user.email});
  if(result) return result
  return null
}


exports.getUserId = async (user_id)=>{
  // find a user based on user_id
  if(!mongoose.Types.ObjectId.isValid(user_id)) return ({status: 400, error: "Invalid user id given."})
  const result = await userAccount
  .findOne({_id:user_id})
  .select({email:1, first_name:1, last_name:1, dateCreated:1});
  if(result) return ({status:200, data:result})
  return ({status: 404, error: "User not found."})
}


exports.getUserByEmail = async (email)=>{
  const result = await userAccount
  .findOne({email:email})
  
  if(result) return ({status:200, data:true})
  return ({status: 404, data:false})
}