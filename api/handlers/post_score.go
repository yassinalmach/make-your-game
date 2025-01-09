package handlers

import (
	"encoding/json"
	"net/http"
)

// HandlePostScore adds a new score to the database
func HandlePostScore(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Content-Type", "application/json")

	// Handle preflight OPTIONS request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Handle actual POST request
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


}
