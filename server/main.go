package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Kumoichi/golang-react-todo/router"
	"github.com/gorilla/handlers"
)

func main() {
	r := router.Router()
	fmt.Println("starting the server on port 9000")

	// CORS設定を追加
	// "*"はすべてのオリジンを許可しますが、特定のオリジン（例: "http://localhost:3000"）も指定可能です
	corsAllowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	corsAllowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	corsAllowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

	// CORSミドルウェアをサーバーに追加して開始
	log.Fatal(http.ListenAndServe(":9000", handlers.CORS(corsAllowedOrigins, corsAllowedMethods, corsAllowedHeaders)(r)))
}
