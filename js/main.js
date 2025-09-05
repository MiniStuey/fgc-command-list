document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ main.js loaded");

  const genreSelect = document.getElementById("genre-select");
  const gameCards = document.querySelectorAll(".game-card");

  console.log("🎮 Found cards:", gameCards.length);

  // Game card click → redirect
  gameCards.forEach(card => {
    card.addEventListener("click", () => {
      const gameId = card.dataset.game;
      console.log("👉 Clicked game:", gameId);
      if (gameId) {
        window.location.href = `game.html?game=${gameId}`;
      }
    });
  });

  // Genre filter
  if (genreSelect) {
    genreSelect.addEventListener("change", e => {
      const genre = e.target.value;
      console.log("🎭 Filtering by genre:", genre);
      gameCards.forEach(card => {
        card.style.display =
          genre === "all" || card.dataset.genre === genre
            ? "block"
            : "none";
      });
    });
  } else {
    console.warn("⚠️ Genre select not found!");
  }
});
