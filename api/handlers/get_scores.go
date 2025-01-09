package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

var DB *sql.DB

// HandleGetScors retrieves scores from the database
func HandleGetScors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.URL.Path != "/" {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	scores, err := os.ReadFile("./scores.json")
	if err != nil {
		fmt.Println(err)
	}
	log.Println(scores)
	// Return response
	response := map[string]interface{}{
		"scores": 1,
	}
	json.NewEncoder(w).Encode(response)
}
