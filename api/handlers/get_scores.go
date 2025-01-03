package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
)

var DB *sql.DB

// HandleGetScors retrieves scores from the database
func HandleGetScors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	pageParam := r.URL.Query().Get("page")
	page, err := strconv.Atoi(pageParam)
	if err != nil || page < 1 {
		page = 1
	}
	limit := 5 
	offset := (page - 1) * limit

	// Query to get the total rank for all scores
	query := `
		SELECT name, score, time, 
		       RANK() OVER (ORDER BY score DESC) AS rank 
		FROM scoreboard 
		LIMIT ? OFFSET ?
	`
	rows, err := DB.Query(query, limit, offset)
	if err != nil {
		http.Error(w, "Failed to retrieve scores", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var scores []map[string]interface{}
	for rows.Next() {
		var rank int
		var name, time string
		var score int

		err := rows.Scan( &name, &score, &time, &rank)
		if err != nil {
			http.Error(w, "Failed to parse scores", http.StatusInternalServerError)
			return
		}

		scores = append(scores, map[string]interface{}{
			"rank":  rank,
			"name":  name,
			"score": score,
			"time":  time,
		})
	}

	// Query to calculate total pages
	var totalRecords int
	err = DB.QueryRow("SELECT COUNT(id) FROM scoreboard").Scan(&totalRecords)
	if err != nil {
		http.Error(w, "Failed to calculate total records", http.StatusInternalServerError)
		return
	}
	totalPages := (totalRecords + limit - 1) / limit // Calculate total pages

	// Return response
	response := map[string]interface{}{
		"page":        page,
		"total_pages": totalPages,
		"scores":      scores,
	}
	json.NewEncoder(w).Encode(response)
}
