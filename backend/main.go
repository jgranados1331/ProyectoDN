package main

import (
	"ProyectoDN/config"
	"ProyectoDN/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Configurar DB
	config.ConnectDB()

	// Inicializar servidor Gin
	r := gin.Default()

	// Middleware CORS (para React)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Next()
	})

	// main.go
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Asegúrate que coincida con tu URL de frontend
		AllowMethods:     []string{"PUT", "GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Rutas
	routes.SetupRoutes(r)

	// Iniciar servidor
	r.Run(":8080")
}
