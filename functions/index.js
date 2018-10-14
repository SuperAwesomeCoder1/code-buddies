const functions = require("firebase-functions");
const request = require("request");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getUserSkills = require("./getRepos")
const app = express();
const locationSearch = require('./locationSearch');
const paginationWorker = require('./paginationWorker');


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
  getGithub(github, res);

});

function getGithub(github, origresponse) {
  getUserSkills.getUserSkills(github)
  .then((res) => {
    locationSearch.findRelevantUsers('london', res)
    .then(response => {
      console.log('res', response);
      origresponse.send(response);
      return response;
    })
    .catch(err => {console.log(err.message)})
    return res;
  })
  .catch(err => {
    console.log(err.message)
  });
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
