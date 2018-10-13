const functions = require("firebase-functions");
const request = require("request");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getUserSkills = require("./getRepos")
const app = express();

// Use cors
app.use(cors({ origin: true }));
//Body Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get("/github", (req, res) => {
  res.send("Hello World");
});

app.post("/accountInfo", (req, res) => {
  var github = req.body.github;
  res.send(getGithub(github));
});

function getGithub(github) {
  getUserSkills.getUserSkills(github).then((res) => {
  //  console.log(res);
    return res;
  }).catch(err => {
    console.log(err.message)
  });
  return "hi";
}

exports.findPartners = functions.https.onRequest(app);

/*console.log(req);
var linkedin = req.query.linkedin;
var github = req.query.github;
response.send(getGithub(github));
function getGithub(github) {
  var options = {
    url: "https://api.github.com/users/" + github + "/repos",
    headers: {
      "User-Agent": "code-buddies"
    }
  };

  request(options, (error, response, body) => {
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", body);
    return body;
  });
}
*/
