// Get gameId from the URL query
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('game');

// Set the game title dynamically
document.getElementById("game-title").innerText = gameId ? gameId.toUpperCase() : "Unknown Game";

// Load character list automatically
if (gameId) loadCharacterList();

// Load the list of characters for the current game
async function loadCharacterList() {
  const container = document.getElementById("character-select");
  container.innerHTML = "";

  try {
    // Fetch characters.json for the selected game
    const response = await fetch(`data/${gameId}/characters.json`);
    const characters = await response.json();

    characters.forEach(char => {
      const btn = document.createElement("button");
      btn.innerText = char.name; // display name
      btn.onclick = () => loadCharacter(char.id); // id = JSON filename
      container.appendChild(btn);
    });
  } catch (err) {
    console.error("Failed to load character list:", err);
    container.innerHTML = "<p>No characters found for this game.</p>";
  }
}

// Load data for a specific character
async function loadCharacter(characterId) {
  const container = document.getElementById("character-data");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`data/${gameId}/${characterId}.json`);
    const charData = await response.json();

    let html = `
      <h2>${charData.name}</h2>
      <img src="${charData.portrait}" alt="${charData.name}" class="character-portrait">
    `;

    // Group moves by type (Command Normals, Input Moves, Supers)
    const groupedMoves = {};
    charData.moves.forEach(move => {
      if (!groupedMoves[move.type]) {
        groupedMoves[move.type] = [];
      }
      groupedMoves[move.type].push(move);
    });

    // Render each move section
    for (const type in groupedMoves) {
      html += `<h3>${type}</h3><ul>`;
      groupedMoves[type].forEach(move => {
        let inputHTML = "";

        // Check if move.input is multiple alternatives or single sequence
        if (Array.isArray(move.input[0])) {
          // Multiple alternatives
          inputHTML = move.input
            .map(option =>
              option
                .map(icon =>
                  `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`
                )
                .join("")
            )
            .join(' <span class="or-text">or</span> ');
        } else {
          // Single input sequence
          inputHTML = move.input
            .map(icon =>
              `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`
            )
            .join("");
        }

        html += `<li><strong>${move.name}:</strong> ${inputHTML}</li>`;
      });
      html += `</ul>`;
    }

    container.innerHTML = html;
  } catch (err) {
    console.error("Failed to load character data:", err);
    container.innerHTML = "<p>Failed to load character data.</p>";
  }
}
