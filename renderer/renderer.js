
//fetches match history
async function fetchMatches(puuid, region) {
    puuid = 'MITT5QcsTavDlKKXwrxuwVrWlRNKkJy3HSQp7IdmbhPSN2SLSl8HmFOZzbiqHs0m4MQc37MmKV5asg';

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches?region=' + region + '&puuid=' + puuid);
    const data = await response.json();
    
    console.log(data);
}

//fetches puuid
async function fetchPuuid(summonerName, riotTagLine, region) {

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id?summonerName=' + summonerName + '&riotTagLine=' + riotTagLine + '&region=' + region);
    const data = await response.json();
    
    console.log(data);
}

// gets user input for summoner name and riot tag and region
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    var summonerName = document.getElementById('summonerName').value;
    var riotTagLine = document.getElementById('tagLine').value;
    var region = document.getElementById('region').value;
    console.log(summonerName, riotTagLine, region);

    fetchPuuid(summonerName,riotTagLine, region);
    
});