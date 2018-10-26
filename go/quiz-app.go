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
    Id int `gorm:"primary_key";json:"id"`
    Q_id int `json:"q_id`
    Genre string `json:"genre"`
}

type Question struct {
    Id uint `json:"q_id";gorm:"primary_key"`
    QuizId int `sql:"type:bigint REFERENCES quizzes(id) ON DELETE CASCADE";json:"quiz_id;` 
	Question string `json:"question"`
	Options string `json:"options"`
	Answers string `json:"answers"`
	Points uint `json:"points"`
}

type User struct {
    Id uint `gorm:"primary_key":json:"u_id"`
    Username string `json:"username"`
    Name string `json:"name"`
    Password string `json:"password"`
}

type Points struct {
    Id uint `gorm:"primary_key";json:"points"`
    UserId uint `sql:"type:bigint REFERENCES users(id) ON DELETE CASCADE;json:"user_id"`
    QuizId int `sql:"type:bigint REFERENCES quizzes(id) ON DELETE CASCADE;json:"quiz_id"`
    Points uint `json:"points"`
}

type Leaderboard struct {
    User
    Points
}

func main() {
    db, err = gorm.Open("sqlite3", "./questions.db")
    if err != nil {
        fmt.Println(err)
    }
    defer db.Close()
    db.LogMode(true) // -> Shows the SQL query being performed on a gorm query function call
    db.Exec("PRAGMA foreign_keys = ON")
    db.AutoMigrate(&Quizzes{},&Question{},&User{},&Points{},&Leaderboard{})
    r := gin.Default()
    //Routes for Admin
    r.POST("/questionadd/:genre/:q_id", CreateQuestion) // -> Add a new question to genre & id    
    r.POST("/addQuiz",makeQuiz) // -> Adding a new quiz ; of existing genre or new genre
    r.GET("/quizzes", getQuizzes) // -> get list of all quizzes , basically select * from quizzes
    r.GET("/getQuiz/:genre/:q_id",getQuiz) // -> get a particular quiz (set of questions) , syntax written makes it a REST api
    r.GET("/getquiz/:id",getQuizById) //->get quiz genre by id
    r.GET("/getQuestion/:q_id",getQuestion) // -> get a particular question
    r.DELETE("/deleteQuiz/:genre/:q_id",delQuiz) //-> delete a whole quiz
    r.DELETE("/deleteQuestion/:q_id",delQuestion) //->delete a question
    r.PUT("/question/:id",editQuestion) //-> Edit a particular question
    //Routes for user
    r.POST("/user",checkUser) //->Check if user exists
    r.POST("/userAdd",addUser) // -> Route for adding users
    r.GET("/users",viewUsers) //-> See all users
    r.DELETE("/deleteUser/:id",delUser) //-> Delete user with id specified 
    // Routes for points and leaderboard generation
    r.POST("/points/:username/:genre/:id",postPoints) //-> Insert into points
    r.GET("/leaderboard",getPoints) //->Get Leaderboard across all genres
    r.GET("/genrePoints/:genre",getGenrePoints) // -> Get Leaderboard across a particular genre
    r.GET("/userPoints/:username",getUserPoints) //-> All quizzes user has attempted
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
        c.Header("access-allow-control-origin", "http://localhost:3000")
        c.JSON(404,gin.H{
                "error" : "Error in string conversion",
            })
        // return
    }
    var t Quizzes 
    err_search := db.Where("q_id = ? AND genre = ?",i,g_param).First(&t).Error
    if err_search != nil {
        fmt.Println("Error With Search : ",err_search)
        c.JSON(404,gin.H{
            "error" : "Genre Not Found",
        })
        // return
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
        // return
    }
    c.Header("access-control-allow-origin", "http://localhost:3000") // Why am I doing this? Find out. Try running with this line commented
    c.JSON(200, q)
    // return
}

func getQuiz(c *gin.Context) {
    g_param,i_param := c.Params.ByName("genre"),c.Params.ByName("q_id")
    i,erri := strconv.Atoi(i_param)
    if erri != nil{
        fmt.Println("Error with string conversion -> ",erri)
        c.JSON(404,gin.H{
            "error" : erri,
        })
        return
    }
    var t []Question
    var q Quizzes
    err_search := db.Where("q_id = ? AND genre = ?",i,g_param).First(&q).Error
    if err_search != nil{
        fmt.Println("Error with Initial search -> ",err_search)
        c.JSON(404,gin.H{
            "error" : err_search,
        })
        return
    }
    err_search2 := db.Where("quiz_id = ?",q.Id).Find(&t).Error
    if err_search2 != nil{
        fmt.Println("Error with Searching for questions -> ",err_search2)
        c.JSON(404,gin.H{
            "error" : err_search2,
        })
        return
    }
    c.Header("access-control-allow-origin", "http://localhost:3000") // Why am I doing this? Find out. Try running with this line commented
    c.Header("access-control-allow-credentials", "true")
    c.JSON(200,t)
}

