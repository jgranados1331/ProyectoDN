package handlers

import (
	"ProyectoDN/config"
	"ProyectoDN/models"

	"time"
)

func scheduleDefaultDeath(victimID uint) {
	time.Sleep(40 * time.Second) // Timer de 40s

	var victim models.Victim
	config.DB.First(&victim, victimID)

	if !victim.IsDead && victim.Cause == "" {
		config.DB.Model(&victim).Updates(map[string]interface{}{
			"Cause":  "Ataque al corazón",
			"IsDead": true,
		})
	}
}
