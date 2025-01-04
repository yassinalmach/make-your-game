const API_URL = "http://localhost:8080/";

export const renderScoreboard = (data = null) => {
  const container = document.getElementById("game-container");
  const scoreboard = document.createElement("div");
  scoreboard.className = "scoreboard";
  scoreboard.setAttribute("id", "scoreboard");

  // Handle case where data is null or invalid
  if (!data || !data.scores || !Array.isArray(data.scores)) {
    scoreboard.innerHTML = `
      <h2>Scoreboard</h2>
      <div class="scores">
        <p>No scores available</p>
      </div>
    `;
    container.appendChild(scoreboard);
    return;
  }

  scoreboard.innerHTML = `
    <h2>Scoreboard</h2>
    <div class="scores">
      ${data.scores
        .map(
          (player) => `
            <div class="score-card ${
              player.rank === 1
                ? "first"
                : player.rank === 2
                ? "second"
                : player.rank === 3
                ? "third"
                : ""
            }">
              <div class="rank">${player.rank || "-"}</div>
              <div class="name">${player.name || "Anonymous"}</div>
              <div class="score">${player.score || "0"}</div>
              <div class="time">${player.time || "--:--"}</div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="pagination">
      <button class="page-btn prev" data-page="${data.page - 1}" ${
    data.page === 1 ? "disabled" : ""
  }>Previous</button>
      <span>Page ${data.page || 1} of ${data.total_pages || 1}</span>
      <button class="page-btn next" data-page="${data.page + 1}" ${
    data.page === data.total_pages ? "disabled" : ""
  }>Next</button>
    </div>
  `;

  container.appendChild(scoreboard);
  document.getElementById("play-again").style.display = "block";


  // Event listeners for pagination buttons
  document.querySelectorAll(".page-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const newPage = parseInt(e.target.getAttribute("data-page"));
      const newData = await fetchScores(newPage);
      if (newData) {
        renderScoreboard(newData);
      }
    });
  });
};

export const fetchScores = async (page = 1) => {
  try {
    const response = await fetch(`${API_URL}?page=${page}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data || !data.scores || !Array.isArray(data.scores)) {
      throw new Error("Invalid data format received from server");
    }

    renderScoreboard(data);
  } catch (error) {
    console.error("Error fetching scores:", error.message);
    // Return a valid data structure even in case of error
    return {
      scores: [],
      page: 1,
      total_pages: 1,
    };
  }
};

export const postScore = async (data) => {
  try {
    if (!data || !data.name || !data.score || !data.time) {
      throw new Error("Invalid score data");
    }

    const response = await fetch(`${API_URL}post-score`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Score submitted successfully:", result);

    return result;
  } catch (error) {
    console.error("Error submitting score:", error.message);
  }
};
