package main

import (
	"log"
	"net/http"
	"os"

	"api/handlers"
)

func main() {
	// check args
	if len(os.Args) != 1 {
		log.Fatal("Too many arguments")
	}

	http.HandleFunc("/", handlers.HandleGetScors)
	http.HandleFunc("/post-score", handlers.HandlePostScore)

	// Start the HTTP server
	log.Println("Server starting on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Server error:", err)
	}
}
