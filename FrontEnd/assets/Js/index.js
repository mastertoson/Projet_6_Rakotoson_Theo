const worksUrl = "http://localhost:5678/api/works";
const categorieUrl = "http://localhost:5678/api/categories";


const gallery = document.querySelector(".gallery")
const categories_container = document.querySelector(".categories_container")



fetch(worksUrl)
  .then(response => response.json())
  .then(data => {
    // Le tableau de données se trouve dans la variable 'data'
    console.table(data);
    // Vous pouvez accéder aux éléments du tableau comme ceci :
    data.forEach(element => {
      // console.log(element.title);
      // console.log(element.imageUrl);

      image_card(element);

      function image_card(element){
        gallery.innerHTML += `
        <figure>
				  <img src="${element.imageUrl}" alt="${element.title}">
				  <figcaption>${element.title}</figcaption>
			  </figure>
        `
      };
    });

  })
  .catch(error => {
    console.log("erreur");
  });

 fetch(categorieUrl)
  .then(res => res.json())
  .then(data =>{

    // console.log(data);

    data.forEach(element => {
      // console.log(element.name);
      // console.log(element.id);

      categorie(element);

      function categorie(element){
        categories_container.innerHTML += `
        <button class="projet_button" id="${element.id}">${element.name}</button>
        `      
      };
    });
  });

let button = document.querySelector(".projet_button")

  
function activeCategorie(){
  
};
 