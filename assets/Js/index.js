//appel de l'api
const worksUrl = "http://localhost:5678/api/works";
const categorieUrl = "http://localhost:5678/api/categories";

//appel du dom
const gallery = document.querySelector(".gallery");
let categories_container = document.querySelector(".categories_container");
let buttonAll = document.querySelector('.all');
const modaleImgContainer = document.querySelector('.modal_img_container');
const dragContainer = document.querySelector('.drag_container');
const imgPreview = document.getElementById('img_preview');
const titleInput = document.getElementById('title');
const categorySelect = document.querySelector('.modale_form_select');
const validateButton = document.querySelector('.modal_button_validate');
const modalDragIcon = document.querySelector('.modale_drag_icon');
const modalDragText = document.querySelector('.modal_drag_text');
const sendButton = document.querySelector('.modal_send_button');
const modalCat = document.querySelector('.modale_form_select');
const modalTitle = document.querySelector('.modale_form_title');
const modalDeleteContainer = document.querySelector('.modale-delete-container');
const modaleAddContainer = document.querySelector('.modale-add-container');
const returnModal = document.querySelector('.return_modal');
const modalButton = document.querySelector('.modal_button');
const modalWrapper = document.querySelector('.modale-wrapper');
let loginButton = document.querySelector('.login_container');
let editionContainer = document.querySelector('.edition_container');
let ProjetContainer = document.querySelector('.projet_container');
let introModify = document.querySelector('.intro_modify');
const modify = `<div class="modify">
<i class="fa-solid fa-pen-to-square modify_icon"></i>
<a class="modify_text open_modale" href="#modale">modifier</a>
</div>`;


// initiation de l'app
async function init() {

  let allinfo = await fetchWorks();
  displayinfo(allinfo);

  let allCategory = await fetchCategory();
  displayCategory(allCategory);

  filtreCat();
  catmodal(allCategory);
  modalAddButton();
  modalReturnDefaultState();

}

init();

//localstorage

const logInStorage = localStorage.getItem('log')?.toString();
let logIn = ["LocalStorage vide"];
if (logInStorage) {
  logIn = JSON.parse(logInStorage);
};
//vérification du contenu du localstorage
if (logIn == "LocalStorage vide") {
  loginButton.innerHTML = `<a href="login.html" class="login_button">login</a>`;
} else {
  loginButton.innerHTML = `<a href="#" class="login_button logout">logout</a>`;
  editionContainer.classList.add(`display_on`);
  categories_container.classList.add(`display_off`);
  introModify.classList.add(`display_on`);
  ProjetContainer.classList.add(`padding_bottom`);
  ProjetContainer.insertAdjacentHTML("beforeend", `${modify}`)

};
//bouton deconnexion (vide le localstorage)
let logoutButton = document.querySelector('.logout');
logoutButton?.addEventListener('click', async (e) => {
  localStorage.clear();
  location.reload();
});

//recuperation de l'api worksUrl
function fetchWorks() {
  return fetch(worksUrl)
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      console.log(error)
    })
};

//récupération de l'api categorieUrl
function fetchCategory() {
  return fetch(categorieUrl)
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.log(error)
    })
}

//affichage des fifférentes cards 
function displayinfo(allinfo) {
  gallery.innerHTML = "";
  modaleImgContainer.innerHTML = "";
  let first = true;
  for (const info of allinfo) {
    //cards de la gallerie
    gallery.insertAdjacentHTML("beforeend", `
        <figure>
				  <img src="${info.imageUrl}" alt="${info.title}">
				  <p>${info.title}</p>
			  </figure>
        `
    )
    //cards de la modale
    modaleImgContainer.insertAdjacentHTML("beforeend", `
    <div class="card_container" data-id="${info.id}">
          <div class="icon_container">
           ${first && `<i class="fa-solid fa-arrows-up-down-left-right icon"></i>`}
					 <i class="fa-regular fa-trash-can icon delete"></i>
          </div>
          <img class="modal_img" src="${info.imageUrl}" alt="${info.title}">
					<P class="modal_edit_button">éditer</P>
				</div>`)
    first = "";
  };
}
//affichage des catégories
function displayCategory(allinfo) {
  for (const info of allinfo) {
    categories_container.insertAdjacentHTML("beforeend",
      `<button class="projet_button " id="${info.id}" >${info.name}</button>`
    );
  };
};

//filtrage des cards en fonction de la catégorie 
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

