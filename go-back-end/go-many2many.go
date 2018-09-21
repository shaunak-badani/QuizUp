package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
)

type Language struct {
	gorm.Model
	Name string
}

type User struct {
	gorm.Model
	Languages         []Language `gorm:"many2many:user_languages;"`
}

var db *gorm.DB
var err error

func main(){

	
	db,err = gorm.Open("sqlite3","./gorm.db")
	fmt.Println("err : ",err)
	// var user User	
	// var languages Language
	db.AutoMigrate(&Language{})
	db.AutoMigrate(&User{})
	// db.Model(&user).Related(&languages, "Languages")
	//// SELECT * FROM "languages" INNER JOIN "user_languages" ON "user_languages"."language_id" = "languages"."id" WHERE "user_languages"."user_id" = 111
	
	// db.Preload("Languages").First(&user)
	fmt.Println("Reached")
}