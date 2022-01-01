import renderLogin from "./pages/login/login.js";
import renderSignup from "./pages/signup/signup.js";
import renderScreening from "./pages/screening/screening.js";
import renderBookTickets from "./pages/book-tickets/book-tickets.js";
import renderMyBookings from '../../pages/my-bookings/my-bookings.js';
import renderHeader from '../../header.js';


export default function () {
  window.router = new Navigo("/", { hash: true });

  router
    .on({
      "/": () => {
        // call updatePageLinks to let navigo handle the links
        // when new links have been inserted into the dom
        renderScreening().then(router.updatePageLinks);
      },
      bookings: () => {
        renderMyBookings().then(router.updatePageLinks);
      },
      '/book-tickets/:id': ({ data }) => {
        renderBookTickets(data.id).then(router.updatePageLinks);
      },
      screening: () => {
        renderScreening().then(router.updatePageLinks);
      },
      login: () => {
        renderLogin().then(router.updatePageLinks);
      },
      signup: () => {
        renderSignup().then(router.updatePageLinks);
      },
    
    })
    .on({
      '*': async () => {
        renderHeader();
      },
    })
    
    .resolve();
}
