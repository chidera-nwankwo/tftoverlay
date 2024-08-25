


// ---------------- RENDERER INIT ----------------



// Object defining the summoner and behavior
class SummonerInfo {
    constructor(puuid, summonerID, region, superRegion, gameName) {
        this.puuid = puuid;
        this.summonerID = summonerID;
        this.region = region;
        this.superRegion = superRegion
        this.gameName = gameName;
        this.queueType
        this.tier
        this.LP
        this.division
        this.matchHistory = []
    }

    // makes request for rank stats
    async updateRankInfo() {
        let { queueType, tier, division, LP } = await fetchRankStats(this.puuid, this.region);
        this.queueType = queueType;
        this.tier = tier;
        this.division = division;
        this.LP = LP;
        
    }

    // makes request for match history
    async updateMatchHistory() {
        let placementArray = await fetchMatchDetails(this.superRegion, this.puuid);
        this.matchHistory = placementArray;
        
    }

    // function to load from local storage
    static fromStorage(obj) {
        let instance = new SummonerInfo(obj.puuid, obj.summonerID, obj.region, obj.superRegion, obj.gameName);
        instance.queueType = obj.queueType;
        instance.tier = obj.tier;
        instance.division = obj.division;
        instance.LP = obj.LP;
        instance.matchHistory = obj.matchHistory;
        return instance;
    }

    // displays the current user stats on screen
    async displaySummoner() {
        document.getElementById('rank-details').innerHTML = `
                ${this.gameName}<br>
                ${this.queueType}<br>
                ${this.tier} ${this.division} ${this.LP} LP<br>
                Placement: ${this.matchHistory}
            `;
    
            document.getElementById('rank-image').innerHTML = `
                <img src='../assets/rank_images/${this.tier}.png'>
            `;
    }

}


// UPON APP START: Immediately looks for a previous user in localstorage and displays them
electron.loadLocalStorage( async() => {

    // if local storage user exists
    if(window.localStorage.getItem('user') != null) {

        try {
            
            console.log('User found in storage. Loading...')
            var stored = JSON.parse(window.localStorage.getItem('user'))
            var summoner = SummonerInfo.fromStorage(stored)
            
            await summoner.displaySummoner()

            
        }

        catch (error) {
            console.log('Error when loading from localstorage')
            console.log(error)
        }
    }

    
});



// ---------------- ASYNC FETCH FUNCTIONS ----------------



//fetches puuid from RESTAPI
async function fetchPuuid(summonerName, riotTagLine, region) {
    const response = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id?region=' + region + '&summonerName=' + summonerName + '&tagline=' + riotTagLine);
    const data = await response.json();
    let puuid = data.body.puuid;
    return puuid;
}

// fetches summonerID first then fetches tft ranked stats
async function fetchRankStats(puuid, region) {

    try {
        console.log('fetching rank details...')

        const responseSummonerID = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/summonerID?puuid=' + puuid + '&region=' + region)
        const dataSummonerID = await responseSummonerID.json();
    
        let summonerID = dataSummonerID.body.id;
    
        const responseRankStats = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/rank?summonerID=' + summonerID + '&region=' + region);
        const dataRankStats = await responseRankStats.json();
    
        let queueType = dataRankStats.body[0].queueType;
        let tier = dataRankStats.body[0].tier;
        let division = dataRankStats.body[0].rank;
        let LP = dataRankStats.body[0].leaguePoints;

        console.log('rank details found')

        return {queueType, tier, division, LP};
    }

    catch (error) {
        console.log(error)
    }


    

    
    
}

// fetches specific match details using match IDs
async function fetchMatchDetails(superRegion, puuid) {
    console.log('fetching match details...')

    // fetch match IDs
    const responseMatchID = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches?region=' + superRegion + '&puuid=' + puuid);
    const dataMatchID = await responseMatchID.json();
    
    let matchIDArray = dataMatchID.body;

    let placementArray = [];
    let average = 0;

    // iterate through match IDs for placement 
    for (let i=0; i< 20; i++) {
        const responseMatchDetails = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/tft/matches/details?matchID=' + matchIDArray[i] + '&region=' + superRegion);
        const dataMatchDetails = await responseMatchDetails.json();
        
        // return the index of the current user
        let participants = dataMatchDetails.body.metadata.participants;
        let index = participants.indexOf(puuid);
    
        let placement = dataMatchDetails.body.info.participants[index].placement;

        placementArray.push(placement);
        average += placement;

    }

    average = average/20;
    console.log('match details found... avg: '+ average);
    return placementArray;
}








