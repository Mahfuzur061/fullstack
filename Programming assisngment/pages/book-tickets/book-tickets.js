export default (id) => {
  const content = document.querySelector(".content");

  return fetch("./pages/book-tickets/book-tickets.html")
    .then((response) => response.text())
    .then((bookTicketHtml) => {
      content.innerHTML = bookTicketHtml;
      createBookingPage(id);
    });
};

async function createBookingPage(id) {
  displayMovieInfo(id);
}

function displayMovieInfo(id) {
  fetch(`${window.apiUrl}/api/public/screenings/${id}`)
    .then((Response) => Response.json())
    .then((movieScreening) => {
      console.log(movieScreening);
      const title = document.querySelector("h1");
      const img = document.querySelector(".movie-poster");
      img.setAttribute("alt", "movie poster");
      title.innerHTML = movieScreening.movie.title;
      img.setAttribute("src", movieScreening.movie.posterUrl);

      displaySeats(movieScreening.id);
    });
}

async function displaySeats(screeningId) {
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  if (user == null || user.accessToken == null) {
    askForLoginOrSignUp();
    return;
  }

  // Fetch seats information of corresponding screening 
  return fetch(`${window.apiUrl}/api/public/seats/${screeningId}`)
    .then((Response) => Response.json())
    .then((seatData) => {
      seatData;

      //console.log(seatData);
      organizeAndDisplaySeats(seatData, screeningId);
    });
}


function askForLoginOrSignUp() {
  const bookingTools = document.querySelector(".booking-tools");
  const notAuthenticatedMsg = document.createElement("p");
  notAuthenticatedMsg.setAttribute("class", "inputFields");
  notAuthenticatedMsg.innerHTML =
    'Please <a class="inputFields" href="/#/signup">signup</a> or <a class="inputFields" href="/#/login">login</a> to book tickets';
  bookingTools.appendChild(notAuthenticatedMsg);
}

function organizeAndDisplaySeats(seatingData, screeningId) {
  const bookingTools = document.querySelector(".booking-tools");
  const seatContainer = document.createElement("div");
  const selectedSeats = new Set();

  const lastSeat = seatingData[seatingData.length - 1];
  for (let row = 1; row <= lastSeat.row; row++) {
    const rowDiv = document.createElement("div");
    const seatsInRow = seatingData.filter((seat) => seat.row == row);
    const lastSeatInRow = seatsInRow[seatsInRow.length - 1];

    for (let seatNo = 1; seatNo <= lastSeatInRow.seatNo; seatNo++) {
      const seat = seatsInRow[seatNo - 1];

      const seatDiv = document.createElement("div");
      if (seat.status == "FREE") {
        seatDiv.setAttribute("class", "seat available");
        addSeatEventlistener(selectedSeats, seat, seatDiv);
      } else seatDiv.setAttribute("class", "seat unavailable");

      if (seatNo == 3 || seatNo == 7) {
        seatDiv.setAttribute("style", "margin: 5px 30px 5px 10px;");
      }
      rowDiv.appendChild(seatDiv);
    }
    if (row == 2) {
      rowDiv.setAttribute("style", "margin: 0px 0px 20px 0px;");
    }
    seatContainer.appendChild(rowDiv);
  }

  bookingTools.appendChild(seatContainer);

  //create Book Seats Button
  const buttonContainer = document.querySelector(".book-seats-container");
  const confirmBookButton = document.createElement("button");
  confirmBookButton.classList.add("btn-grad");
  confirmBookButton.innerHTML = "Book Seats";
  confirmBookButton.addEventListener("click", () => {
    sendBookingRequest(selectedSeats, screeningId);
  });

  buttonContainer.appendChild(confirmBookButton);

}

function addSeatEventlistener(selectedSeats, seat, seatDiv) {
  seatDiv.addEventListener("click", () => {
    if (selectedSeats.has(seat)) {
      selectedSeats.delete(seat);
      seatDiv.setAttribute("class", "seat available");
    } else {
      selectedSeats.add(seat);
      seatDiv.setAttribute("class", "seat selected");
    }
  });
}


async function sendBookingRequest(seats, screeningId) {
  let seatIds = [];
  seats.forEach((seat) => {
    seatIds.push(seat.id);
  });

  if (seatIds.length == 0) return;

  const user = JSON.parse(localStorage.getItem("user"));

  console.log(screeningId);
  console.log(seatIds);

  await fetch(`${window.apiUrl}/api/user/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + user.accessToken,
    },
    body: JSON.stringify({
      screeningId: screeningId,
      seatIds: seatIds,
    }),
  })
    .then((Response) => Response.json())
    .then((response) => {
      console.log(response);
    });

  window.location.reload();
}
