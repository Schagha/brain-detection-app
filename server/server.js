const express = require("express");
const bodyParser = require('body-parser'); 
var cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const app = express();

const database = {
  users: [
    {
      id: "123",
      name: "Max",
      email: "max@gmail.com",
      password: "apple",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sarah",
      email: "sarah@gmail.com",
      password: "cats",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "max@gmail.com"
    }
  ]
};

app.use(bodyParser.json());
app.use(cors())
 
app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in')
  }
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  })
  res.json(database.users[database.users.length-1]);
})

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    } 
  })
  if (!found) {
    res.status(404).json("no such user");
  }  
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    } 
  })
  if (!found) {
    res.status(404).json("no such user");
  }  
})




app.listen(3000, () => {
  console.log("app is running on port 3000");
});

// bcrypt.hash(password, saltRounds, function(err, hash) {
//   console.log(hash)
//   // Store hash in your password DB.
// });

  // Load hash from your password DB.
// bcrypt.compare("apple", "$2b$10$pTQ0ycgwb09nRxUXQF1PkOdxHeMBbucXkYlsxhLu8k0TADvj/jknC", function(err, result) {
//   // result == true
//   console.log("first guess", res)
// });
// bcrypt.compare("avocado", "$2b$10$pTQ0ycgwb09nRxUXQF1PkOdxHeMBbucXkYlsxhLu8k0TADvj/jknC", function(err, result) {
//   // result == false
//   console.log("second guess", res)
// });


/*
/                --> res = this is working
/signin          --> POST = success/fail
/register        --> POST = user
/profile/:userId --> GET = user
/image           --> PUT = user
*/
