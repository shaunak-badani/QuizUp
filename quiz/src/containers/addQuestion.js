import React, { Component } from 'react';
import './addQuestion.css';

class AddQuestion extends Component {

    constructor(){
        super();
        this.state = {
            submitted : false,
            error : null,
            data : {
                QuizId : 1,
                question : "",
                Options : [],
                Answers : [false,false,false,false],
                Genre : "",
                Points : 1
            }
        }
    }

    onQuizIdChange = (event) => {
        console.log(event.target.value);
        let x = {...this.state.data , 
            "QuizId" : Number(event.target.value)}
        this.setState({data : x});
    }

    onQuestionChange = (event) => {
        let x = {...this.state.data};
        x['question'] = event.target.value;
        this.setState({data : x});
    }

    onOptionsChange = (event,key) => {
        let x = [...this.state.data.Options ];
        x[key] = event.target.value;
        let y = {...this.state.data,
                Options : x};
        this.setState({data: y});
    }

    onAnswerChange = (key) => {
        let x = [...this.state.data.Answers];
        x[key] = !x[key];
        let y = {...this.state.data , 
                Answers : x}
        this.setState({data : y});
    }    

    genreHandler = (event) => {
        let x = {...this.state.data ,
            Genre : event.target.value}
        this.setState({data : x});
    }

    setPoints = (event) => {
        let x = {...this.state.data,
                Points : Number(event.target.value)};
        this.setState({data : x});
    } 

    sendQuestion = (event) => {
        event.preventDefault();
        let dataJSON = {...this.state.data};
        let err = this.formValidation();
        if(err)
        {
            this.setState({error : err});
            return; 
        }
        else
            this.setState({error : null});
        dataJSON['Answers'] = JSON.stringify([...dataJSON['Answers']]);
        dataJSON['Options'] = JSON.stringify([...dataJSON['Options']]);
        fetch('http://localhost:8080/questionadd', {
        method: 'POST',
        body: JSON.stringify(dataJSON),
            })
        .then(response => {
            if(response.status >= 200 && response.status < 300)
            {
                this.setState({submitted : true});
            }
            else if(response.status === 400)
            {console.log("Bad request")}
            else
            {console.log("Request not sent successfully")}
        })
        .catch(error => {
            console.log('ERROR : ',error)
        })
    }

    formValidation = () => {
        let d = this.state.data;
        //Checking for no options ticked
        let x = d.Answers.reduce((st,el) => st || el, false); //if all values are false, x -> false. Else true.
        if(!x)
            return "Answers cannot be null";
        let y = d.Options.filter(el => el.length === 0).length; //Length = 0 if all options are filled
        if( y)
            return "Please fill all the options";
        return null;
        
    }

    render(){
        var nums = Array.apply(null, {length: 5}).map(Number.call, Number); // nums = [0,1,2,3,4]
        var nums2 = Array.apply(null, {length: 20}).map(Number.call, Number); // nums = [0,1,2,3,4,5,...20]

        let q = (
            <form className="Form">
                <div className="form-group">
                    <label htmlFor="points" style={{'display' : 'block'}}>Quiz Id :</label>
                        <select className="form-control" onChange = {this.onQuizIdChange}>
                            {nums2.map(a => <option value={a+1} key={a+1}>{a+1}</option>)}
                        </select>
                </div>
                <div className="form-group">
                    <label htmlFor="question">Question: </label>
                    <input type="text" id="question" className="form-control" style={{'width': '50%'}} placeholder="E.g. 1+1 = ?" onChange={this.onQuestionChange}/>
                </div>
                <hr />
                <div className="form-group">
                    <label htmlFor="option" style={{'display' : 'block'}}>Options : </label>
                    {['a','b','c','d'].map((opt,index) =>
                    (
                    <div  key = {index} className="option-group">
                        <span className="opt">{opt.toUpperCase()+":"}</span>
                        <input type="text" className="form-control" ref={opt} placeholder={opt} onChange={(event) => this.onOptionsChange(event,index)} />
                    </div>)
                    )}
                </div>
                <hr />
                <label htmlFor="Answers">Tick the correct answers :</label>
                <div>
                    {['a','b','c','d'].map((opt,index)=>(
                    <span key = {index}>
                        <span className="opt-group">{opt.toUpperCase()+":"}</span>
                        <input type="checkbox" onClick={()=>this.onAnswerChange(index)} />
                    </span>
                    )
                )}
                </div>
                <hr />
                <label htmlFor="genre">Genre : </label>
                <input type="text" className="form-control" onChange={this.genreHandler} placeholder="E.g. , Math" />
                <hr />
                <div className="form-group">
                    <label htmlFor="points" style={{'display' : 'block'}}>Points :</label>
                        <select className="form-control" onChange = {this.setPoints}>
                            {nums.map(a => <option value={a+1} key={a+1}>{a+1}</option>)}
                        </select>
                </div>
                <hr />
                <button onClick={this.sendQuestion} className="btn btn-success"> Add Question !</button>
                <div className="error">{this.state.error}</div>
            </form> 
        );
        if(this.state.submitted)
            q  = (
                <div>
                    <h1>Question Successfully added!</h1>
                </div>
            )
        return(
            <div className="Form">
                {q}
            </div>
        )
    }
}

export default AddQuestion;