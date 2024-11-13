package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Kumoichi/golang-react-todo/middleware"
	"github.com/Kumoichi/golang-react-todo/router"
)

func main() {
	r := router.Router()
	r.Use(middleware.EnableCORS) // CORSミドルウェアを適用

	fmt.Println("Starting the server on port 9000")

	log.Fatal(http.ListenAndServe(":9000", r))
}
