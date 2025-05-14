package handlers

import (
	"ProyectoDN/config"
	"ProyectoDN/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Request struct separado del modelo DB
type VictimRequest struct {
	FullName string `json:"full_name" binding:"required"`
	ImageURL string `json:"image_url" binding:"required,url"`
	Cause    string `json:"cause,omitempty"`
	Details  string `json:"details,omitempty"`
}

func AddVictim(c *gin.Context) {
	var req VictimRequest

	// 1. Bind con mensaje de error detallado
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	// 2. Mapear request al modelo DB
	victim := models.Victim{
		FullName: req.FullName,
		ImageURL: req.ImageURL,
		Cause:    req.Cause,
		Details:  req.Details,
		IsDead:   false, // Valor por defecto
	}

	// 3. Guardar en DB
	if err := config.DB.Create(&victim).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al guardar en base de datos",
			"details": err.Error(),
		})
		return
	}

	// 4. Programar muerte si no hay causa
	if victim.Cause == "" {
		go scheduleDefaultDeath(victim.ID)
	}

	// 5. Respuesta exitosa
	c.JSON(http.StatusCreated, gin.H{
		"id":        victim.ID,
		"full_name": victim.FullName,
		"image_url": victim.ImageURL,
	})
}

func AddCause(c *gin.Context) {
	id := c.Param("id")
	var victim models.Victim

	if err := config.DB.First(&victim, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Víctima no encontrada"})
		return
	}

	if err := c.ShouldBindJSON(&victim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	config.DB.Save(&victim)
	c.JSON(http.StatusOK, victim)
}

// ListVictims - Listar todas las víctimas
func ListVictims(c *gin.Context) {
	var victims []models.Victim
	config.DB.Find(&victims)
	c.JSON(http.StatusOK, victims)
}

// GetVictimDetails - Obtener detalles de una víctima
func GetVictimDetails(c *gin.Context) {
	id := c.Param("id")
	var victim models.Victim

	if err := config.DB.First(&victim, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Víctima no encontrada"})
		return
	}

	c.JSON(http.StatusOK, victim)
}

func AddDeathDetails(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Cause     string `json:"cause" binding:"required"`
		Specifics string `json:"specifics"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	var victim models.Victim
	if err := config.DB.First(&victim, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Víctima no encontrada"})
		return
	}

	// Actualizar datos
	updates := map[string]interface{}{
		"cause":      request.Cause,
		"details":    request.Specifics,
		"is_dead":    true,
		"death_time": time.Now().Add(40 * time.Second), // Muerte en 40s
	}

	if err := config.DB.Model(&victim).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al actualizar víctima",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Detalles de muerte actualizados",
		"victim":  victim,
	})
}
