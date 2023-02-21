const BASE_URL = "https://api.jikan.moe/v4";
const ANIMEFLV_URL = "https://animeflv.net";

function prueba(){
  fetch('https://api.jikan.moe/v4/anime?q=boku+no+hero&start_date=2023')
  .then((response) => {console.log(response)})  
}

function searchAnime() {  
  const searchBox = document.getElementById("search-box");
  const query = searchBox.value;

  fetch(`${BASE_URL}/anime?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
      // console.log(response.json)
      data.data.forEach(item => {
        const animeDiv = document.createElement("div");
        animeDiv.innerHTML = `
          <p>${item.title}</p>
          <img src="${item.images.jpg.image_url}" />
          <button onclick="selectAnime(${item.mal_id})">Seleccionar</button>
        `;
        resultsDiv.appendChild(animeDiv);
      })
    });
}
function selectAnime(animeId) {
    fetch(`${BASE_URL}/anime/${animeId}`)
      .then((response) => response.json())
      .then((data) => {
        const seasonsDiv = document.getElementById("seasons");
        seasonsDiv.innerHTML = "";
  
        for (let season of data["title"].match(/(\d+)/g)) {
          const seasonDiv = document.createElement("div");
          seasonDiv.innerHTML = `
            <p>Temporada ${season}</p>
            <button onclick="selectSeason(${animeId}, ${season})">Seleccionar</button>
          `;
          seasonsDiv.appendChild(seasonDiv);
        }
      });
  }

  function selectSeason(animeId, seasonNumber) {
    fetch(`${ANIMEFLV_URL}/anime/${animeId}/season/${seasonNumber}`)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const episodes = doc.querySelectorAll(".ListEpisodios li");
  
        const episodesDiv = document.getElementById("episodes");
        episodesDiv.innerHTML = "";
  
        for (let episode of episodes) {
          const episodeLink = episode.querySelector("a");
          const episodeNumber = episodeLink.innerText.match(/(\d+)/)[0];
          const episodeUrl = `${ANIMEFLV_URL}${episodeLink.getAttribute("href")}`;
          const episodeDiv = document.createElement("div");
          episodeDiv.innerHTML = `
            <p>Episodio ${episodeNumber}</p>
            <button onclick="playEpisode('${episodeUrl}')">Reproducir</button>
          `;
          episodesDiv.appendChild(episodeDiv);
        }
      });
  }
  
  function playEpisode(episodeUrl) {
    const playerDiv = document.getElementById("player");
    playerDiv.innerHTML = "";
  
    const video = document.createElement("video");
    video.setAttribute("controls", "");
    video.setAttribute("crossorigin", "anonymous");
    const source = document.createElement("source");
    source.setAttribute("src", episodeUrl);
    source.setAttribute("type", "video/mp4");
    video.appendChild(source);
    playerDiv.appendChild(video);
  
    const player = new Plyr(video);
    player.play();
  }