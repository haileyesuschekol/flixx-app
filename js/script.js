const global = {
  currnetPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResult: 0,
  },
  api: {
    API_KEY: `a29e88b1702b3a749bc5ac22ab8f3975`,
    URL: `https://api.themoviedb.org/3/`,
  },
}

//show and hide spinners
const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show")
}
const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show")
}

//display popular movies
const displayPopularMovies = async () => {
  const { results } = await fetchApi("movie/popular")

  results.forEach((movie) => {
    const div = document.createElement("div")
    div.classList.add("card")

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">     
   ${
     movie.poster_path
       ? `<img
         src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
         class="card-img-top"
         alt="${movie.name}"
       />`
       : `<img
         src="../images/no-image.jpg"
         class="card-img-top"
         alt="${movie.name}"
       />`
   }
    </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`
    document.querySelector("#popular-movies").appendChild(div)
  })
}

//display tv shows
const displayTvShow = async () => {
  const { results } = await fetchApi("tv/popular")

  results.forEach((show) => {
    const div = document.createElement("div")
    div.classList.add("card")

    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
   ${
     show.poster_path
       ? `<img
         src="https://image.tmdb.org/t/p/w500${show.poster_path}"
         class="card-img-top"
         alt="${show.name}"
       />`
       : `<img
         src="../images/no-image.jpg"
         class="card-img-top"
         alt="${show.name}"
       />`
   }
    </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>`
    document.querySelector("#popular-shows").appendChild(div)
  })
}

// search movies / tv shows
const search = async () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  global.search.type = urlParams.get("type")
  global.search.term = urlParams.get("search-term")

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchApiData()
    global.search.page = page
    global.search.totalPages = total_pages
    global.search.totalResult = total_results
    if (results.lenght === 0) {
      showAlert("No result found")
      return
    }
    displaySerchResults(results)
    document.querySelector("#search-term").value = ""
  } else {
    showAlert("please enter a search item")
  }
}

