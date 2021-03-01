package database

import (
	"database/sql"
	"log"
)

// DbConn :
var DbConn *sql.DB

// SetupDatabase :
func SetupDatabase() {
	var err error
	DbConn, err = sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/inventorydb")
	if err != nil {
		log.Fatal(err)
	}
}
