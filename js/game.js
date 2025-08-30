// Get selected game from URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("game");

// Map game IDs to display names
const gameNames = {
  "ssf2t": "Super Street Fighter II Turbo",
  "sf3": "Street Fighter III: 3rd Strike"
  // Add more games here as needed
};

// Set game title
document.getElementById("game-title").innerText = gameNames[gameId] || "Unknown Game";

// Go back to index.html
function goHome() {
  window.location.href = "index.html";
}

// Load character buttons dynamically
async function loadCharacterList() {
  const container = document.getElementById("character-select");
  container.innerHTML = "";

  try {
    // Fetch character list for this game
    const response = await fetch(`data/${gameId}/characters.json`);
    const characters = await response.json();

    characters.forEach(char => {
      const btn = document.createElement("button");
      btn.innerText = char.name;       // display name
      btn.onclick = () => loadCharacter(char.id); // JSON filename
      container.appendChild(btn);
    });
  } catch (err) {
    console.error("Failed to load character list:", err);
    container.innerHTML = "<p>No characters found for this game.</p>";
  }
}

// Load character moves dynamically
async function loadCharacter(character) {
  try {
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
      if (!moveTypes[move.type]) moveTypes[move.type] = [];
      moveTypes[move.type].push(move);
    });

    // Create a section for each move type
    for (const type in moveTypes) {
      const section = document.createElement("div");
      section.className = "move-section";

      const title = document.createElement("h3");
      title.innerText = type;
      section.appendChild(title);

      moveTypes[type].forEach(move => {
        const moveEl = document.createElement("div");
        moveEl.className = "move";

        // Generate HTML for move input icons (supports single and multiple alternatives)
        let inputHTML = "";

        if (Array.isArray(move.input[0])) {
          // Multiple alternative sequences
          inputHTML = move.input.map(option => {
            return option.map(icon => 
              `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`
            ).join("");
          }).join(" <span>or</span> ");
        } else {
          // Single input sequence
          inputHTML = move.input.map(icon => 
            `<span class="input-icon"><img src="assets/icons/${icon}.png" alt="${icon}"></span>`
          ).join("");
        }

        moveEl.innerHTML = `<strong>${move.name}</strong> — ${inputHTML}`;
        section.appendChild(moveEl);
      });

      container.appendChild(section);
    }
  } catch (err) {
    console.error("Failed to load character JSON:", err);
    document.getElementById("character-info").innerHTML =
      "<p>Failed to load character data.</p>";
  }
}

// Initialize the sidebar once DOM is ready
document.addEventListener("DOMContentLoaded", loadCharacterList);
