package models

import (
	"time"

	"gorm.io/gorm"
)

type Victim struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	FullName  string         `gorm:"size:100;not null" json:"full_name"`
	ImageURL  string         `gorm:"not null" json:"image_url"`
	IsDead    bool           `gorm:"default:false" json:"is_dead"`
	Cause     string         `gorm:"size:200" json:"cause,omitempty"`
	Details   string         `json:"details,omitempty"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"` // Campo para soft delete (opcional)
}

type DeathCause struct {
	gorm.Model
	VictimID    uint   `gorm:"unique;not null"`
	Cause       string `gorm:"size:200;default:'Ataque al corazón'"`
	Details     string
	SpecifiedAt *time.Time
	DeathDelay  string `gorm:"default:'40 seconds'"`
}
