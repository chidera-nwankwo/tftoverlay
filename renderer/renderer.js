
//fetches match history
async function fetchMatches(summonerName, riotTagLine, region) {
    const variable1 = summonerName;
    const variable2 = riotTagLine;
    const variable3 = region;

    console.log(region)

    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches');
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

    fetchMatches(summonerName,riotTagLine,region);
    
});