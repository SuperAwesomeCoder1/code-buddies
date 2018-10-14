const axios = require('axios');


exports.combineResultsItems = async (url) => {
  console.log('URL', url);
  let curPage = await axios.get(url);
  if(!curPage.headers.link)
    return curPage.data.items;
  let lastPage = curPage.headers.link.split(" ")[2].match(/page=(\d+).*$/)[1];
  allData = [];
  for(let i = 1; i <= lastPage && i < 10; ++i){
    let endPageUrl = '&page=' + i;
    curResult = await axios.get(url + endPageUrl);
    allData = allData.concat(curResult.data.items);
  }
  return allData;

}

exports.combineResults = async (url) => {
  console.log('URL', url);
  let curPage = await axios.get(url);
  if(!curPage.headers.link)
    return curPage.data;
  let lastPage = curPage.headers.link.split(" ")[2].match(/page=(\d+).*$/)[1];
  allData = [];
  for(let i = 1; i <= lastPage && i < 5; ++i){
    let endPageUrl = '&page=' + i;
    curResult = await axios.get(url + endPageUrl);
    allData = allData.concat(curResult.data);
  }
  return allData;

}
