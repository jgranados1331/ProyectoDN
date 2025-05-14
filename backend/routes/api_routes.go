package routes

import (
	"ProyectoDN/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/victims", handlers.AddVictim)
		api.PUT("/victims/:id/cause", handlers.AddCause) // Añadir causa (6m40s para detalles)
		api.PUT("/victims/:id/death-details", handlers.AddDeathDetails)
		api.GET("/victims", handlers.ListVictims)          // Listar todas
		api.GET("/victims/:id", handlers.GetVictimDetails) // Detalles específicos
	}
}
