package main

import (
   "fmt"
   "github.com/gin-contrib/cors"                        // Why do we need this package?
   "github.com/gin-gonic/gin"
   "github.com/jinzhu/gorm"
//    "os"
//    "io"
   "strconv"
//    _ "github.com/jinzhu/gorm/dialects/sqlite"           // If you want to use mysql or any other db, replace this line
   _ "github.com/lib/pq"
   _ "github.com/mattn/go-sqlite3"
)

var db *gorm.DB                                         // declaring the db globally
var err error

type Quizzes struct {
    Id int `gorm:"primary_key";gorm:"AUTO_INCREMENT";json:"id"`
    Q_id uint `json:"q_id`
    Genre string `json:"genre"`
    Ques Question
}

type Question struct {
    Id uint `json:"q_id";gorm:"primary_key"`
    QuizId int `sql:"type:bigint REFERENCES quizzes(id) ON DELETE CASCADE";json:"quiz_id;` 
	Question string `json:"question"`
	Options string `json:"options"`
	Answers string `json:"answers"`
	Points uint `json:"points"`
}

func main() {
    db, err = gorm.Open("sqlite3", "./questions.db")
    if err != nil {
        fmt.Println(err)
    }
    defer db.Close()
    db.LogMode(true)
    db.Exec("PRAGMA foreign_keys = ON")
    db.AutoMigrate(&Quizzes{},&Question{})
    r := gin.Default()
    r.POST("/questionadd/:genre/:q_id", CreateQuestion) // -> Add a new question to genre & id
    r.POST("/addQuiz",makeQuiz) // -> Adding a new quiz ; of existing genre or new genre
    r.GET("/quizzes", GetQuizzes) // -> get list of all quizzes , basically select * from quizzes
    r.GET("/getQuiz/:genre/:q_id",getQuiz) // -> get a particular quiz (set of questions) , syntax written makes it a REST api
    r.GET("/getQuestion/:q_id",getQuestion) // -> get a particular question
    r.DELETE("/deleteQuiz/:genre/:q_id",delQuiz)
    // r.GET("/genres",getGenres)
    //    r.GET("/people/:id", GetPerson)
    //    r.POST("/uploadFile",uploadFile)
    // r.PUT("/people/:id", UpdatePerson)
    // r.GET("/:genre/:q_id",getQuiz)
    // r.DELETE("/people/:id", DeletePerson)
    r.Use((cors.Default()))
    r.Run(":8080")                                           // Run on port 8080
}

func makeQuiz(c *gin.Context){
    var quiz Quizzes
    c.BindJSON(&quiz)
    fmt.Println(quiz)
    db.Create(&quiz)
    c.JSON(200,quiz)
}

func CreateQuestion(c *gin.Context) {
    var q Question
    g_param,i_param := c.Params.ByName("genre"),c.Params.ByName("q_id")
    i,erri := strconv.Atoi(i_param)
    if erri != nil {
        fmt.Println("Error id -> string : ",erri)
        c.JSON(404,gin.H{
            "error" : "Genre Not Found",
        })
        return
    }
    var t Quizzes 
    err_search := db.Where("q_id = ? AND genre = ?",i,g_param).First(&t).Error
    if err_search != nil {
        fmt.Println("Error With Search : ",err_search)
        c.JSON(404,gin.H{
            "error" : "Genre Not Found",
        })
        return
    }
    c.BindJSON(&q)
    fmt.Println(q)
    q.QuizId = t.Id
    err_save := db.Create(&q).Error
    if err_save != nil{
        fmt.Println("Error While Saving to db : ",err_save)
        c.JSON(404,gin.H{
            "error" : err_save,
        })
        return
    }

    c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
    c.JSON(200, q)
 }

func delQuiz(c *gin.Context){
    var q Quizzes
    g_param,i_param := c.Params.ByName("genre"),c.Params.ByName("q_id")
    i,erri := strconv.Atoi(i_param)
    if erri != nil{
        fmt.Println("Error with Conversion to string : ",erri)
        c.JSON(404,gin.H{
            "error" : err,
        })
        return
    }
    err = db.Where("q_id = ? AND genre =?",i,g_param).Delete(&q).Error
    if err != nil{
        fmt.Println("Error with Deletion : ",err)
        c.JSON(404,gin.H{
            "error" : err,
        })
        return
    }
    c.Header("access-control-allow-origin","*")
    c.JSON(200,q)
    
}

func getQuiz(c *gin.Context) {
    g,i := c.Params.ByName("genre"),c.Params.ByName("id")
    var t Quizzes
    if err := db.Where("genre = ? AND qu_id = ?",g,i).First(&t).Error;err!=nil{
        c.AbortWithStatus(404)
        fmt.Println("Error With Quizzes: ",err)
    }
    fmt.Println(t)
    rows,err := db.Table("questions").Joins("JOIN quizzes on quizzes.id = questions.quiz_id").Rows()
    if err!=nil{
        fmt.Println("Error on Join : ",err)
    }
 
 
    for rows.Next(){
        fmt.Println(rows)
    }
    // var q []Question
    // if err := db.Where("QuizId = ? ",t.).Find(&q).Error ; err != nil {
    //     c.AbortWithStatus(404)
    //     fmt.Println("Error With Questions: ",err)
    // }

    c.JSON(200,t)
}

func GetQuizzes(c *gin.Context) {
    //    id := c.Params.ByName("id")   
    var quiz []Question
    if err := db.Find(&quiz).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
        c.JSON(200, quiz)
    }
}

func getQuestion(c *gin.Context){
    var q []Question
    // fmt.Println(q)
    db.Find(&q)
    c.JSON(200,q)
}

// func uploadFile(c *gin.Context){

//     file,header,err := c.Request.FormFile("image")
//     // filename := header.Filename
//     fmt.Println(header.Filename)
//     fmt.Println(c.Request.Body)     
//     buf := make([]byte, 1024)
// 	num, _ := c.Request.Body.Read(buf)
//     reqBody := string(buf[0:num])
//     fmt.Println("Req Body :",reqBody)
//     out,err  := os.Create("./"+header.Filename)
//     if err != nil {
//         fmt.Println("Error : ",err)
//     }
//     defer out.Close()
//     _,err = io.Copy(out,file)
//     if err != nil {
//         fmt.Println("Error 2 :",err)
//     }
//     // fmt.Println(g)
//     c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
//     c.JSON(200,gin.H{
//         "success" : "true",
//     })
// }

// func DeletePerson(c *gin.Context) {
//    id := c.Params.ByName("id")
//    var person Person
//    d := db.Where("id = ?", id).Delete(&person)
//    fmt.Println(d)
//    c.Header("access-control-allow-origin", "*")
//    c.JSON(200, gin.H{"id #" + id: "deleted"})
// }

// func UpdatePerson(c *gin.Context) {
//    var person Person
//    id := c.Params.ByName("id")
//    if err := db.Where("id = ?", id).First(&person).Error; err != nil {
//       c.AbortWithStatus(404)
//       fmt.Println(err)
//    }
//    c.BindJSON(&person)
//    db.Save(&person)
//    c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
//    c.JSON(200, person)
// }





// func GetPeople(c *gin.Context) {
//    var people []Person
//    if err := db.Find(&people).Error; err != nil {
//       c.AbortWithStatus(404)
//       fmt.Println(err)
//    } else {
//       c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
//       c.JSON(200, people)
//    }
// }
