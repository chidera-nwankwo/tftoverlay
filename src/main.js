const { invoke } = window.__TAURI__.tauri;
const { listen } = window.__TAURI__.event;
const { fetch } = window.__TAURI__.http;


listen("event_name", (eventpayload) => {
  console.log(eventpayload);
});

let greetInputEl;
let greetMsgEl;
let request;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

let API_URL = ""

async function summonerRequest() {
  const response = await fetch(API_URL, {
    method: "GET",
    timeout: 30,
  })

  console.log(response.data.name);
  var summonerName = document.getElementById("summoner-name");
  summonerName.innerHTML = response.data.name;
}

window.addEventListener("click", summonerRequest)


window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