//modale//

let modal = null
//ouverture de la modale
const openModal = function (e) {
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
//fermeture de la modale
const closeModal = function (e) {
  if (modal == null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.close_modal').removeEventListener('click', closeModal)
  modal.querySelector('.modale-wrapper').removeEventListener('click', stopPropagation)
  modal = null
}
//lecture des bouton qui ouvrent la modale
document.querySelectorAll('.open_modale').forEach(a => {
  a.addEventListener('click', openModal)
})
//fonction pour eviter les interaction hors de la modale lorsqu'elle est ouverte
const stopPropagation = function (e) {
  e.stopPropagation()
}

//supression des projets 
modaleImgContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete')) {
    event.preventDefault();

    const elementToDelete = event.target.closest('.card_container');
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
        .then(async (response) => {
          if (response.ok) {
            elementToDelete.remove();
            let allinfo = await fetchWorks();
            displayinfo(allinfo);

          } else {
            console.error('Erreur lors de la suppression.');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  } else {
    console.log("erreur");
  }
});

//passage au menu d'ajout de projets
function modalAddButton() {
  modalButton.addEventListener("click", async (e) => {
    modalDeleteContainer.classList.add(`display_off`);
    modaleAddContainer.classList.remove(`display_off`);
    returnModal.classList.remove(`hidden`);
    modalWrapper.classList.replace(`modale-wrapper-default-height`, `modale-wrapper-form-height`);
  });
};

//passage au menu de supression de projets (par defaut)
function modalReturnDefaultState() {
  returnModal.addEventListener("click", async (e) => {
    modalDeleteContainer.classList.remove(`display_off`);
    modaleAddContainer.classList.add(`display_off`);
    returnModal.classList.add(`hidden`);
    modalWrapper.classList.replace(`modale-wrapper-form-height`, `modale-wrapper-default-height`);
  });
}

//affichage des catégories de façon dynamique dans le menu d'ajout de projets
function catmodal(allinfo) {
  for (const info of allinfo) {
    categorySelect.insertAdjacentHTML("beforeend",
      `<option value="${info.id}">${info.name}</option>`
    );
  }
}

//vide la zone de preview d'image
let imgPreviewFile = null;

//permet de modifier le comportement par defaut du drag and drop
dragContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
});

//permet le drag and drop de l'image dans la zone selectionné 
dragContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file.type.startsWith('image/')) {
    //permet la prévisualisation de l'image du projet en utilisant l'instance fileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      imgPreview.src = event.target.result;
      imgPreviewFile = file;
      modalDragIcon.classList.add(`display_off`);
      modalDragText.classList.add(`display_off`);
      sendButton.classList.add(`display_off`);
    };
    reader.readAsDataURL(file);
  }
});

//permet l'ajout de l'image en cliquant sur le bouton ajouter photo
sendButton.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  if ('files' in input) {
    input.accept = 'image/*';
    input.click();
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imgPreview.src = e.target.result;
          imgPreviewFile = file;
          modalDragIcon.classList.add(`display_off`);
          modalDragText.classList.add(`display_off`);
          sendButton.classList.add(`display_off`);
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

//execute la fonction d'envoie du projet a l'api
validateButton.addEventListener('click', () => {
  sendImageToAPI();
});

//fonction d'envoie du projet a l'api
function sendImageToAPI() {
  let titleValue = titleInput.value;
  let categorySelectValue = categorySelect.value;
  //vérifie si le contenu est conforme
  if (!imgPreviewFile || !titleValue || !categorySelectValue) {
    alert('Veuillez remplir le titre et choisir une catégorie.');
    return;
  }
  //création de l'objet contenant le projet
  let formData = new FormData();
  formData.append("image", imgPreviewFile);
  formData.append("title", titleValue);
  formData.append("category", categorySelectValue);


  //envoie une requete POST a l'api 
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json",
      "Authorization": 'Bearer ' + logIn.token
    }
  })
    //si la requete est conforme (201) remet les valeurs par defaut du menu d'ajout
    .then(res => {
      if (res.status === 201) {
        init();
        titleInput.value = "";
        imgPreview.src = "#";
        modalDragIcon.classList.remove(`display_off`);
        modalDragText.classList.remove(`display_off`);
        sendButton.classList.remove(`display_off`);
        categorySelect.innerHTML = ""
      }
    })
    .catch(error => {
      console.error(error);
    });
}
//endmodale