// ---------------- EVENT LISTENERS ----------------




// exit app
document.getElementById('close-icon').addEventListener('click', () => {
    electron.minimizeWin();

})

// pin the window to always be on top
document.getElementById('on-top-icon').addEventListener('click', () => {
    electron.setPin('setpin');

});

// changes the page to the user submit form
document.getElementById('edit-icon').addEventListener('click', async () => {

    if(document.getElementById('grid-layout').classList.contains('hidden')) {
        document.getElementById('edit-user').classList.add('hidden')
        document.getElementById('grid-layout').classList.remove('hidden')
    }

    else {
        document.getElementById('grid-layout').classList.add('hidden')
        document.getElementById('edit-user').classList.remove('hidden')
    }

    
});

// Submits the user's summoner info and saves it
document.getElementById('submit').addEventListener('click', async () => {
    summonerName = document.getElementById('summonerName').value;
    riotTag = document.getElementById('riotTag').value;
    region = document.getElementById('region').value;

    if (!summonerName || !riotTag || !region) {
        console.log('not complete... please complete the form')
        
        toastify.showToast({
            text: "Missing fields.",
            duration: 3000,
            close: false,
            gravity: "bottom", 
            position: "center", 
            style: {
                background: "linear-gradient(135deg, #c02200, #811700)",
            },
            stopOnFocus: false,
        })
    }

    else {
        try {

            console.log('refreshing rank stats...')

            superRegion = document.querySelector("[value=" + region + "]").parentNode.label
            
            let puuid = await fetchPuuid(summonerName, riotTag, superRegion);
            const responseSummonerID = await fetch('https://w49d8ezvz3.execute-api.us-east-2.amazonaws.com/rgapi/summoner/region/id/summonerID?puuid=' + puuid + '&region=' + region)
            const dataSummonerID = await responseSummonerID.json();
        
            let summonerID = dataSummonerID.body.id;
            summoner = new SummonerInfo(puuid, summonerID, region, superRegion, summonerName);
            await summoner.updateRankInfo()

            window.localStorage.setItem('user', JSON.stringify(summoner))

            await summoner.displaySummoner()

            document.getElementById('edit-user').classList.add('hidden')
            document.getElementById('grid-layout').classList.remove('hidden')

            console.log('rank stats updated')


            toastify.showToast({
                text: "Summoner added!",
                duration: 3000,
                close: false,
                gravity: "bottom", 
                position: "center", 
                style: {
                    background: "linear-gradient(135deg, #15c800, #12ab00)"
                },
                stopOnFocus: false,
            })


        }

        catch (error) {

            console.log(error)

            toastify.showToast({
                text: "Summoner does not exist.",
                duration: 3000,
                close: false,
                gravity: "bottom", 
                position: "center", 
                style: {
                    background: "linear-gradient(135deg, #c02200, #811700)"
                },
                stopOnFocus: false,
            })
            
        }
    }
})

// refreshes rank data
document.getElementById('refresh-icon').addEventListener('click', async () => {

    try {
            document.getElementById('refresh-image').classList.add('animate-spin')

            var storedUser = JSON.parse(window.localStorage.getItem('user'));
            
            if (storedUser) {
                var summoner = SummonerInfo.fromStorage(storedUser)
            }
            
            await summoner.updateRankInfo();
            await summoner.updateMatchHistory();
        
            
            document.getElementById('rank-details').innerHTML = `
                ${summoner.gameName}<br>
                ${summoner.queueType}<br>
                ${summoner.tier} ${summoner.division} ${summoner.LP} LP<br>
                Placement: ${summoner.matchHistory}
            `;
            
            document.getElementById('rank-image').innerHTML = `
                <img src='../assets/rank_images/${summoner.tier}.png'>
            `;
        
            window.localStorage.setItem('user', JSON.stringify(summoner))
        
            document.getElementById('refresh-image').classList.remove('animate-spin')


            toastify.showToast({
                text: "Rank updated!",
                duration: 3000,
                close: false,
                gravity: "bottom",
                position: "center", 
                style: {
                    background: "linear-gradient(135deg, #15c800, #12ab00)",
                },
                stopOnFocus: false, 
            })


    }

    catch (error) {

        toastify.showToast({
            text: "Could not retrieve rank.",
            duration: 3000,
            close: false,
            gravity: "bottom", 
            position: "center", 
            style: {
                background: "linear-gradient(135deg, #c02200, #811700)"
            },
            stopOnFocus: false,
        })

        document.getElementById('refresh-image').classList.remove('animate-spin')
        console.log(error)
    }


    
});