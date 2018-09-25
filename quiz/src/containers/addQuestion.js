import React, { Component,Fragment } from 'react';
import './addQuestion.css';

class AddQuestion extends Component {

    constructor(){
        super();
        this.state = {
            submitted : false,
            error : null,
            data : {
                QuizId : 1,
                Question : "",
                Options : ["","","",""],
                Answers : [false,false,false,false],
                Genre : "",
                Points : 1
            }
        }
    } 

    componentDidMount(){
        if(this.props.mode==="add")
        {
            let y = {...this.state.data};
            y.QuizId = Number(this.props.id);
            y.Genre = this.props.genre;
            this.setState({data : y});
            return
        }
        fetch('http://localhost:8080/getQuestion/'+this.props.id)
            .then(res => res.json())
                .then(data => {
                    data.options = JSON.parse(data.options);
                    data.answers = JSON.parse(data.answers);
                    let x = {
                        QuizId : data.quiz_id,
                        Question : data.question,
                        Options : data.options,
                        Answers : data.answers,
                        Genre : data.genre,
                        Points : data.points
                    }
                    this.setState({data : x});
                });
    }

    onQuizIdChange = (event) => {
        console.log(event.target.value);
        let x = {...this.state.data , 
            "QuizId" : Number(event.target.value)}
        this.setState({data : x});
    }

    onQuestionChange = (event) => {
        let x = {...this.state.data};
        x['Question'] = event.target.value;
        this.setState({data : x});
    }

    onOptionsChange = (event,key) => {
        let x = [...this.state.data.Options ];
        x[key] = event.target.value;
        let y = {...this.state.data,
                Options : x};
        this.setState({data: y});
    }

    onAnswerChange = (event,key) => {
        let x = [...this.state.data.Answers];
        x[key] = event.target.checked;
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
        if(this.props.method==="put"){
            fetch('http://localhost:8080/question/'+this.props.id, {
                method: 'PUT',
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
        else if(this.props.method==="post"){
            console.log(JSON.stringify(dataJSON));
            fetch('http://localhost:8080/questionadd/'+this.props.genre + '/'+this.props.id, {
            method: 'POST',
            body: JSON.stringify(dataJSON),
                })
                .then(response => {
                    if(response.status >= 200 && response.status < 300)
                        this.setState({submitted : true});
                    else if(response.status === 400)
                        console.log("Bad request");
                    else
                        console.log("Request not sent successfully");
                    return response.json()
                }).then(data => console.log(data))  
                .catch(error => {
                    console.log('ERROR : ',error)
                })
        }
        else{
            console.log("Request not sent");
        }
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
        var nums2 = Array.apply(null, {length: 20}).map(Number.call, Number); // nums2 = [0,1,2,3,4,5,...19]

        let genre = (
            <Fragment>
                <label htmlFor="genre">Genre : </label>
                    <input type="text" value={this.state.data.Genre} className="form-control" onChange={this.genreHandler} placeholder="E.g. , Math" />
                    <hr />
            </Fragment>
        );

        let quizID = (
            <div className="form-group">
                <label htmlFor="points" style={{'display' : 'block'}}>Quiz Id :</label>
                    <select className="form-control" value={this.state.data.QuizId} onChange = {this.onQuizIdChange}>
                        {nums2.map(a => <option value={a+1} key={a+1}>{a+1}</option>)}
                    </select>
            </div>
        );

        if(this.props.mode==="edit")
        { 
            genre = null;
            quizID = null;
        }

            if(this.props.mode==="add")
            {
                quizID = (
                <div className="form-group">
                    <label htmlFor="points" style={{'display' : 'block'}}>Quiz Id :</label>
                        <select className="form-control inp-disabled" value={this.state.data.QuizId} disabled onChange={this.onQuizIdChange}>
                            {nums2.map(a => <option value={a+1} key={a+1}>{a+1}</option>)}
                        </select>
                </div>
                );
                genre = (
                    <Fragment>
                        <label htmlFor="genre">Genre : </label>
                            <input type="text" value={this.props.genre} disabled className="form-control inp-disabled" onChange={this.genreHandler} placeholder="E.g. , Math" />
                            <hr />
                    </Fragment>
                );
            }

            let q = (
            <form className="Form">
                {quizID}
                <div className="form-group">
                    <label htmlFor="question">Question: </label>
                    <input type="text" value={this.state.data.Question} id="question" className="form-control" style={{'width': '50%'}} placeholder="E.g. 1+1 = ?" onChange={this.onQuestionChange}/>
                </div>
                <hr />
                <div className="form-group">
                    <label htmlFor="option" style={{'display' : 'block'}}>Options : </label>
                    {['a','b','c','d'].map((opt,index) =>
                    (
                    <div  key = {index} className="option-group">
                        <span className="opt">{opt.toUpperCase()+":"}</span>
                        <input type="text" value={this.state.data.Options[index]} className="form-control" ref={opt} placeholder={opt} onChange={(event) => this.onOptionsChange(event,index)} />
                    </div>)
                    )}
                </div>
                <hr />
                <label htmlFor="Answers">Tick the correct answers :</label>
                <div>
                    {['a','b','c','d'].map((opt,index)=>(
                    <span key = {index}>
                        <span className="opt-group">{opt.toUpperCase()+":"}</span>
                        <input type="checkbox" onChange={(event)=>this.onAnswerChange(event,index)} checked={this.state.data.Answers[index]}/>
                    </span>
                    )
                )}
                </div>
                <hr />
                {genre}
                <div className="form-group">
                        <label htmlFor="points" style={{'display' : 'block'}}>Points :</label>
                            <select className="form-control" value={this.state.data.Points} onChange = {this.setPoints}>
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