const displaySerchResults = (results) => {
  document.querySelector("#search-results").innerHTML = ""
  document.querySelector("#search-results-heading").innerHTML = ""
  document.querySelector("#pagination").innerHTML = ""
  results.forEach((result) => {
    const div = document.createElement("div")
    div.classList.add("card")

    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">     
   ${
     result.poster_path
       ? `<img
         src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
         class="card-img-top"
         alt="${global.search.type === "movie" ? result.title : result.name}"
       />`
       : `<img
         src="../images/no-image.jpg"
         class="card-img-top"
         alt="${global.search.type === "movie" ? result.title : result.name}"
       />`
   }
    </a> 
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>`
    document.querySelector("#search-results-heading").innerHTML = `
    <h3>${results.length} of ${global.search.totalResult} Results for ${global.search.term}</h3>
    `
    document.querySelector("#search-results").appendChild(div)
  })

  displayPagination()
}

//create & display pagination

const displayPagination = () => {
  const div = document.createElement("div")
  div.classList.add("pagination")
  div.innerHTML = `
      <button class="btn btn-primary" id="prev">Prev</button>
      <button class="btn btn-primary" id="next">Next</button>
      <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `
  document.querySelector("#pagination").appendChild(div)

  // disable prev button if on first page

  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true
  }

  //disable next button if one last page

  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true
  }

  //next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++
    const { results, total_pages } = await searchApiData()
    displaySerchResults(results)
  })

  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--
    const { results, total_pages } = await searchApiData()
    displaySerchResults(results)
  })
}

//slider show

// const sliderShow = async () => {
//   const { results } = await fetchApi("movie/now_playing")
//   results.forEach((movie) => {
//     const div = document.createElement("div")
//     div.classList.add("swiper-slide")

//     div.innerHTML = `
//             <a href="movie-details.html?id=${movie.id}">
//               <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
//             </a>
//             <h4 class="swiper-rating">
//               <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
//             </h4>
//          `
//     document.querySelector(".swiper-wrapper").appendChild(div)

//     initSwiper()
//   })
// }
// // init swiper
// function initSwiper() {
//   const swiper = new Swiper(".swiper", {
//     slidesPreView: 1,
//     spaceBetween: 30,
//     freeMode: true,
//     autoPlay: {
//       delay: 4000,
//       disableOnInteraction: false,
//     },
//     breakpoints: {
//       500: { slidesPreView: 2 },
//       700: {
//         slidesPreView: 3,
//       },
//       1200: { slidesPreView: 4 },
//     },
//   })
// }

//display movie detail

const displayMovieDetail = async () => {
  const movieId = window.location.search.split("=")[1]
  const movie = await fetchApi(`movie/${movieId}`)

  //display background image
  displayBackgroundImage("movie", movie.backdrop_path)

  const div = document.createElement("div")

  div.innerHTML = ` <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img
         src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
         class="card-img-top"
         alt="${movie.title}"
       />`
                : `<img
         src="../images/no-image.jpg"
         class="card-img-top"
         alt="${movie.title}"
       />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
             ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((gener) => `<li>${gener.name}</li>`).join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $ ${movie.budget.toLocaleString(
              "en-US"
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $ ${movie.revenue.toLocaleString(
              "en-US"
            )} </li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group"> ${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join("")}</div>
        </div>`

  document.querySelector("#movie-details").appendChild(div)
}

//show tv show details

const displayTvShowDetail = async () => {
  const showId = window.location.search.split("=")[1]
  const tvShow = await fetchApi(`tv/${showId}`)

  //display background image
  displayBackgroundImage("show", tvShow.backdrop_path)

  const div = document.createElement("div")

  div.innerHTML = ` <div class="details-top">
          <div>
            ${
              tvShow.poster_path
                ? `<img
         src="https://image.tmdb.org/t/p/w500${tvShow.poster_path}"
         class="card-img-top"
         alt="${tvShow.name}"
       />`
                : `<img
         src="../images/no-image.jpg"
         class="card-img-top"
         alt="${tvShow.name}"
       />`
            }
          </div>
          <div>
            <h2>${tvShow.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${tvShow.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${tvShow.release_date}</p>
            <p>
             ${tvShow.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${tvShow.genres.map((gener) => `<li>${gener.name}</li>`).join("")}
            </ul>
            <a href="${
              tvShow.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episod: </span>${
              tvShow.number_of_episodes
            } </li>
            <li><span class="text-secondary">Last Episode To Air: </span>${
              tvShow.last_episode_to_air.name
            } </li>
            <li><span class="text-secondary">Status:</span> ${
              tvShow.status
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group"> ${tvShow.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join("")}</div>
        </div>`

  document.querySelector("#show-details").appendChild(div)
}

const displayBackgroundImage = (type, backdrop_path) => {
  const overlayDiv = document.createElement("div")
  overlayDiv.style.backgroundImage = `URL(
    https://image.tmdb.org/t/p/original/${backdrop_path}
  )`
  overlayDiv.classList.add("bg-drops")

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv)
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv)
  }
}

//fetch to DB
const fetchApi = async (endpoint) => {
  const API_KEY = global.api.API_KEY
  const URL = global.api.URL
  showSpinner()
  const response = await fetch(
    `${URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )

  const data = response.json()
  hideSpinner()
  return data
}

//make request to search
const searchApiData = async (endpoint) => {
  const API_KEY = global.api.API_KEY
  const URL = global.api.URL
  showSpinner()
  const response = await fetch(
    `${URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  )

  const data = await response.json()
  hideSpinner()
  return data
}

//Highlight active link
const highlightActiveLink = () => {
  const link = document.querySelectorAll(".nav-link")
  link.forEach((link) => {
    if (link.getAttribute("href") === global.currnetPage) {
      link.classList.add("active")
    }
  })
}

// show alert

const showAlert = (message, className = "error") => {
  const alertEL = document.createElement("div")
  alertEL.classList.add("alert", className)
  alertEL.appendChild(document.createTextNode(message))
  document.querySelector("#alert").appendChild(alertEL)

  setTimeout(() => alertEL.remove(), 3000)
}

// init app
const init = () => {
  switch (global.currnetPage) {
    case "/":
    case "/index.html":
      // sliderShow()
      displayPopularMovies()
      break
    case "/movie-details.html":
      displayMovieDetail()
      break
    case "/shows.html":
      displayTvShow()
      break
    case "/tv-details.html":
      displayTvShowDetail()
      break
    case "/search.html":
      search()
      break
  }

  highlightActiveLink()
}

document.addEventListener("DOMContentLoaded", init)
