require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require("./db_tools/user_controller");
const jobs = require("./db_tools/jobs_controller");
const con = require("./db_tools/contacts_controller");
const bodyParser = require("body-parser")

const app = express();

// database stuff
db.connectDB();

// middleware stuff
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

corsOptions={
  origin:"http://localhost:3000"
}

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add other headers here
  res.setHeader('Access-Control-Allow-Methods', 'POST'); // Add other methods here
  res.send();
});

const userSignUpValidator = (req, res, next) => {
  // check if we were given all the fields needed
  if (! req.body.email || !req.body.first_name || !req.body.last_name) return res.sendStatus(400);
  next();
};

const userLoginValidator = (req, res, next) => {
  if (!req.body.email || !req.body.password) return res.sendStatus(400);
  next();
};

const jobApplicationValidator = (req, res, next)=>{
  if(!req.body.company_name || !req.body.job_title || !req.body.location || typeof req.body.remote !== 'boolean') return res.sendStatus(400)
  next();
}

const PORT = process.env.PORT || 4000


// Endpoint Routing
app.get("/", (req, res)=>{
  res.send("Hello world!");
})

app.post("/", (req, res)=>{
  res.send("Hello world!2");
})


/*
                   JOB APPLICATION ENDPOINTS
*/
// user applies to position in req.body
app.post("/application/user/:user_id", jobApplicationValidator, async (req, res)=>{
  let pay_min, pay_max;

  if(!req.body.pay){
    pay_min, pay_max = null
  }else{
    pay_min = req.body.pay.min
    pay_max = req.body.pay.max
  }

  const obj = {
    user_id:req.params.user_id,
    company_name:req.body.company_name,
    job_title:req.body.job_title,
    pay:{
      min:pay_min,
      max:pay_max
    },
    location:req.body.location,
    remote:req.body.remote,
    link: req.body.link? req.body.link: null,
    date_applied: req.body.date_applied?req.body.date_applied: Date().now(),
    skills: req.body.skills
  }

  if(req.body.link) obj.link = req.body.link
  if(req.body.date_applied) obj.date_applied = req.body.date_applied

  const result = await jobs.addJobApplication(obj)

  if(result.status !== 201) return res.status(result.status).json({error:result.error})

  const cleaned_result = {
    id: result.data._id,
    company_name: result.data.company_name,
    user_id: result.data.user_id,
    job_title: result.data.job_title,
    pay: result.data.pay || null,
    location: result.data.location,
    remote: result.data.remote,
    link: result.data.link || null,
    status: result.data.status,
    date_applied: result.data.date_applied,
    skills:result.data.skills
  }

  return res.status(result.status).json(cleaned_result)
  
})


// get all users's job apps
app.get("/application/user/:user_id", async (req, res)=>{
  const result = await jobs.getAllUsersJobApps(req.params.user_id)
  if(result.status !== 200) return res.status(result.status).json({error:result.error})
  return res.status(result.status).json({data:result.data})
})


// get get a job app by id
app.get("/application/:application_id", async (req, res)=>{
  // using the id of the job application and the req body.
  const result = await jobs.getJobApplication(req.params.application_id)
  if(result.status!== 200) return res.status(result.status).json({error:result.error})
  return res.status(result.status).json(result.data)
})


app.patch("/application/:application_id", async (req, res)=>{
  // using the id of the job application and the req body.
  // fields that can change: job_title, pay: min and max, location, remote, link, and status
  // none of these are requred
  if(req.body === {} || !req.body || Object.keys(req.body).length === 0) return res.status(400).json({error:"No data given."})

  var obj = {}
  if(req.body.job_title) obj.job_title = req.body.job_title
  if(req.body.pay) obj.pay = req.body.pay
  if(req.body.location) obj.location = req.body.location
  if(typeof req.body.remote === 'boolean') obj.remote = req.body.remote
  if(req.body.link) obj.link = req.body.link
  if(req.body.status) obj.status = req.body.status
  if(req.body.skills) obj.skills = req.body.skills
  if(req.body.date_applied) obj.date_applied = req.body.date_applied
  if(req.body.company_name) obj.company_name = req.body.company_name
  if(obj === {} || !obj || Object.keys(obj).length === 0) return res.status(400).json({error:"No data given."})

  const result = await jobs.updateJobApplication({app_id: req.params.application_id, update: obj})
  if(result.status !== 204) return res.status(result.status).json({error:result.error})
  return res.status(result.status).end()
})


app.delete("/application/:application_id", async (req, res)=>{
  // using the id of the job application and the req body.
  const result = await jobs.deleteJobApp(req.params.application_id)
  if(result.status !== 204) return res.status(result.status).json({error:result.error})
  return res.status(result.status).end()
})


