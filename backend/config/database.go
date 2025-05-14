package config

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	dsn := "host=localhost user=postgres password=Johan0313 dbname=deathnote port=5432 sslmode=disable"

	// Reintentar hasta 5 veces
	for i := 0; i < 5; i++ {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Intento %d: Falló la conexión a PostgreSQL. Reintentando...", i+1)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		panic("Error al conectar a PostgreSQL: " + err.Error())
	}
	log.Println("✅ Conectado a PostgreSQL")
}
