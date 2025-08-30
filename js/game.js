// Get selected game from query string
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("game");

// Map of game IDs to display names
const gameNames = {
  "ssf2t": "Super Street Fighter II Turbo"
};

document.getElementById("game-title").innerText = gameNames[gameId] || "Unknown Game";

// Example characters for SSF2T
const characters = ["ryu", "ken"]; // Expand later

function goHome() {
  window.location.href = "index.html";
}

function loadCharacterList() {
  const container = document.getElementById("character-select");
  characters.forEach(char => {
    const btn = document.createElement("button");
    btn.innerText = char.toUpperCase();
    btn.onclick = () => loadCharacter(char);
    container.appendChild(btn);
  });
}

async function loadCharacter(character) {
  const response = await fetch(`data/${gameId}/${character}.json`);
  const data = await response.json();

  const container = document.getElementById("character-info");
  container.innerHTML = `
    <h2>${data.name}</h2>
    <img src="${data.portrait}" alt="${data.name}" width="150">
    <div id="moves"></div>
  `;

  const movesDiv = document.getElementById("moves");
  data.moves.forEach(move => {
    const moveEl = document.createElement("div");
    moveEl.className = "move";

    // Replace text inputs with icons if available
    const inputHTML = move.input.map(icon => {
      return `<img src="assets/icons/${icon}.png" alt="${icon}" class="input-icon">`;
    }).join(" ");

    moveEl.innerHTML = `<strong>${move.name}</strong> — ${inputHTML}`;
    movesDiv.appendChild(moveEl);
  });
}

loadCharacterList();
