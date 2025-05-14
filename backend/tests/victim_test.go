package tests

import (
	"ProyectoDN/handlers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAddVictim(t *testing.T) {
	// Configurar router
	r := gin.Default()
	r.POST("/victims", handlers.AddVictim)

	// Caso 1: Registro exitoso
	t.Run("Registro válido con imagen", func(t *testing.T) {
		body := `{"full_name": "Light Yagami", "image_url": "http://example.com/light.jpg"}`
		req, _ := http.NewRequest("POST", "/victims", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		assert.Equal(t, http.StatusCreated, resp.Code)
		assert.Contains(t, resp.Body.String(), "Light Yagami")
	})

	// Caso 2: Error por falta de imagen
	t.Run("Error sin imagen", func(t *testing.T) {
		body := `{"full_name": "Misa Amane"}`
		req, _ := http.NewRequest("POST", "/victims", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		assert.Contains(t, resp.Body.String(), "imagen es obligatoria")
	})
}
