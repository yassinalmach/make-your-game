package handlers

import (
	"encoding/json"
	"net/http"
)

// HandlePostScore adds a new score to the database
func HandlePostScore(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		// Handle preflight request
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var data struct {
		Name  string `json:"name"`
		Score int    `json:"score"`
		Time  string `json:"time"`
	}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if data.Name == "" || data.Score < 0 || data.Time == "" {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO scoreboard (name, score, time) VALUES (?, ?, ?)`
	_, err = DB.Exec(query, data.Name, data.Score, data.Time)
	if err != nil {
		http.Error(w, "Failed to save score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Score added successfully",
	})
}
