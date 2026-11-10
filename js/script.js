let form = document.querySelector("#search-form");
let searchInput = document.querySelector("#pokemon-search");
let randomButton = document.querySelector("#random-button");
let hintButtons = document.querySelectorAll(".text-button");
let statusMessage = document.querySelector("#status-message");
let card = document.querySelector("#pokemon-card");


async function getPokemon(search) {
  // show a loading message while we wait for the API to respond
  statusMessage.textContent = "Loading...";

  try {
    //requesting data from the API
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + search);

  
//check if the server gave a successful response
    if (!response.ok) {
      throw new Error("Request failed");
    }

// convert the response into json
    const data = await response.json();
    console.log(data);

//use the data
    showPokemon(data);
    statusMessage.textContent = "";

  } catch (error) {
    console.error("Error:", error);
    card.style.display = "none";
    statusMessage.textContent = "Couldn't find that Pokémon. Check the spelling or try a number from 1 to 1025.";
  }
}

function showPokemon(data) {
  let name = data.name;
  let id = data.id;
  let image = data.sprites.other["official-artwork"].front_default;


  document.querySelector("#pokemon-name").textContent = name;
  document.querySelector("#pokemon-number").textContent = "#" + String(id).padStart(4, "0");
  document.querySelector("#pokemon-image").src = image;
  document.querySelector("#pokemon-image").alt = name;

  // height is in decimetres and weight is in hectograms, so convert them
  document.querySelector("#pokemon-height").textContent = data.height / 10 + " m";
  document.querySelector("#pokemon-weight").textContent = data.weight / 10 + " kg";


  let typeBox = document.querySelector("#pokemon-types");
  typeBox.innerHTML = "";
  data.types.forEach(function (item) {
    typeBox.innerHTML += `<span class="type-tag">${item.type.name}</span>`;
  });

  
  // abilities
  let abilityNames = data.abilities.map(function (item) {
    return item.ability.name.replace("-", " ");
  });
  document.querySelector("#pokemon-abilities").textContent = abilityNames.join(", ");

 
  // stats as bars, bar width is controlled by the value
  let statsList = document.querySelector("#stats-list");
  statsList.innerHTML = "";
  let attack = 0;

  data.stats.forEach(function (item) {
    let statName = item.stat.name.replace("-", " ");
    let value = item.base_stat;

    if (item.stat.name === "attack") {
      attack = value;
    }


    let width = Math.min(value / 150 * 100, 100);

// conditional logic
    let level = "";
    if (value < 50) {
      level = "low";
    } else if (value < 90) {
      level = "medium";
    } else {
      level = "high";
    }

    statsList.innerHTML += `
      <div class="stat-row">
        <span class="stat-name">${statName}</span>
        <span class="stat-value">${value}</span>
        <div class="stat-track">
          <div class="stat-bar ${level}" style="width: ${width}%"></div>
        </div>
      </div>
    `;
  });

// dynamic interface change: card colour depends on the pokemon type
  let mainType = data.types[0].type.name;
  card.className = "pokemon-card " + mainType;
  card.style.display = "grid";


  // message changes depending on the attack stat
  let note = document.querySelector("#attack-note");
  if (attack < 60) {
    note.textContent = "Attack " + attack + ": more of a gentle Pokémon than a fighter.";
  } else if (attack < 100) {
    note.textContent = "Attack " + attack + ": a solid, reliable attacker.";
  } else {
    note.textContent = "Attack " + attack + ": hits really hard!";
  }
}

// search form
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let search = searchInput.value.toLowerCase().trim();

  if (search === "") {
    statusMessage.textContent = "Type a name or number first.";
    return;
  }
  getPokemon(search);
});

//  buttons (Pikachu, Charizard, Eevee)
hintButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    let name = button.dataset.pokemon;
    searchInput.value = name;
    getPokemon(name);
  });
});

// surprise me button
randomButton.addEventListener("click", function () {
  let randomId = Math.floor(Math.random() * 1025) + 1;
  searchInput.value = "";
  getPokemon(randomId);
});

// show something when the page first loads
getPokemon("pikachu");