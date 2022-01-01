export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/screening/screening.html')
    .then((Response) => Response.text())
    .then((screeningHtml) => {
      content.innerHTML = screeningHtml;
      displayScreenings();
    });
};

function displayScreenings() {
  const d = new Date();
  let date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  let month = d.getMonth < 10 ? `0${d.getMonth()}` : d.getMonth();
  const today = `${date}-${d.getMonth() + 1}-${d.getFullYear()}`;

  d.setDate(d.getDate() + 7);
  date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  month = d.getMonth < 10 ? `0${d.getMonth()}` : d.getMonth();
  const weekFromToday = `${date}-${d.getMonth() + 1}-${d.getFullYear()}`;
  console.log(today + ' ' + weekFromToday);

  for(let i=1; i<=2; i++){
    const apiUrl = `${window.apiUrl}/api/public/screenings/${i}/${today}/${weekFromToday}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((screeningData) => {
        //testing what movieData returns
        console.log(screeningData);
        screeningData.forEach((screening) => {
          console.log(screening);
          //testing what movie returns
          const movieContainer = document.createElement('div');
          movieContainer.classList.add('movieContainer');
  
          const movieTitle = document.createElement('h1');
          const movieInfo = document.createElement('h2');
          const movieImage = document.createElement('img');
          movieImage.setAttribute('alt', 'movie poster');
  
          const movieTickets = document.createElement('button');
          movieTickets.classList.add('btn-grad')
          movieTickets.addEventListener('click', () => {
            console.log(screening.movie.trailerUrl);
            window.router.navigate(`/book-tickets/${screening.id}`);
          });
  
          movieTickets.innerHTML = 'Buy Ticket';
  
          movieImage.src = screening.movie.posterUrl;
          movieTitle.innerHTML = screening.movie.title; 
          movieInfo.innerHTML = "Theater: </t>"+screening.theater.name + 
                                "<br>Category: </t>"+screening.movie.info + 
                                "<br>Time: </t>"+screening.startTime.replace('T'," at ") + 
                                "<br>Rating: </t>"+screening.movie.rating 
          ;
  
          movieContainer.appendChild(movieImage);
          movieContainer.appendChild(movieTitle);
          movieContainer.appendChild(movieInfo);
          movieContainer.appendChild(movieTickets);
  
          document.querySelector('.screenings').appendChild(movieContainer);
        });
      });
  }
  
}
