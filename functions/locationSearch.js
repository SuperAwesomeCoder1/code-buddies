const axios = require('axios');
const getRepos = require('./getRepos');
const paginationWorker = require('./paginationWorker');
const queryStrBeg = 'https://api.github.com/search/users?q=repos%3A1+location%3A';
const queryStrEnd = '&type=Users';

const secret = '65efde6988a80157a25629202d09ea23b4f52096';
const oauthid = '47a9e669be1b3d1e913f';
const endURL1 = '&client_id=' + oauthid + '&client_secret=' + secret;
const endURL2 = '?client_id=' + oauthid + '&client_secret=' + secret;
const RECENT_DAYS = 5000;
daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day);
}

exports.findRelevantUsers = async (location, langCommitCounts) => {
  const queryStr = queryStrBeg + location + queryStrEnd;
  //first find active users
  const locationUsers = await paginationWorker.combineResultsItems(queryStr + endURL1);
  let goodUsers = [];
  let count = 0;
  for(let user of locationUsers){
    if (goodUsers.length  > 5 || count > 1000)
      break;
    ++count;
    let eventURL = user.events_url.substring(0, user.events_url.length-10) + endURL2
    const active = await isActiveUser(eventURL, RECENT_DAYS);
    if(active){
      let langSkills = await getRepos.getUserSkills(user.login);
      let languageDistanceFeature = 0;
      let seenNumber = false;
      for(let language of Object.keys(langSkills)){
        if(langCommitCounts[language] != 0 || langSkills[language] != 0)
          seenNumber = true;
        let difference2 = Math.pow(langCommitCounts[language] - langSkills[language], 2);
        languageDistanceFeature += difference2;
      }
      languageDistanceFeature = Math.pow(languageDistanceFeature, .5);
      if(seenNumber && languageDistanceFeature < 10)
        goodUsers.push({name: user.name, email: user.email, github: user.login})
    }
  }
  return goodUsers;
}

const isActiveUser = async (eventsURL, days) => {
  const events = await axios.get(eventsURL);

  //possible user has no history
  if(!events.data || events.data.length <= 0)
    return false;
  return days > daysBetween(new Date(events.data[0].created_at), new Date());
}
