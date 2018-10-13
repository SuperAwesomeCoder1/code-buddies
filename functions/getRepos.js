const request = require("request");
const axios = require('axios');
async function getUserSkills(githubUserName) {
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
  let userData = await axios.get("https://api.github.com/users/" + github + "/repos")
  let commits = getCommits(response.body);
  let skills = await getWeightedSkils(commits);
  return skills;

}
//returns array of commit api urls
function getCommits(userReposBody) {
  let commits = [];
  for (let repo of userReposBody){
    const { commits_url } = repo;
    commits.push({
      url: repo.commits_url,
      language: repo.language
    });
  }
  return commits;
}

async function getWeightedSkills(commitMappings){
  let skills = {};
  for(let commitMapping of commitMappings) {
    let res = await axios.get(commitMapping.url);
    skills[commitMapping.language] += res.body.length;
  }
  return skills;
}
