////////////////////////////////////
// Selectionneles éléments du DOM //
////////////////////////////////////

const form = document.querySelector('form');
const input = document.querySelector('input');
const errorMessage = document.querySelector('.wiki-error');
const loader = document.querySelector('.wiki-loader');
const resultsDisplay = document.querySelector('.wiki-results');

//////////////////////////////////////////////////////
// Ajoute un écouteur d'événement sur le formulaire //
//////////////////////////////////////////////////////

form.addEventListener('submit', handleSubmit);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonction qui gère la soumission du formulaire                                                        //
// Empêche le comportement par défaut du formulaire                                                     //
// Affiche errorMessage seulement si le champ de recherche est vide lors de la soumission du formulaire //
// Sinon, affiche le loader, efface le message d'erreur et appelle la fonction wikiApiCall              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleSubmit(event) {
  event.preventDefault();
  if (!input.value) {
    errorMessage.textContent = `Whoops ! Tu as oublié d'ajouter un terme de recherche 😅`;
    return;
  } else {
    errorMessage.textContent = '';
    loader.style.display = 'flex';
    resultsDisplay.textContent = '';
    wikiApiCall(input.value);
  }
}

//////////////////////////////////////////////////////////////////////////////////
// Fonction qui appelle l'API Wikipedia de manière asynchrone                   //
// Gère les erreurs de l'API                                                    //
// Appelle l'API Wikipedia avec le terme de recherche entré par l'utilisateur   //
// Si la réponse n'est pas ok, affiche un message d'erreur                      //
// Sinon, récupère les données de la réponse et appelle la fonction createCards //
//////////////////////////////////////////////////////////////////////////////////

async function wikiApiCall(searchInput) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    } else {
      const data = await response.json();
      createCards(data.query.search);
    }
  } catch (error) {
    errorMessage.textContent = `${error}`;
    loader.style.display = 'none';
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Fonction qui crée les cartes de résultats                                 //
  // Si data est vide, affiche un message d'erreur                             //
  // Sinon, pour chaque élément de data, crée une carte de résultat            //
  // Crée un lien vers la page Wikipedia de l'élément                          //
  // Sélectionne l'élément du DOM où les résultats seront affichés             //
  // Crée une div pour chaque carte de résultat                                //
  // Ajoute des classes et du contenu à la carte avec les données de l'élément //
  // Ajoute la carte à l'élément du DOM où les résultats seront affichés       //
  ///////////////////////////////////////////////////////////////////////////////

  function createCards(data) {
    if (!data.length) {
      errorMessage.textContent = `Whoopsy ! Aucun résultat trouvé pour ${input.value} 😅`;
      loader.style.display = 'none';
      return;
    } else {
      data.forEach((element) => {
        const url = `https://en.wikipedia.org/wiki/${element.title}`;
        const resultsDisplay = document.querySelector('.wiki-results');
        const card = document.createElement('div');

        card.className = 'wiki-results';
        card.innerHTML = `
          <h2 class='wiki-results__title'>
          <a href=${url} target='_blank' rel='noopener noreferrer'>${element.title}</a>
          </h2>
          <a href=${url} class='wiki-results__link' target='_blank' rel='noopener noreferrer'>${url}</a>
          <span class='wiki-results__snippet'>${element.snippet}</span>
          <br/>
        `;
        resultsDisplay.appendChild(card);
      });
    }
  }

  //////////////////////////////////////////////////////////////
  // Cache le loader une fois que les résultats sont affichés //
  //////////////////////////////////////////////////////////////

  loader.style.display = 'none';
}