func getQuizById(c *gin.Context) {
    i_param := c.Params.ByName("id")
    i,erri := strconv.Atoi(i_param)
    if erri != nil{
        fmt.Println("Error with string conversion -> ",erri)
        c.JSON(404,gin.H{
            "error" : erri,
        })
        return
    }
    var q Quizzes
    err_search := db.Where("id=?",i).First(&q).Error
    if err_search != nil{
        fmt.Println("Error with Initial search -> ",err_search)
        c.JSON(404,gin.H{
            "error" : err_search,
        })
        return
    }
    c.Header("access-control-allow-origin", "http://localhost:3000") // Why am I doing this? Find out. Try running with this line commented
    c.Header("access-control-allow-credentials", "true")
    c.JSON(200,q);
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

func delQuestion(c *gin.Context){
    q_id := c.Params.ByName("q_id")
    i,erri := strconv.Atoi(q_id)
    if erri != nil{
        fmt.Println("Error with Conversion to string : ",erri)
        c.JSON(404,gin.H{
            "error" : erri,
        })
        return
    }
    var q Question
    err_find := db.Where("id = ?",i).Delete(&q).Error
    if err_find != nil{
        fmt.Println("Error with Conversion to string : ",err_find)
        c.JSON(404,gin.H{
            "error" : err_find,
        })
        return
    }
    c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
    c.JSON(200,q)
}

func getQuizzes(c *gin.Context) {
    var quiz []Quizzes
    if err := db.Find(&quiz).Error; err != nil {
        fmt.Println("Error with Finding Quizzes : ",err)
        c.JSON(404,gin.H{
            "error" : err,
        })
        return
    } else {
        c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
        c.JSON(200, quiz)
    }
}

func getQuestion(c *gin.Context){
    var q Question
    q_id := c.Params.ByName("q_id")
    id,erri := strconv.Atoi(q_id)
    if erri !=nil{
        fmt.Println("Error with string conversion : ",erri)
        c.JSON(404,gin.H{
            "error" : erri,
        })
        return
    }
    err := db.Where("id = ?",id).First(&q).Error
    if err !=nil{
        fmt.Println("Error with Query : ",err)
        c.JSON(404,gin.H{
            "error" : err,
        })
        return
    }
    c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
    c.JSON(200,q)
}

func editQuestion(c *gin.Context){
    q_id := c.Params.ByName("id")
    id,erri := strconv.Atoi(q_id)
    if erri != nil{
        fmt.Println("Error with string conversion : ",erri)
        c.JSON(404,gin.H{
            "error" : erri,
        })
        return
    }
    var t Question
    err := db.Where("id = ?",id).First(&t).Error
    if err != nil{
        fmt.Println("Error with Query : ",err)
        c.JSON(404,gin.H{
            "error" : err,
        })
        return
    }
    c.BindJSON(&t)
    db.Save(&t)
    c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
    c.JSON(200,t)
}

func addUser(c *gin.Context){
    var p User
    c.BindJSON(&p)
    fmt.Println(db.NewRecord(p))
    if !(db.NewRecord(p)){
        c.Header("access-control-allow-origin","*")
        c.JSON(200,gin.H{
            "error" : "User already exists",
        })
        return
    }
    db.Create(&p)
    c.Header("access-control-allow-origin","*")
    c.JSON(200,p)
}

func viewUsers(c *gin.Context){
    var p []User
    err := db.Find(&p).Error
    if err!=nil{
        fmt.Println("Error while querying -> ",err)
        c.JSON(400,gin.H{
            "error" : err});
    }
    c.Header("access-control-allow-origin","*")    
    c.JSON(200,p);
}

func delUser(c *gin.Context){
    i_param := c.Params.ByName("id")
    i,erri := strconv.Atoi(i_param)
    if erri != nil{
        fmt.Println("Error while converting to string -> ",erri)
        c.JSON(400,gin.H{
            "error" : erri,
        })
    }
    var p User
    err := db.Where("id =? ",i).Delete(&p).Error
    if err!=nil{
        fmt.Println("Error while deleting ->",err)
        c.JSON(400,gin.H{
            "error" : err,
        })
    }
    c.Header("access-control-allow-origin","*")    
    c.JSON(200,p)    
}

func postPoints(c *gin.Context) {
    var p Points
    u_param,i_param := c.Params.ByName("username") , c.Params.ByName("id") //id == quiz not unique id
    g_param := c.Params.ByName("genre")
    i,erri := strconv.Atoi(i_param)
    if erri != nil{
        fmt.Println("Error while conversion to string : ",erri)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
            "error" : "queryParam not convertible to string",
        })
        return
    }
    var u User
    err_find := db.Where("username=?",u_param).First(&u).Error
    if err_find != nil{
        fmt.Println("Error while querying for user : ",err_find)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
            "error" : "Error while querying for user",
        })
        return
    }

    var t Quizzes;
    c.BindJSON(&p)
    err_find2 := db.Where("genre = ? AND q_id = ?",g_param,i).First(&t).Error
    if err_find2 != nil{
        fmt.Println("Error while querying for user : ",err_find2)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
            "error" : "Error while querying for quiz",
        })
        return
    }
    p.UserId = u.Id
    p.QuizId = t.Id 
    fmt.Println(p)
    err_create := db.Create(&p).Error
    if err_create != nil{
        fmt.Println("Error while creating -> ",err_create)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
               "error" : "No such user or quiz exists.",
        })
        return
    }
    c.Header("access-control-allow-origin","*")
    c.JSON(200,p)
}



