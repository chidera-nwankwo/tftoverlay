

//fetches puuid
async function fetchPuuid(summonerName, riotTagLine, region) {

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id?region=' + region + '&summonerName=' + summonerName + '&tagline=' + riotTagLine);
    const data = await response.json();
    
    let puuid = data.body.puuid;
    //console.log(puuid);
    return puuid;
}

// fetches outdated summonerID first bc riotgames sucks, then fetches tft ranked stats
async function fetchRankStats(puuid) {
    const responseSummonerID = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/summonerID?puuid=' + puuid)
    const dataSummonerID = await responseSummonerID.json();
    //let summonerID = "w0_1WyDNk4q2SX-DqtOOj1Efwy7r8a_mBUGNwbGGdc8xIvg"

    let summonerID = dataSummonerID.body.id;
    console.log(dataSummonerID);

    const responseRankStats = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/rank?summonerID=' + summonerID);
    const dataRankStats = await responseRankStats.json();

    let queueType = dataRankStats.body[0].queueType;
    let tier = dataRankStats.body[0].tier;
    let division = dataRankStats.body[0].rank;
    let LP = dataRankStats.body[0].leaguePoints;

    console.log(queueType, tier, division, LP);

    return queueType, tier, division, LP;
    
}

// fetches specific match details using match IDs
async function fetchMatchDetails(region, puuid) {

    // fetch match IDs
    const responseMatchID = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches?region=' + region + '&puuid=' + puuid);
    const dataMatchID = await responseMatchID.json();
    
    let matchIDArray = dataMatchID.body;

    let placementArray = [];
    let average = 0;

    // iterate through match IDs for placement 
    for (let i=0; i< 20; i++) {
        const responseMatchDetails = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches/details?matchID=' + matchIDArray[i] + '&region=' + region);
        const dataMatchDetails = await responseMatchDetails.json();
        
        // return the index of the current user
        let participants = dataMatchDetails.body.metadata.participants;
        let index = participants.indexOf(puuid);
    
        let placement = dataMatchDetails.body.info.participants[index].placement;

        placementArray.push(placement);
        average += placement;

    }

    average = average/20;
    console.log('avg: '+ average);
    return placementArray;
}

async function writeDB(bundle) {
    /*let bundle = {
        puuid = ,
        summonerID = ,
        region = ,
        gameName = ,
    }*/
}

document.getElementById('minimize-icon').addEventListener('click', () => {
    electron.minimizeWin()
})

document.getElementById('on-top-icon').addEventListener('click', () => {
    electron.setPin('setpin', true)
} )

// gets user input for summoner name and riot tag and region
document.querySelector('form').addEventListener('submit', function(event) {

    // prevents reloading of console window upon form submit
    event.preventDefault();

    var summonerName = document.getElementById('summonerName').value;
    var riotTagLine = document.getElementById('tagLine').value;
    var region = document.getElementById('region').value;

    console.log(summonerName, riotTagLine, region);


    fetchPuuid(summonerName,riotTagLine,region).then(puuid => fetchMatchDetails(region,puuid)).then(placementArray => {console.log('placement: ' + placementArray);})

    // chaining promises so the functions execute in order
    /*fetchPuuid(summonerName, riotTagLine, region)
        .then((puuid) => fetchMatches(puuid,region)
        .then((matchhistory) => fetchMatchDetails(matchhistory, region, puuid)))
        .then((placementArray) => {
            console.log('placement: ' + placementArray);
        })*/
    
});