// Get selected game from URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("game");

// Map game IDs to display names
const gameNames = {
  "ssf2t": "Super Street Fighter II Turbo",
  "sf3": "Street Fighter III: 3rd Strike"
};

document.getElementById("game-title").innerText = gameNames[gameId] || "Unknown Game";

// Example characters
const characters = ["ryu", "ken"];

function goHome() {
  window.location.href = "index.html";
}

// Load character buttons in sidebar
async function loadCharacter(character) {
  const response = await fetch(`data/${gameId}/${character}.json`);
  const data = await response.json();

  const container = document.getElementById("character-info");
  container.innerHTML = `
    <h2>${data.name}</h2>
    <img src="${data.portrait}" alt="${data.name}" width="150">
  `;

  // Group moves by type dynamically
  const moveTypes = {};
  data.moves.forEach(move => {
    if (!moveTypes[move.type]) {
      moveTypes[move.type] = [];
    }
    moveTypes[move.type].push(move);
  });

  // Create sections for each move type
  for (const type in moveTypes) {
    const section = document.createElement("div");
    section.className = "move-section";

    const title = document.createElement("h3");
    title.innerText = type;
    section.appendChild(title);

    moveTypes[type].forEach(move => {
      const moveEl = document.createElement("div");
      moveEl.className = "move";

      const inputHTML = move.input.map(icon => {
        return `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`;
      }).join(" ");

      moveEl.innerHTML = `<strong>${move.name}</strong> — ${inputHTML}`;
      section.appendChild(moveEl);
    });

    container.appendChild(section);
  }
}

// Load character moves into sections
async function loadCharacter(character) {
  const response = await fetch(`data/${gameId}/${character}.json`);
  const data = await response.json();

  const container = document.getElementById("character-info");
  container.innerHTML = `
    <h2>${data.name}</h2>
    <img src="${data.portrait}" alt="${data.name}" width="150">
    <div id="command-normals"><h3>Command Normals</h3></div>
    <div id="special-moves"><h3>Special Moves</h3></div>
    <div id="supers"><h3>Supers</h3></div>
  `;

  data.moves.forEach(move => {
    const moveEl = document.createElement("div");
    moveEl.className = "move";

    const inputHTML = move.input.map(icon => {
      return `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`;
    }).join(" ");

    moveEl.innerHTML = `<strong>${move.name}</strong> — ${inputHTML}`;

    if (move.type === "Command Normal") {
      document.getElementById("command-normals").appendChild(moveEl);
    } else if (move.type === "Special Move") {
      document.getElementById("special-moves").appendChild(moveEl);
    } else if (move.type === "Super") {
      document.getElementById("supers").appendChild(moveEl);
    }
  });
}

// Initialize sidebar
loadCharacterList();
