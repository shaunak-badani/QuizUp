package main

import (
	"fmt"
	"encoding/json"
)

type Bird struct {
	Species string
	Description string
}

func main(){
	var bird Bird
	var arr []string
	dataJSON := `["1","2","3"]`
	myJsonString := `{"species":"pigeon" , "description":"likes to perch on rocks"}`
	// fmt.Println(json)
	json.Unmarshal([]byte(myJsonString),&bird)
	json.Unmarshal([]byte(dataJSON),&arr)
	fmt.Println("Species: %s,Description: %s",bird.Species,bird.Description)
	fmt.Println("Parsed array : ",arr[0],arr[1],arr[2] )
}