/*
                   USER ACCOUNT ENDPOINTS
*/
// this is where the data to enter to the db goes
app.post('/register', userSignUpValidator, async (req, res) => {
  // create a new user

  try {
    // hash the password using a salt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // user object to add to the database
    const user = {
      password: hashedPassword,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };

    const result = await db.registerNewUser(user);
    // refactor this at some point
    if(result.status != 500 && result.status != 409){
      res.status(result.status).json({id: result.data._id});
    }else{
      res.status(result.status).json({error:result.error});
    }
  } catch {
    res.status(500).json({ status: 500, error: 'Server or Database Error.' });
  }
})


app.post('/login', userLoginValidator, async (req, res) => {
  // checks user password against the hash and salted password in the database
  const user = await db.getUser(req.body);
  if (user == null) return res.status(404).json({ error: 'Could not find user.' });

  try {
    // compare password vs hashed password in db
    if (await bcrypt.compare(req.body.password, user.password)) {
      //user can log in
      return res.status(200).json({id:user._id})
    }
    // wrong password
    else return res.status(403).json({ error: 'Incorrect password.' });
  } catch {
    return res.status(500).json({ error: 'Server error.' });
  }
})


app.get('/profile/:user_id', async (req, res) => {
  if (!req.params.user_id) res.status(400).json({ error: 'No user_id given.' });
  const result = await db.getUserId(req.params.user_id);
  if(result.status != 200) res.status(result.status).json({error:result.error})

  // just so that the format is right >:(
  const cleaned_result = {
    id: result.data._id,
    email: result.data.email,
    first_name: result.data.first_name,
    last_name: result.data.last_name,
    dateCreated: result.data.dateCreated
  }

  res.status(result.status).json(cleaned_result)
})


app.get('/profile', async (req, res) => {
  if(!req.query.email) return res.status(400).json({error: "No email given"})
  const result = await db.getUserByEmail(req.query.email);
  if(result.status === 200) return res.status(302).end()
  return res.status(404).end()
})


app.patch('/profile/:user_id', async (req, res)=>{
  // update a user profile
  if(!req.body.first_name && !req.body.last_name) return res.status(400).json({error:"no first name or last name given."})

  var obj = {}
  if(req.body.first_name) obj.first_name = req.body.first_name
  if(req.body.last_name) obj.last_name = req.body.last_name
  if(obj === {} || !obj || Object.keys(obj).length === 0) return res.status(400).json({error:"No data given."})

  const result = await db.updateUser({user_id: req.params.user_id, update: obj})
  if(result.status !== 204) return res.status(result.status).json({error:result.error})
  return res.status(result.status).end()
})


/*
                     CONTACT ENDPOINTS
*/
//create new contact
app.post("/contacts/user/:user_id", async (req, res)=>{
  if(!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.company || !req.body.title) return res.status(400).json({error: "Request body is missing one or more of the requred attributes."})
  
  const contact = {
    user_id: req.params.user_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    company:  req.body.company,
    title: req.body.title
  }

  const result = await con.addContact(contact)
  if(result.status === 201) return res.status(result.status).json({id: result.data._id});
  return res.status(result.status).json({error: result.error});
})


// get all of the contacts of this user
// query param company filters based on company name
app.get("/contacts/user/:user_id", async (req, res)=>{
  if(Object.keys(req.query).length>0){
    if(!req.query.company) return res.status(400).json({error:"No company name given in query."})
    const result = await con.getContacts(req.params.user_id, req.query.company)
    return res.status(result.status).json(result.data)
  }else{
    const result = await con.getContacts(req.params.user_id, null)
    return res.status(result.status).json({data:result.data})
  }
});


app.patch("/contacts/:contact_id", async (req, res)=>{
  // contact update
  if(!req.body.first_name && !req.body.last_name && !req.body.email && !req.body.company && !req.body.title) return res.status(400).json({error:"No attributes given to update"})

  var obj = {}
  if(req.body.first_name) obj.first_name = req.body.first_name
  if(req.body.last_name) obj.last_name = req.body.last_name
  if(req.body.email) obj.email = req.body.email
  if(req.body.company) obj.company = req.body.company
  if(req.body.title) obj.title = req.body.title
  if(obj === {} || !obj || Object.keys(obj).length === 0) return res.status(400).json({error:"No data given."})

  const result = await con.updateContact({contact_id: req.params.contact_id, update: obj})
  if(result.status !== 204) return res.status(result.status).json({error:result.error})
  return res.status(result.status).end()
})


app.delete("/contacts/:contact_id", async (req, res)=>{
  const result = await con.deleteContact(req.params.contact_id)
  if(result.status !== 204) return res.status(result.status).json({error:result.error})
  return res.status(result.status).end()
})


app.get("/contacts/:contact_id", async (req, res)=>{
  const result = await con.getSingleContact(req.params.contact_id)
  return res.status(result.status).json(result.data)
})


app.listen(PORT, () => {
  console.log('Server started on port: ', PORT);
});
