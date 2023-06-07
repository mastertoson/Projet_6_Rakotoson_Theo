const worksUrl = "http://localhost:5678/api/works";
const categorieUrl = "http://localhost:5678/api/categories";

const gallery = document.querySelector(".gallery")
let categories_container = document.querySelector(".categories_container")
let buttonAll = document.querySelector('.all');
const modaleImgContainer = document.querySelector('.modal_img_container');

async function init() {

  let allinfo = await fetchWorks();
  console.log(allinfo);
  displayinfo(allinfo);
  
  let allCategory = await fetchCategory();
  displayCategory(allCategory);
  filtreCat();

}

init();

//localstorage

const logInStorage = localStorage.getItem('log')?.toString();
let logIn = ["LocalStorage vide"];
if (logInStorage) {
  logIn = JSON.parse(logInStorage);
};


let loginButton = document.querySelector('.login_container');
let editionContainer = document.querySelector('.edition_container')
let ProjetContainer = document.querySelector('.projet_container')
let introModify = document.querySelector('.intro_modify')
const modify = `<div class="modify">
<i class="fa-solid fa-pen-to-square modify_icon"></i>
<a class="modify_text open_modale" href="#modale">modifier</a>
</div>`




if (logIn == "LocalStorage vide") {
  console.log("vide");
  loginButton.innerHTML = `<a href="login.html" class="login_button">login</a>`;


} else {
  loginButton.innerHTML = `<a href="#" class="login_button logout">logout</a>`;
  editionContainer.classList.add(`display_on`);
  categories_container.classList.add(`display_off`);
  introModify.classList.add(`display_on`);
  ProjetContainer.classList.add(`padding_bottom`);
  ProjetContainer.insertAdjacentHTML("beforeend", `${modify}`)
  
};

let logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', async (e) => {
  localStorage.clear();
  location.reload();
});



function fetchWorks() {
  return fetch(worksUrl)
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      console.log(error)
    })
};

function fetchCategory() {
  return fetch(categorieUrl)
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.log(error)
    })
}

function displayinfo(allinfo) {
  gallery.innerHTML = "";
  for (const info of allinfo) {
    
    gallery.insertAdjacentHTML("beforeend", `
        <figure>
				  <img src="${info.imageUrl}" alt="${info.title}">
				  
			  </figure>
        `
    )
    modaleImgContainer.insertAdjacentHTML("beforeend",`
    
    <div class="img_img_container" data-id="${info.id}">
          <div class="icon_container">
           <i class="fa-solid fa-arrows-up-down-left-right icon"></i> 
					 <i class="fa-regular fa-trash-can icon delete"></i>
          </div>
          
          <img class="modal_img" src="${info.imageUrl}" alt="${info.title}">
					<P>éditer</P>
					
				</div>`)
        
        
        
  };
}

function displayCategory(allinfo) {

  for (const info of allinfo) {
    categories_container.insertAdjacentHTML("beforeend",
      `
            <button class="projet_button " id="${info.id}" >${info.name}</button>
            `
    );
  };

};


function filtreCat() {

  buttonAll.addEventListener("click", async (e) => {

    let allinfo = await fetchWorks();

    displayinfo(allinfo);

  });
  let button = document.querySelectorAll(".projet_button");
  for (const cat of button) {
    cat.addEventListener("click", async (e) => {
      let allinfo = await fetchWorks();
      const filtreInfo = allinfo.filter(info => info.categoryId == cat.id);
      displayinfo(filtreInfo);
    })
  };
};

//modale
let modal = null

const openModal = function (e){
  e.preventDefault()

  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = null
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.close_modal').addEventListener('click', closeModal)
  modal.querySelector('.modale-wrapper').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if(modal == null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.close_modal').removeEventListener('click', closeModal)
  modal.querySelector('.modale-wrapper').removeEventListener('click', stopPropagation)
  
  modal = null
}

document.querySelectorAll('.open_modale').forEach(a => {
  a.addEventListener('click', openModal)
  
})

const stopPropagation = function (e){
  e.stopPropagation()
}
//endmodale




modaleImgContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete')) {
    event.preventDefault(); // Empêcher le rechargement de la page

    const elementToDelete = event.target.closest('.img_img_container');
    if (elementToDelete) {
      const infoId = elementToDelete.dataset.id;
      const supprUrl = `http://localhost:5678/api/works/${infoId}`;

      fetch(supprUrl, {
        method: "DELETE",
        headers: {
          "Accept": "*/*",
          "Authorization": 'Bearer ' + logIn.token
        }
      })
      .then(response => {
        if (response.ok) {
          console.log('Supprimé');
          elementToDelete.remove();
        } else {
          console.error('Erreur lors de la suppression.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
      });
    }
  } else {
    console.log("ff");
  }
});








