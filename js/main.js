// ---------------------
// main.js
// Handles game selection & filtering
// ---------------------

document.addEventListener("DOMContentLoaded", () => {
  const genreSelect = document.getElementById("genre-select");
  const gameCards = document.querySelectorAll(".game-card");

  // 🎮 Game card click → redirect to game.html
  gameCards.forEach(card => {
    card.addEventListener("click", () => {
      const gameId = card.dataset.game;
      if (gameId) {
        window.location.href = `game.html?game=${gameId}`;
      }
    });
  });

  // 🎭 Filter by genre
  genreSelect.addEventListener("change", e => {
    const genre = e.target.value;
    gameCards.forEach(card => {
      card.style.display =
        genre === "all" || card.dataset.genre === genre
          ? "block"
          : "none";
    });
  });
});
