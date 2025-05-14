package tests

import (
	"ProyectoDN/config"
	"ProyectoDN/handlers"
	"ProyectoDN/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAddDeathCause(t *testing.T) {
	// Configurar router y datos de prueba
	r := gin.Default()
	r.PUT("/victims/:id/cause", handlers.AddCause)
	victim := models.Victim{FullName: "Test", ImageURL: "http://test.com/img.jpg"}
	config.DB.Create(&victim)

	// Caso 1: Causa válida
	t.Run("Causa especificada correctamente", func(t *testing.T) {
		data := map[string]interface{}{
			"cause":        "Paro cardíaco",
			"details":      "Por shinigami Ryuk",
			"specified_at": time.Now().Format(time.RFC3339),
		}
		body, _ := json.Marshal(data)
		req, _ := http.NewRequest("PUT", "/victims/1/cause", bytes.NewBuffer(body))
		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		assert.Equal(t, http.StatusOK, resp.Code)
		assert.Contains(t, resp.Body.String(), "Paro cardíaco")
	})
}
