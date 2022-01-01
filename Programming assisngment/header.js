// Written by Lars and Periklis

export default () => {
  updateHeader();
};

function updateHeader() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  if (user == null || user.accessToken == null) showLogin();
  else showLogout();

  // if (user!=null && user.username == "repon") {
  //   if (document.getElementById("adminButton") == null) {
  //     const navOptions = document.querySelector(".topnav");
  //     const a = document.createElement("a");
  //     a.innerHTML = "Admin";
  //     a.setAttribute("href", "/admin");
  //     a.setAttribute("id", "adminButton");
  //     navOptions.appendChild(a);
  //   }
  // } else {
  //   if (document.getElementById("adminButton") != null) {
  //     const navOptions = document.querySelector(".topnav");
  //     navOptions.removeChild(document.getElementById("adminButton"));
  //   }
  // }
}

function showLogin() {
  const loginButton = document.getElementById("loginButton");
  loginButton.innerHTML = "Login";
}

function showLogout() {
  const loginButton = document.getElementById("loginButton");
  loginButton.innerHTML = "Logout";

  loginButton.addEventListener("click", () => {
    localStorage.setItem("user", null);
    window.location.reload();
  });
}
