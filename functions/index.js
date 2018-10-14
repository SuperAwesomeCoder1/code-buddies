const functions = require("firebase-functions");
const request = require("request");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const getUserSkills = require("./getRepos");
const axios = require("axios");

// For Rate Limiting
const secret = "";
const oauthid = "";
const endURL = "?client_id=" + oauthid + "&client_secret=" + secret;

// Use cors
app.use(cors({ origin: true }));
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/github", (req, res) => {
  res.send("Hello World");
});

app.post("/accountInfo", (req, res) => {
  var github = req.body.github;
  res.send(getGithub(github));
  getPotentialUsers("ann+arbor");
});

function getGithub(github) {
  getUserSkills
    .getUserSkills(github)
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(err.message);
    });
  return "hi";
}

async function getPotentialUsers(location) {
  var options = {
    url:
      "https://api.github.com/search/users?q=location:" +
      location +
      "&per_page=10" +
      endURL,
    headers: {
      "User-Agent": "code-buddies"
    }
  };

  request(options, async (error, response, body) => {
    var people = JSON.parse(body).items;
    var potentialPeople = [];
    for (let person of people) {
      var temp = await getLastlog(person.login);
      if (temp != "") {
        potentialPeople.push(temp);
      }
    }
    console.log(potentialPeople);
  });
}

async function getLastlog(github) {
  var inPastWeek = "";
  await axios
    .get("https://api.github.com/users/" + github + endURL)
    .then(lastLog => {
      lastLog = lastLog.data;
      var activity = new Date(lastLog.updated_at);
      var now = new Date();
      if (
        activity.getFullYear() == now.getFullYear() &&
        activity.getMonth() == now.getMonth() &&
        activity.getDate() >= now.getDate() - 7
      ) {
        inPastWeek = lastLog.login;
      }
    });
  return inPastWeek;
}

exports.findPartners = functions.https.onRequest(app);
