// VARIABLES
const timelineCards = document.querySelectorAll(".movie-card");
const movieIds = [
    "tt0371746",
    "tt0800080",
    "tt1228705",
    "tt0800369",
    "tt0458339",
    "tt0848228",
    "tt1300854",
    "tt1981115",
    "tt2015381",
    "tt3896198",
    "tt1843866",
    "tt2395427",
    "tt0478970",
    "tt3498820",
    "tt2250912",
    "tt1825683",
    "tt1211837",
    "tt3501632",
    "tt4154756",
    "tt5095030",
    "tt4154664",
    "tt4154796"
];
let allBubblesFills = [];
let allBubbles = [];

let cardClicked = null;

window.addEventListener("DOMContentLoaded", init);

function init() {
    getAllMoviesData();
    importSVGLogo();
    importSVGTimeline();
    
}
function importSVGLogo() {
    fetch("marvel-logo.svg")
        .then(response => response.text())
        .then(svgData => {
            document.getElementById("svg-logo").insertAdjacentHTML('afterbegin', svgData);
        })
}
function importSVGTimeline() {
    fetch("timeline.svg")
        .then(response => response.text())
        .then(svgData => {
            document.getElementById("svg-timeline").insertAdjacentHTML('beforeend', svgData);

            // select all bubbles and all their fills
            allBubblesFills = document.querySelectorAll(".s1");
            allBubbles = document.querySelectorAll(".bubble"); 

            // add eventListener to svg           
            allBubbles.forEach(bubble => bubble.addEventListener("click", () => bubbleClicked(bubble.id)));
        })
}

function getAllMoviesData(params) {
    const promises = movieIds.map(fetchData)
    // stock up all fetches and save it to one variable
    Promise.all(promises)
        .then(responses => {
            responses = responses.map(obj => obj.json())
            return Promise.all(responses)
        })
        .then(injectDataToCards)
}

function fetchData(imdbMovieId) {
    return fetch(`https://www.omdbapi.com/?i=${imdbMovieId}&apikey=97a94d75`)
}

function injectDataToCards(allMoviesData) { 
    timelineCards.forEach((card, i) => {
        // Add data to right places in the DOM
        card.style.backgroundImage = `url(${allMoviesData[i].Poster})`;
        card.querySelector("h2").innerHTML = allMoviesData[i].Title;
        card.querySelector(".year").innerHTML = allMoviesData[i].Year;
        card.querySelector(".score").innerHTML = allMoviesData[i].imdbRating;
        card.querySelector(".awards").innerHTML = allMoviesData[i].Awards;
        card.querySelector(".imdb-link").innerHTML = `<a href="https://www.imdb.com/title/${allMoviesData[i].imdbID}/" target="_blank"><i class="fab fa-imdb"></i></a>`;
        card.querySelector(".website-link").innerHTML = `<a href="${allMoviesData[i].Website}" target="_blank"><i class="fas fa-globe-americas"></i></a>`;
        card.querySelector(".description").innerHTML = allMoviesData[i].Plot;
        card.id = `movie${i}`;

        // add EventListener to close prev card and open new one
        card.addEventListener("click", () => {
            closeOpenedCard(cardClicked);
            cardClicked = card;
            expandCard(card);
        });

        // Add EventListener on X to close the container that was opened
        card.querySelector("div h1").addEventListener("click", (e) => {
            e.stopPropagation();
            closeOpenedCard(card);
            // reset bubbles' fills
            resetBubbles();
        })  
    })
}

function closeOpenedCard(card) {
    if (!card) { return; }

    // close the container
    card.classList.remove("movie-card--expanded");
    card.querySelector("div").style.display = "none";

    // add Hover to the container
    card.addEventListener("transitionend", () => {
        card.classList.add("unclicked");
    });

    // change container's clip-path acording to its position
    card.classList.contains("movie__first")
        ? card.classList.remove("movie__first--clicked")
        : card.classList.contains("movie__middle")
            ? card.classList.remove("movie__middle--clicked")
            : card.classList.remove("movie__last--clicked")
}

function expandCard(card) {
    resetBubbles(); 

    // color bubbles
    let bubbleNr = Number(card.id.slice(5)) + 1;
    console.log(allBubbles);
    
    let colBubbles = allBubbles.filter(bubble => Number(bubble.id.slice(2)) <= bubbleNr);
    console.log(colBubbles);
    
    // if (someNr <= bubbleNr) {
    //     document.querySelector(`#nr${bubbleNr} circle`).classList.add("fill--pink");
    // }

    // expand the container
    card.classList.add("movie-card--expanded");
    card.querySelector("div").style.display = "block";

    // remove Hover from the container
    card.addEventListener("transitionend", () => {
        card.classList.remove("unclicked");
    });

    // change container's clip-path acording to its position
    card.classList.contains("movie__first")
        ? card.classList.add("movie__first--clicked")
        : card.classList.contains("movie__middle")
            ? card.classList.add("movie__middle--clicked")
            : card.classList.add("movie__last--clicked")
}
function resetBubbles() {
    console.log("removing fills");
    allBubblesFills.forEach(fill => fill.classList.remove("fill--pink"));
}

function bubbleClicked(bubbleClicked) {
    let id = bubbleClicked.slice(2) - 1;
    closeOpenedCard(cardClicked);
    cardClicked = document.getElementById(`movie${id}`);
    expandCard(cardClicked);  
}