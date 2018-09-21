package main

import (
   "fmt"
   "github.com/gin-contrib/cors"                        // Why do we need this package?
   "github.com/gin-gonic/gin"
   "github.com/jinzhu/gorm"
//    "os"
//    "io"
   "encoding/json"
   _ "github.com/jinzhu/gorm/dialects/sqlite"           // If you want to use mysql or any other db, replace this line
)

var db *gorm.DB                                         // declaring the db globally
var err error

type Quizzes struct {
    Id uint `gorm:"primary_key";gorm:"AUTO_INCREMENT";json:"id"`
    Qu_id uint `json:"qu_id`
    Genre string `json:"genre"`
}

type Question struct {
    Id uint `json:"q_id";gorm:"primary_key"`
    QuizId Quizzes `gorm:"foreignkey:Id";json:"quiz_id"` 
	question string `json:"question_statement"`
	Options string `json:"options"`
	Answers string `json:"answers"`
	Genre string `json:"genre"`
	Points uint `json:"points"`
}

func main() {
    db, err = gorm.Open("sqlite3", "./questions.db")
    if err != nil {
        fmt.Println(err)
    }
    defer db.Close()

    db.AutoMigrate(&Question{},&Quizzes{})
    r := gin.Default()
    r.POST("/addQuiz",makeQuiz)
    r.GET("/questEg",egQuestionAdd)
    r.GET("/quizzes", GetQuizzes)                             // Creating routes for each functionality
    //    r.GET("/people/:id", GetPerson)
    //    r.POST("/uploadFile",uploadFile)
    r.GET("/getQuestion",getQuestion)
    r.POST("/questionadd", CreateQuestion)
    r.GET("/genres",getGenres)
    //    r.PUT("/people/:id", UpdatePerson)
    // r.GET("/:genre/:q_id",getQuiz)
    //    r.DELETE("/people/:id", DeletePerson)
    r.Use((cors.Default()))
    r.Run(":8080")                                           // Run on port 8080
}

func makeQuiz(c *gin.Context){
    var quiz Quizzes
    // req_body := *c.Request.Body
    jsonBody := c.ContentType()
    var req_body Quizzes
    json.Unmarshal([]byte(jsonBody),&req_body)
    fmt.Println(req_body.Qu_id)
    // fmt.Println(num2)
    // reqBody2 := string(buf2[0:num2])
    // fmt.Println(reqBody2)
    // for k,v := c.Request.Body {
    //     fmt.Println("key : ",k,"value: ",v)
    // }
    // fmt.Println()
    c.BindJSON(&quiz)
    fmt.Println(quiz)
    db.Create(&quiz)
    c.JSON(200,quiz)
}

func egQuestionAdd(c *gin.Context) {
    var q Question 
    var t Quizzes
    db.First(&t)
    q = Question{QuizId : t , question : "1+1 = ?" , Options : "[2,3,4,5]" , Answers : "[true,false,false,false]",Genre : "Math" , Points : 5}
    if err := db.Create(&q);err!=nil {
        c.AbortWithStatus(400)
        fmt.Println("Error :",err)
    }
    c.Header("access-control-allow-origin","*")
    c.JSON(200,q)

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

func CreateQuestion(c *gin.Context) {
   var q Question
   c.BindJSON(&q)
   fmt.Println(q , q.Id)
   fmt.Println(q)
   db.Create(&q)
   c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
   c.JSON(200, q)
}

func getGenres(c *gin.Context) {
    var q []Quizzes;    
    if er := db.Table("quizzes").Select("genre").Group("genre").Scan(&q).Error; er!=nil{
        c.AbortWithStatus(404)
        fmt.Println(er)
    }
    c.Header("access-control-allow-origin","*")
    c.JSON(200,q)
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
