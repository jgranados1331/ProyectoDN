package tests

import (
	"ProyectoDN/config"
	"ProyectoDN/models"
	"os"
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var testDB *gorm.DB

func TestMain(m *testing.M) {
	// Configurar base de datos de prueba (SQLite en memoria)
	setupTestDB()
	code := m.Run()
	os.Exit(code)
}

func setupTestDB() {
	var err error
	testDB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("Error al conectar a la DB de prueba")
	}
	// Migrar modelos
	testDB.AutoMigrate(&models.Victim{}, &models.DeathCause{})
	config.DB = testDB // Inyectar la DB de prueba
}
