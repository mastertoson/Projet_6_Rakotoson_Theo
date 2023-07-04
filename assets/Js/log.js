//appel de l'api
const log = "http://localhost:5678/api/users/login";

let submit = document.getElementById("submit")
//mise en place des regex de connexion 
const regexMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;

submit.addEventListener("click", (event) => {
    // préparation les infos pour l'envoie en POST
    let contact = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };
    // validation que le formulaire soit correctement rempli
    if (
      (regexMail.test(contact.email) == true) &
      (regexPassword.test(contact.password) == true)
    ) {
      event.preventDefault();
      // envoie en POST
      fetch(log, {
        method: "POST",
        headers: {
            "Accept": "application/json", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify( contact ),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          
          localStorage.setItem('log', JSON.stringify(data));
          window.location.href = "index.html"
        })
        .catch((erreur) => alert(erreur));
    } else {
      alert(
        "Veuillez correctement renseigner l'entièreté du formulaire pour valider votre connexion."
      );
    }
  });





