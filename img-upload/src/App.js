import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  state = {
    selectedFile : null
  }

  fileSelectedHandler = (event) => {
    console.log(event.target.files[0]);
    this.setState({selectedFile : event.target.files[0]})
  }

  fileUploadHandler = () => {
    // console.log("called");
    const fd = new FormData();
    fd.append('audio',this.state.selectedFile,this.state.selectedFile.name);
    console.log(fd)
    const f = {
      "pass" : "fasadf",
      ...fd
    }
    console.log("appended ")
    axios.post('http://localhost:8080/uploadFile',f)
    .then(res => console.log(res));
  }

  render() {
    return (
      <div className="App">
        <input type="file" onChange={this.fileSelectedHandler}/>
        <button onClick={this.fileUploadHandler} >Upload!</button>
      </div>
    );
  }
}

export default App;
