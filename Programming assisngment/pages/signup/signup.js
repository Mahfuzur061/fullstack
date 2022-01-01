export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/signup/signup.html")
    .then((response) => response.text())
    .then((signupHtml) => {
      content.innerHTML = signupHtml;

      handleLoginFunctionality();
    });
};

function handleLoginFunctionality() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    // Make sure the form is not submitted
    event.preventDefault();

    fetch(`${window.apiUrl}/api/public/signup`, {
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
        if (response.status == "500") {
          document.getElementById("errorLog").innerHTML =
            "Sorry! Username already exist, try another name.";
        } else {
          document.getElementById("errorLog").innerHTML = "Signing up successful! Please login to buy tickets.";
        }

        return response.json();
      })
      .then((data) => {
        console.log(data)
        
         
          // navigating to the users route. Using the global window.router
          //window.router.navigate("#/login");

          
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
