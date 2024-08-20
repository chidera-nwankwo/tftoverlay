
// Object defining the user
class SummonerInfo {
    constructor(puuid, summonerID, region, gameName) {
        this.puuid = puuid;
        this.summonerID = summonerID;
        this.region = region;
        this.gameName = gameName;
        this.queueType
        this.tier
        this.LP
        this.division
        this.matchHistory = []
    }

    async updateRankInfo() {
        let { queueType, tier, division, LP } = await fetchRankStats(this.puuid);
        this.queueType = queueType;
        this.tier = tier;
        this.division = division;
        this.LP = LP;
        
    }

    async updateMatchHistory() {
        let placementArray = await fetchMatchDetails(this.region, this.puuid);
        this.matchHistory = placementArray;
        
    }

}

// ---------------- ASYNC FETCH FUNCTIONS ----------------

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
    //console.log(dataSummonerID);

    const responseRankStats = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/rank?summonerID=' + summonerID);
    const dataRankStats = await responseRankStats.json();

    let queueType = dataRankStats.body[0].queueType;
    let tier = dataRankStats.body[0].tier;
    let division = dataRankStats.body[0].rank;
    let LP = dataRankStats.body[0].leaguePoints;

    //console.log(queueType, tier, division, LP);

    return {queueType, tier, division, LP};
    
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


// ---------------- EVENT LISTENERS ----------------

document.getElementById('close-icon').addEventListener('click', () => {
    electron.minimizeWin();
})

document.getElementById('on-top-icon').addEventListener('click', () => {
    electron.setPin('setpin', true);
});

document.getElementById('edit-icon').addEventListener('click', async () => {
    document.getElementById('grid-layout').style.visibility = 'hidden';


    //load user input element
    //change create new summoner object
    // set visibility = 'visible'
});

document.getElementById('refresh-icon').addEventListener('click', async () => {
    let puuid = await fetchPuuid('Chadera', 'Based', 'americas');
    let summoner = new SummonerInfo(puuid, 'w0_1WyDNk4q2SX-DqtOOj1Efwy7r8a_mBUGNwbGGdc8xIvg', 'americas', 'Chadera');

    await summoner.updateRankInfo();

    document.getElementById('rank-details').innerHTML = `
        Summoner Name: ${summoner.gameName}<br>
        Queue Type: ${summoner.queueType}<br>
        Rank: ${summoner.tier} ${summoner.division} ${summoner.LP} LP<br>
        Placement: ${summoner.matchHistory}
    `;

    document.getElementById('rank-image').innerHTML = `
        <img src='../assets/rank_images/${summoner.tier}.png'>
    `;

    document.getElementById('grid-layout').style.visibility = 'visible';
});