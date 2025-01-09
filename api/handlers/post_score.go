package handlers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sort"
)

// HandlePostScore adds a new score to the database
func HandlePostScore(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")

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

	var data Score
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if data.Name == "" || data.Score < 0 || data.Time == "" {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	scores, err := ReadJSON()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	scores = append(scores, data)

	scores = SortJSON(scores)

	err = WriteJSON(scores)
	if err != nil {
		log.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	scores1, err := ReadJSON()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores1)
}

func ReadJSON() ([]Score, error) {
	var scores []Score
	scoresJSON, err := os.ReadFile("./scores.json")
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(scoresJSON, &scores)
	if err != nil {
		return nil, err
	}
	return scores, nil
}

func SortJSON(scores []Score) []Score {
	sort.Slice(scores, func(i, j int) bool {
		return scores[i].Score > scores[j].Score
	})
	return scores
}

func WriteJSON(scores []Score) error {
	f, err := os.Open("./scores.json")
	if err != nil {
		return err
	}
	defer f.Close()

	scoresBytes := new(bytes.Buffer)
	json.NewEncoder(scoresBytes).Encode(scores)
	_, err = f.Write(scoresBytes.Bytes())
	if err != nil {
		return err
	}
	return nil
}
