// ---------------------
// game.js
// ---------------------

// 1️⃣ Get gameId from URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("game");

// 2️⃣ Set the game title dynamically
document.getElementById("game-title").innerText = gameId
  ? gameId.toUpperCase()
  : "Unknown Game";

// 3️⃣ Load character list automatically
if (gameId) loadCharacterList();

// ---------------------
// Load the list of characters for the current game
// ---------------------
async function loadCharacterList() {
  const container = document.getElementById("character-select");
  container.innerHTML = "";

  try {
    const response = await fetch(`data/${gameId}/characters.json`);
    const characters = await response.json();

    characters.forEach((char) => {
      const btn = document.createElement("button");
      btn.innerText = char.name;
      btn.onclick = () => loadCharacter(char.id);
      container.appendChild(btn);
    });
  } catch (err) {
    console.error("Failed to load character list:", err);
    container.innerHTML = "<p>No characters found for this game.</p>";
  }
}

// ---------------------
// Load data for a specific character
// ---------------------
async function loadCharacter(characterId) {
  const container = document.getElementById("character-info");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`data/${gameId}/${characterId}.json`);
    const charData = await response.json();

    let html = `
      <h2>${charData.name}</h2>
      <img src="assets/${gameId}/${charData.portrait}" alt="${charData.name}" class="character-portrait">
    `;

    // Back button
    html += `<button id="back-btn">← Back to Games</button>`;

    // Event listener for back button
    setTimeout(() => {
      const backBtn = document.getElementById("back-btn");
      if (backBtn) {
        backBtn.onclick = () => {
          window.location.href = "index.html";
        };
      }
    }, 0);

    // Group moves by type
    const groupedMoves = {};
    charData.moves.forEach((move) => {
      if (!groupedMoves[move.type]) groupedMoves[move.type] = [];
      groupedMoves[move.type].push(move);
    });

    // Render each move section
    for (const type in groupedMoves) {
      html += `<h3>${type}</h3><ul>`;
      groupedMoves[type].forEach((move) => {
        let inputHTML = "";

        // Check for multiple alternatives
        if (Array.isArray(move.input[0])) {
          // Multiple options (e.g., forward+mp OR back+mp)
          inputHTML = move.input
            .map((option) =>
              option
                .map(
                  (icon) =>
                    `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`
                )
                .join("")
            )
            .join(' <span class="or-text">or</span> ');
        } else {
          // Single input sequence
          inputHTML = move.input
            .map(
              (icon) =>
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
