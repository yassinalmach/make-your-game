package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
	"api/handlers"
)



func init() {
	// Connect to the database
	err := connectDatabase()
	if err != nil {
		log.Panic("Database connection error:", err)
	}
}

func connectDatabase() error {
	var err error
	handlers.DB, err = sql.Open("sqlite3", "./database.db")
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	// Test the database connection
	err = handlers.DB.Ping()
	if err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	// CreateTables executes all queries from schema.sql
	query := `CREATE TABLE IF NOT EXISTS scoreboard (
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		name TEXT NOT NULL,
		score INTEGER NOT NULL,
		time TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
	);`

	_, err = handlers.DB.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create scoreboard table: %v", err)
	}
	return nil
}

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
