//fetches puuid
async function fetchPuuid(summonerName, riotTagLine, region) {

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id?region=' + region + '&summonerName=' + summonerName + '&tagline=' + riotTagLine);
    const data = await response.json();
    
    let puuid = data.body.puuid;
    //console.log(puuid);
    return puuid;
}

// fetches match history ID ONLY
async function fetchMatches(puuid, region) {

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches?region=' + region + '&puuid=' + puuid);
    const data = await response.json();
    
    let parsedMatches = data.body;
    //console.log(parsedMatches);
    return parsedMatches;
}

// fetches outdated summonerID first bc riotgames sucks, then fetches tft ranked stats
async function fetchRankStats() {
    let summonerID = "w0_1WyDNk4q2SX-DqtOOj1Efwy7r8a_mBUGNwbGGdc8xIvg"

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/rank?summonerID=' + summonerID);
    const data = await response.json();

    let queueType = data.body[0].queueType;
    let tier = data.body[0].tier;
    let division = data.body[0].rank;
    let LP = data.body[0].leaguePoints;

    console.log(queueType, tier, division, LP);

    return queueType, tier, division, LP;
    
}

// fetches specific match details
async function fetchMatchDetails(matchIDArray, region, puuid) {

    let placementArray = [];

    for (let i=0; i< 20; i++) {
        const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches/details?matchID=' + matchIDArray[i] + '&region=' + region);
        const data = await response.json();
        
        // return the index of the current user
        let participants = data.body.metadata.participants;
        let index = participants.indexOf(puuid);
    
        let placement = data.body.info.participants[index].placement;

        placementArray.push(placement)

    }

    return placementArray;
}

// gets user input for summoner name and riot tag and region
document.querySelector('form').addEventListener('submit', function(event) {

    // prevents reloading of console window upon form submit
    event.preventDefault();

    var summonerName = document.getElementById('summonerName').value;
    var riotTagLine = document.getElementById('tagLine').value;
    var region = document.getElementById('region').value;

    console.log(summonerName, riotTagLine, region);

    fetchRankStats()

    // chaining promises so the functions execute in order
    /*fetchPuuid(summonerName, riotTagLine, region)
        .then((puuid) => fetchMatches(puuid,region)
        .then((matchhistory) => fetchMatchDetails(matchhistory, region, puuid)))
        .then((placementArray) => {
            console.log('placement: ' + placementArray);
        })*/
    
});