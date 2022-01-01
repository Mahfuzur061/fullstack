export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/login/login.html")
    .then((response) => response.text())
    .then((loginHtml) => {
      content.innerHTML = loginHtml;

      handleLoginFunctionality();
    });
};

function handleLoginFunctionality() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    // Make sure the form is not submitted
    event.preventDefault();

    fetch(`${window.apiUrl}/api/public/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.querySelector("input.username").value,
        password: document.querySelector("input.password").value,
      }),
    })
      .then((response) => {
        
        if (response.status == "401") {
          document.getElementById("errorLog").innerHTML =
            "Sorry! Username doesn't exist Please SignUp first!.";
        } else {
          document.getElementById("errorLog").innerHTML = "";
          return response.json();
        }

        
        

      })

      .then((data) => {
        console.log(data);
        if (data.accessToken) {
          // Saving the JWT to local storage
          localStorage.setItem("user", JSON.stringify(data));
          // navigating to the users route. Using the global window.router
          window.router.navigate('/screening');
          //window.history.go(-1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
