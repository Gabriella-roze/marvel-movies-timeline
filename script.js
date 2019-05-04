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

window.addEventListener("DOMContentLoaded", init);

function init() {
    getAllMoviesData();
    
}


function getAllMoviesData(params) {
    const promises = movieIds.map(fetchData)

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

    console.log(allMoviesData);

    
    timelineCards.forEach((card, i) => {

        card.style.backgroundImage = `url(${allMoviesData[i].Poster})`;
        card.querySelector("h2").innerHTML = allMoviesData[i].Title;
        card.querySelector(".year").innerHTML = allMoviesData[i].Year;
        card.querySelector(".score").innerHTML = allMoviesData[i].imdbRating;
        card.querySelector(".awards").innerHTML = allMoviesData[i].Awards;
        card.querySelector(".imdb-link").innerHTML = `<a href="https://www.imdb.com/title/${allMoviesData[i].imdbID}/" target="_blank"><i class="fab fa-imdb"></i></a>`;
        card.querySelector(".website-link").innerHTML = `<a href="${allMoviesData[i].Website}" target="_blank"><i class="fas fa-globe-americas"></i></a>`;
        card.querySelector(".description").innerHTML = allMoviesData[i].Plot;
        
        card.id = allMoviesData[i].imdbID;

        card.addEventListener("click", () => {
            card.classList.add("movie-card--expanded");

            // TODO: transitionEnd change class to remove hover
            card.addEventListener("transitionend", () => {
                card.classList.remove("unclicked");
            });





            card.classList.contains("movie__first") 
                ? card.classList.add("movie__first--clicked")
                : card.classList.contains("movie__middle") 
                    ? card.classList.add("movie__middle--clicked")
                    : card.classList.add("movie__last--clicked")
            ;

            if (card.classList.contains("movie__first--clicked") || 
                card.classList.contains("movie__middle--clicked") || 
                card.classList.contains("movie__last--clicked")) {

            }

            card.querySelector("div").style.display = "block";
            card.querySelector("div h1").addEventListener("click", () => {
                console.log("clicked X");
                
                card.classList.remove("movie-card--expanded");
                card.querySelector("div").style.display = "none";

            })
            
        })

        
    })

}


function closeMovieDetails(card) {
    
}