import React,{ Component } from 'react';
import './Quiz.css';
import {Link} from 'react-router-dom';
import Spinner from '../viewQuiz/Spinner';

class Quiz extends Component {
    constructor(){
        super();
        this.state = {
            questions : []
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
                    console.log(data);
                    if(!data)
                        return
                    for(var i in parsedData){
                        console.log("pd[i].answers :",parsedData[i].answers)
                        console.log("pd[i]",parsedData[i])
                        parsedData[i].options = JSON.parse(parsedData[i].options)
                        parsedData[i].answers = JSON.parse(parsedData[i].answers)
                        console.log(parsedData[i].q_id)
                        console.log(parsedData[i].options);
                        console.log(parsedData[i].answers);
                        let x = [];
                        for(var j in parsedData[i].answers)
                        {
                            if(parsedData[i].answers[j])
                            x.push("ABCD"[j]) 
                        };
                        console.log(x);
                        console.log(x.join(','))
                        parsedData[i].answers = x.join(',')
                        this.setState({questions : parsedData})
                        // parsedData[i].options = JSON.parse(data[i].options);
                        // parsedData[i].answers = JSON.parse(data[i].answers);
                    }
                    console.log(data);
                    return this.setState({questions : parsedData});
                });
        
    }

    render(){
        let x = <div className="d-flex justify-content-center"><Spinner /></div>
        console.log(this.state.questions.length);
        if(this.state.questions.length)
            x = null
        let q = this.state.questions.map(item => (
          <tr>
              <td>{item.q_id}</td>
              <td>{item.question}</td>
              <td>{item.options[0]}</td>
              <td>{item.options[1]}</td>
              <td>{item.options[2]}</td>
              <td>{item.options[3]}</td>
              <td>{item.answers}</td>
              <td>{item.points}</td>
              <td>
                <Link to={"/viewQuizzes/edit/"+item.q_id}>
                    <button className="btn btn-success">
                        Edit Question
                    </button>
                </Link>
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
                        </tr>
                    </thead>
                    <tbody>
                        {q}
                    </tbody>
                </table>
                {x}
                <Link className="d-flex justify-content-center" to={"/viewQuizzes/add/"+this.props.genre+"/"+this.props.id}>
                    <button className="btn btn-success">
                        Add Question!
                    </button>
                </Link>
            </div>
            // <h1>{this.params.match.id}</h1>
        );
    }
}

export default Quiz;