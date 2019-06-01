import React,{ Component } from 'react';
import './Quiz.css';
import {Link} from 'react-router-dom';
import Spinner from '../Spinner';

class Quiz extends Component {
    constructor(){
        super();
        this.state = {
            questions : [],
            err : null,
            loaded : false,
        }
    }
    componentDidMount() {
        fetch("http://localhost:8080/getQuiz/"+this.props.genre +"/"+ this.props.id,{
            credentials : "include",
            })
            .then(res => res.json())
                // .then(data => console.log(data))
                .then(data => {
                    let parsedData = [...data];
                    if(!data)
                        return
                    for(var i in parsedData){
                        parsedData[i].options = JSON.parse(parsedData[i].options)
                        parsedData[i].answers = JSON.parse(parsedData[i].answers)
                        let x = [];
                        for(var j in parsedData[i].answers)
                        {
                            if(parsedData[i].answers[j])
                            x.push("ABCD"[j]) 
                        };
                        parsedData[i].answers = x.join(',')
                        this.setState({questions : parsedData});
                    }
                    return this.setState({questions : parsedData,loaded : true});
                });
    }

    qDeleteHandler = (id) => {
        if(this.state.questions.length < 5)
            this.setState({err : "Sorry, A quiz must have at least 5 questions. Cannot delete any more"});
        else{
            fetch('http://localhost:8080/deleteQuestion/'+id,{
                method : 'DELETE'
            })
                .then(response => response.json())
                    .then(data => console.log(data));
            let x = this.state.questions.filter(item => item.q_id !== id);
            this.setState({questions : x});
        } 
    }

    render(){
        let x = <div className="d-flex justify-content-center"><Spinner /></div>
        if(this.state.questions.length || this.state.loaded)
            x = null
        let q = this.state.questions.map(item => (
          <tr key={item.q_id}>
              <td>{item.q_id}</td>
              <td>{item.question}</td>
              <td>{item.options[0]}</td>
              <td>{item.options[1]}</td>
              <td>{item.options[2]}</td>
              <td>{item.options[3]}</td>
              <td>{item.answers}</td>
              <td>{item.points}</td>
              <td>
                <Link to={"/viewQuizzes/edit/"+this.props.genre+"/"+this.props.id+"/"+item.q_id}>
                    <button className="btn btn-success">
                        Edit Question
                    </button>
                </Link>
              </td>
              <td>
                  <button className="btn btn-danger" onClick={() => this.qDeleteHandler(item.q_id)} >
                    Delete
                  </button>
              </td>
          </tr>  
        ));
        return(
            <div className="div-table">
                <h1>Quiz for genre : {this.props.genre} and id : {this.props.id}</h1>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Question Id</th>
                            <th>Question Statement</th>
                            <th>Option A</th>
                            <th>Option B</th>
                            <th>Option C</th>
                            <th>Option D</th>
                            <th>Correct Answers</th>
                            <th>Points</th>
                            <th>Edit Question</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {q}
                    </tbody>
                </table>
                {x}
                <Link className="d-flex justify-content-center" style={{'textDecoration' : 'none'}} to={"/viewQuizzes/add/"+this.props.genre+"/"+this.props.id+"/"}>
                    <button className="btn btn-success">
                        Add Question!
                    </button>
                </Link>
                <div className="d-flex justify-content-center">
                    {this.state.err}
                </div>
            </div>
            // <h1>{this.params.match.id}</h1>
        );
    }
}

export default Quiz;