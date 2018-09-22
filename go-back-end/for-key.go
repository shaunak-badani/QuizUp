package main

import (
    "fmt"

    "github.com/jinzhu/gorm"
    _ "github.com/mattn/go-sqlite3"
)

type User struct {
    Id      int
    Name    string
    Address Address
}

type Address struct {
    Id       int
    Address1 string
    UserId   int `sql:"type:bigint REFERENCES users(id)"`
}

func main() {
    db, _ := gorm.Open("sqlite3", "test.db")
    db.Exec("PRAGMA foreign_keys = ON")
    db.LogMode(true)
    db.AutoMigrate(&User{}, &Address{})
    fmt.Println(db.Save(&User{Name: "jinzhu"}).Error)
    var query User
    db.Where("name = ?","jinzhu").First(&query)
    fmt.Println(db.Save(&Address{Address1: "address 2", UserId: query.Id}).Error)
    // fmt.Println(db.Save(&User{Name : "anurag", Address : Address{Address1: "address 1"}}).Error)

}