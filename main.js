
const API_KEY = 'api_key=ad09204f2d8d460e9b78fc22b88a4dfd';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const endPoint = 'https://api.themoviedb.org/3/discover/movie?language=pt-BR&api_key=ad09204f2d8d460e9b78fc22b88a4dfd';


const genres = [
    {
      "id": 28,
      "name": "Ação"
    },
    {
      "id": 16,
      "name": "Animação"
    },
    {
      "id": 35,
      "name": "Comédia"
    },
    {
      "id": 99,
      "name": "Documentário"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Ficcção Ciêntífica"
    },
    {
      "id": 53,
      "name": "Suspense"
    }
  ]

const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Limpar x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
  const languageParam = 'language=pt-BR';
  if (!url.includes(languageParam)) {
    url += '&' + languageParam;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add('disabled');
          next.classList.remove('disabled');
        } else if (currentPage >= totalPages) {
          prev.classList.remove('disabled');
          next.classList.add('disabled');
        } else {
          prev.classList.remove('disabled');
          next.classList.remove('disabled');
        }

        tagsEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        main.innerHTML = `<h1 class="no-results">Nenhum resultado encontrado</h1>`;
      }
    });
}



function showMovies(data) {
  main.innerHTML = '';

  data.forEach(movie => {
      const { title, poster_path, overview, id } = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
          <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
          
          <div class="overview">
              <h3>Visão Geral</h3>
              ${overview}
          </div>
      `;

      main.appendChild(movieEl);
  });
}



prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}