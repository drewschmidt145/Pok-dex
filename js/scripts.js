
let pokemonRepository = (function () {
    const pokemonArray = [];
    
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
  
    function add(pokemon) {
      pokemonArray.push(pokemon);
    }
  
    function getAll() {
      return pokemonArray;
    }
    
    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list'); // this selects the <ul> within HTML
        let listItem = document.createElement('li'); // these 2 add elements to be added within the <ul>
        let pokemonButton = document.createElement('button');

        
        $(pokemonButton).addClass('button btn btn-primary').attr('type', 'button')
          .attr('data-toggle', 'modal').attr('data-target', '.modal-container');

        $(listItem).addClass('listItem list-group-item')


        pokemonButton.innerText = pokemon.name; // what is written inside the button

        listItem.appendChild(pokemonButton); // these two append to each other in HTML
        pokemonList.appendChild(listItem);

        pokemonButton.addEventListener('click', function(event) { // this is an event when click on specific pokemon button
            showDetails(pokemon);
        });

        
    }

    function showDetails(pokemon) {
      loadDetails(pokemon).then(function () {
        showModal(pokemon)
      });
    }

    // Modal Section

    function showModal(pokemon) {
      let modalContainer = document.querySelector('#modal-container'); 

      modalContainer.innerHTML = ''; // clears all existing modal content

      let modal = document.createElement('div');
      modal.classList.add('modal-page');

      // this is for the close button on top right of modal
      let closeButtonElement = document.createElement('button');
      $(closeButtonElement).addClass('modal-close close').attr('data-dismiss', 'modal')
      .attr('aria-label', 'close').attr('type', 'button');

      closeButtonElement.innerText = 'Close';
      closeButtonElement.addEventListener('click', hideModal);

      let titleElement = document.createElement('h1');
      titleElement.innerText = pokemon.name;
      titleElement.classList.add('capitalize');

      let contentElement = document.createElement('p');
      contentElement.innerText = 'Height: ' + pokemon.height + ' m';

      let imageElement = document.createElement('img');
      imageElement.src = pokemon.imageUrl;

      modal.appendChild(closeButtonElement);
      modal.appendChild(titleElement);
      modal.appendChild(contentElement);
      modal.appendChild(imageElement);
      modalContainer.appendChild(modal);

      modalContainer.classList.add('is-visible');

      modalContainer.addEventListener('click', (e) => {
        // Since this is also triggered when clicking INSIDE the modal
        // We only want to close if the user clicks directly on the overlay
        let target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => { // this is for using escape to exit Modal
      let modalContainer = document.querySelector('#modal-container');
      if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
    });

    function hideModal() {
      let modalContainer = document.querySelector('#modal-container');
      modalContainer.classList.remove('is-visible');
    }



    function loadList() {
        return fetch(apiUrl).then(function (response) {
          return response.json();
        }).then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        }).catch(function (e) {
          console.error(e);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (e) {
            console.error(e)
        });
    }

    return { // these are the functions that are returned and automaticatally activated because inside IIFE
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      hideModal: hideModal,
      showModal: showModal,

    };
})();


pokemonRepository.loadList().then(function () {

    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });

});

