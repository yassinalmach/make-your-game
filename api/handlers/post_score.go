package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
)

// HandlePostScore adds a new score to the database
func HandlePostScore(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight OPTIONS request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

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
		log.Println(err)
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "success"})
}

func ReadJSON() ([]Score, error) {
	var scores []Score
	scoresJSON, err := os.ReadFile("./scores.json")
	if os.IsNotExist(err) || len(scoresJSON) == 0 {
		return scores, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to read scores.json: %w", err)
	}

	err = json.Unmarshal(scoresJSON, &scores)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal scores.json: %w", err)
	}
	return scores, nil
}

func SortJSON(scores []Score) []Score {
	sort.Slice(scores, func(i, j int) bool {
		return scores[i].Score > scores[j].Score
	})
	for i := range scores {
		scores[i].Rank = i + 1
	}
	return scores
}

func WriteJSON(scores []Score) error {
    jsonData, err := json.MarshalIndent(scores, "", "  ")
    if err != nil {
        return err
    }

    return os.WriteFile("./scores.json", jsonData, 0644)
}