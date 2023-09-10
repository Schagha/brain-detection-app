const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var cors = require("cors");

const signin = require("./controllers/signin")
const register = require("./controllers/register");
const profile = require("./controllers/profile")
const image = require("./controllers/image")

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "smartbrain",
  },
});

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
      email: "max@gmail.com",
    },
  ],
};

app.use(bodyParser.json());
app.use(cors());

/*/                --> res = this is working
/signin          --> POST = success/fail
/register        --> POST = user
/profile/:userId --> GET = user
/image           --> PUT = user
*/

app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});

app.get("/", (req, res) => { res.send(database.users) });
app.post("/signin", (req, res) => {signin.handleSignin(req, res, knex, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, knex, bcrypt)});
app.get("/profile/:id", (req, res) => {profile.handleProfile(req, res, knex)});
app.put("/image", (req, res) => {image.hanleImage(req, res, knex)});
app.post("/imageurl", (req, res) => {image.handleApiCall(req, res)});

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
