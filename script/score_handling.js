const API_URL = "http://localhost:8080/"

export const renderScoreboard = (data = null) => {
  const container = document.getElementById("game-container")
  const scoreboard = document.createElement("div")
  scoreboard.className = "scoreboard"
  scoreboard.id = "scoreboard"

  if (!data || !Array.isArray(data) || data.length === 0) {
    scoreboard.innerHTML = `
      <h2>Scoreboard</h2>
      <div class="scores">
        <p>No scores available</p>
      </div>
    `
    container.appendChild(scoreboard)
    return
  }

  const recordsPerPage = 5
  const totalPages = Math.ceil(data.length / recordsPerPage)
  let currentPage = 1

  const renderPage = (page) => {
    const start = recordsPerPage * (page - 1)
    const end = recordsPerPage + start
    const pageData = data.slice(start, end)

    const scoresHTML = pageData.map((score) => `
      <div class="score-card ${score.rank <= 3 ? ['first', 'second', 'third'][score.rank - 1] : ''}">
        <div class="rank">${score.rank}</div>
        <div class="name">${score.name}</div>
        <div class="score">${score.score}</div>
        <div class="time">${score.time}</div>
      </div>
    `).join("")

    scoreboard.innerHTML = `
      <h2>Scoreboard</h2>
      <div class="scores">${scoresHTML}</div>
      <div class="pagination">
        <button class="page-btn prev" id="btn_prev">Previous</button>
        <span>Page ${page} of ${totalPages}</span>
        <button class="page-btn next" id="btn_next">Next</button>
      </div>
    `

    const btnPrev = document.getElementById("btn_prev")
    const btnNext = document.getElementById("btn_next")

    btnPrev.disabled = page === 1
    btnNext.disabled = page === totalPages

    btnPrev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        renderPage(currentPage)
      }
    })

    btnNext.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        renderPage(currentPage)
      }
    })
  }

  container.appendChild(scoreboard)
  renderPage(currentPage)

  document.getElementById("play-again").style.display = "block"
}

export const fetchScores = async () => {
  try {
    const response = await fetch(`${API_URL}`)

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format received from server")
    }

    renderScoreboard(data)
  } catch (error) {
    console.error("Error fetching scores:", error.message)
    renderScoreboard(null) // Render empty scoreboard on error
  }
}

export const postScore = async (data) => {
  try {
    if (!data || !data.name || !data.time) {
      throw new Error("Invalid score data")
    }

    const response = await fetch(`${API_URL}post-score`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const result = await response.json()
    console.log("Score submitted successfully:", result)
    return result
  } catch (error) {
    console.error("Error submitting score:", error.message)
    throw error
  }
}