func getPoints(c *gin.Context){
    type leaderboard struct{
        Username string
        Genre string
        Total uint
    }
    var p []leaderboard
    // err_find := db.Where("username=?",u_param).First(&u).Error
    err_find := db.Raw("SELECT users.username,quizzes.genre,SUM(points.points) as total FROM users,quizzes,points WHERE quizzes.id = points.quiz_id AND users.id = points.user_id GROUP BY users.username,quizzes.genre ORDER BY total DESC").Scan(&p).Error;
    if err_find != nil{
        fmt.Println("Error while querying for user : ",err_find)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
            "error" : "Error while querying for user",
        })
        return
    }
    c.Header("access-control-allow-origin","*")    
    c.JSON(200,p)
}

func getGenrePoints(c *gin.Context){
    type leaderboard struct{
        Username string
        Total uint
    }
    var p []leaderboard
    genre := c.Params.ByName("genre")
    err_find := db.Raw("SELECT users.username,SUM(points.points) as total FROM users,quizzes,points WHERE genre=? AND quizzes.id = points.quiz_id AND users.id = points.user_id GROUP BY users.username,quizzes.genre ORDER BY total DESC",genre).Scan(&p).Error;
    if err_find != nil{
        fmt.Println("Error while querying for user : ",err_find)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
            "error" : "Error while querying for user",
        })
        return
    }
    c.Header("access-control-allow-origin","*")    
    c.JSON(200,p)
}

func getUserPoints(c *gin.Context){
    type Userp struct{
        Genre string
        QId uint
        Points uint
    }
    var p []Userp
    u_name := c.Params.ByName("username")
    err_find := db.Raw("SELECT quizzes.genre ,quizzes.q_id,points.points FROM quizzes,users,points WHERE users.username = ? AND quizzes.id = points.quiz_id AND users.id = points.user_id",u_name).Scan(&p).Error;
    if err_find != nil{
        fmt.Println("Error while querying for user : ",err_find)
        c.Header("access-control-allow-origin","*")
        c.JSON(404,gin.H{
            "error" : "Error while querying for user",
        })
        return
    }
    c.Header("access-control-allow-origin","*")    
    c.JSON(200,p)
}

func checkUser(c *gin.Context){
    var u User
    c.BindJSON(&u)
    fmt.Println(u)
    var g User
    er_find := db.Where("username=? AND password=?",u.Username,u.Password).First(&g).Error
    if er_find!=nil{
        fmt.Println("err -> ",er_find)
        c.Header("access-control-allow-origin","*")
        c.JSON(200,gin.H{
            "auth" :false, 
        })
        return
    }
    c.Header("access-control-allow-origin","*")
    c.JSON(200,gin.H{
        "auth" :true, 
    })
}