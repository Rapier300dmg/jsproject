const pokedex = document.getElementById('pokedex');
let pokemonData = [];

 const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
         promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
         pokemonData = results.map((result) => ({ 
            name: result.name,
            image: result.sprites.front_default,
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id
        }));            
        displayPokemon(pokemonData);
    });
};

const  displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map(
             (pokemon) => `
         <li class="card">
            <img class="card-image" src="${pokemon.image}"/>
            <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
            <p class="card-subtitle">Type: ${pokemon.type}</p>
            <p class="card-price">Price: $${pokemon.price}</p>
            <button class="addToCartButton" data-name="${pokemon.name}" data-price="${pokemon.price}">Добавить в корзину</button>
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;

    const addToCartButtons = document.querySelectorAll('.addToCartButton');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            addToCart(name, price);
        });
    });
};

const displayCartItems = () => {
    const cartItems = document.getElementById('cartItems');
    const cart = document.getElementById('cart');

    cartItems.innerHTML = '';

    Array.from(cart.children).forEach((cartElement) => {
        const clonedCartElement = cartElement.cloneNode(true);
        clonedCartElement.querySelector('.addToCartButton').remove();
        cartItems.appendChild(clonedCartElement);
    });
};

const addToCart = (name, price, imageSrc) => {
    const cart = document.getElementById('cart');
    const cartItem = document.createElement('div');
    cartItem.innerHTML = `
        <p>${name}: $${price}</p>
    `;
    cart.appendChild(cartItem);
     const cartLink = document.getElementById('cartLink');
     const cartImage = document.getElementById('cartImage');
      cartLink.href = "pocebox.html"; 
    cartImage.src = imageSrc; 
};
 
const removeFromCart = (cartItem) => {
    cartItem.remove();
    displayCartItems();
};

const displayPriceTags = (pokemon) => {
    pokemon.forEach(pokemon => {
        const priceTags = document.getElementById(`priceTags_${pokemon.id}`);
         const priceTag = document.createElement('div');
        priceTag.innerHTML = `<p>${pokemon.name}: $${pokemon.price}</p>`;
         priceTags.appendChild(priceTag);
     });
};

const searchPokemon = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const foundPokemon = pokemonData.find(pokemon => pokemon.name === searchTerm); 
     if (foundPokemon) {
        displayPokemon([foundPokemon]);
    } else {
        pokedex.innerHTML = "<p>Покемон с таким именем не найден.</p>";
    }
};

const  searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchPokemon);

 const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', function(event) {
    if  (event.key === 'Enter') {
        searchPokemon();
    }
});


fetchPokemon();



