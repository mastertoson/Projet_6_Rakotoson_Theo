const apiUrl = "http://localhost:5678/api/works"

fetch("http://localhost:5678/api/works")
.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    console.log(value);
    
  })
  .catch(function(err) {
    // Une erreur est survenue
    console.log(err);
  });






