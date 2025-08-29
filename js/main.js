async function loadCharacter(character) {
  const response = await fetch(`data/${character}.json`);
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
    moveEl.innerHTML = `<strong>${move.name}</strong> — ${move.input}`;
    movesDiv.appendChild(moveEl);
  });
}
