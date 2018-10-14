const request = require("request");
const axios = require('axios');
const paginationWorker = require('./paginationWorker');
const secret = '';
const oauthid = '';
const endURL = '?client_id=' + oauthid + '&client_secret=' + secret;
let githubLogin = ''
exports.getUserSkills = async (githubUserName) => {
  console.log('entering user:', githubUserName);
  let url = "https://api.github.com/users/" + githubUserName + "/repos" + endURL;
  githubLogin = githubUserName;
  let userData = await axios.get(url);
  let commits = getCommits(userData.data);
  let skills = await getWeightedSkills(commits);
  return skills;
}
//returns array of commit api urls
function getCommits(userReposBody) {
//  console.log('param body', userReposBody);
  let commits = [];
  for (let repo of userReposBody){
    let { commits_url } = repo;
    commits_url = commits_url.substring(0, commits_url.length - 6);
    commits.push({
      url: commits_url + endURL,
      language: repo.language
    });
  }
  return commits;
}

async function getWeightedSkills(commitMappings){
  let skills = {};
  for(let commitMapping of commitMappings) {
    try{
      console.log('mappin url', commitMapping.url);
    let res = await axios.get(commitMapping.url);
    if(!res)
      return {};
    for(let commit of res.data){
      if(commit.commit.author.name === githubLogin){
        if(!skills[commitMapping.language]){
          skills[commitMapping.language] = 0;
        }
        skills[commitMapping.language]++;

      }
    }
    }catch(err){console.log(err.message);}
  }
  console.log('user', githubLogin, 'tally', skills);
  return skills;
}
