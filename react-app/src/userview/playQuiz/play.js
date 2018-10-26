import React,{Component} from 'react';
import {Redirect} from 'react-router-dom';
import './play.css';

class Play extends Component{
    constructor(){
        super()
        this.state = {
            questions : [],
            optionsTicked : [false,false,false,false],
            loaded :false,
            index : 0,
            score : 0,
            isCorrect : false,
            showIfCorrect : false,
            completed : false
        }
    }

    componentDidMount(){
        fetch('http://localhost:8080/getQuiz/'+this.props.genre +'/'+this.props.id)
            .then(res => res.json())
                .then(data => {
                    let x = data.map(item => {
                        item['answers'] = JSON.parse(item['answers']);
                        item['options'] = JSON.parse(item['options']);
                        return item;
                    });
                    console.log(x);
                    this.setState({questions : x});
                });
        this.setState({loaded : true});
    }

    qVerifyHandler = () => {
        let y = this.state.questions[this.state.index];
            if(JSON.stringify(this.state.optionsTicked) === JSON.stringify(y.answers))
        {
            let y = this.state.score + this.state.questions[this.state.index].points;
            this.setState({isCorrect : true,score : y});
        } 
        this.setState({showIfCorrect : true});
    }

    nextQuestionHandler = () => {
        if(this.state.questions.length - 1 === this.state.index)
        {
                fetch('http://localhost:8080/points/'+this.props.username+'/'+this.props.genre+'/'+this.props.id,{
                    method : 'POST',
                    body : JSON.stringify({"Points" : this.state.score})
                })
                    .then(res => res.json())
                        .then(data => console.log(data)) //->No uncaught promises
                this.setState({completed : true})
            return;
        }
        let y = this.state.index + 1;
        this.setState({
            optionsTicked : [false,false,false,false],
            isCorrect : false ,
            showIfCorrect : false,
            index : y
        })

    }

    optClickedHandler = (key) => {
        let y = [...this.state.optionsTicked];
        y[key] = !y[key];
        this.setState({optionsTicked : y});
    }

    render(){
        let x = null;
        let btnDisplay = null;
        let y = this.state.optionsTicked.reduce((el1,el2) => el1 || el2 , false) //-> for verification
        if(y)
        {
            btnDisplay = <button onClick={this.qVerifyHandler} className="btn btn-success v-button"><h1>Verify</h1></button>
        }
        else
        {
            btnDisplay = <button className="btn btn-danger v-button" disabled style={{cursor : 'not-allowed'}}><h1>Verify</h1></button>
        }
        if(this.state.showIfCorrect)
        {
            btnDisplay = <button onClick={this.nextQuestionHandler} className="btn btn-success v-button"><h1>Next!</h1></button>
        }
        let u = null;
        if(this.state.showIfCorrect)
        {
            console.log("Inside")
            if(this.state.isCorrect)
                u  = <h1 className="glyphicon glyphicon-ok" style={{color : 'green' , height:'16px' , width : '16px', textAlign : 'center'}}>&#10004;</h1>
            else
                u  = <h1 className="glyphicon glyphicon-remove" style={{color : 'red',textAlign : 'center'}}>&#10007;</h1>                
        }
        if(this.state.loaded)
            x = <h1>No questions</h1>
        if(this.state.questions.length)
        {
            let y = {...this.state.questions[this.state.index]};
            x = (
                <div className="question-box">
                    <div style={{textAlign : "center"}}>
                        <h1 style={{marginBottom : '5vh',fontSize : '1000px !important'}}>
                            Q{this.state.index+1 + ". " +y.question}
                        </h1>
                        <div className="row">
                            {[0,1,2,3].map(item => {
                                if(this.state.showIfCorrect)
                                {
                                    if(this.state.questions[this.state.index].answers[item])
                                        return <h3
                                        style={{cursor : 'not-allowed',backgroundColor : 'green'}}
                                        className="option-div col-md-5" >{y.options[item]}</h3>
                                    else
                                        return <h3
                                        style={{cursor : 'not-allowed',backgroundColor : 'gray'}}
                                        className="option-div col-md-5" >{y.options[item]}</h3>
                                }
                                if(this.state.optionsTicked[item])
                                    return <h3
                                     onClick={()=>this.optClickedHandler(item)}
                                     className="option-div option-ticked col-md-5">{y.options[item]}</h3>
                                else
                                    return <h3
                                    onClick={()=>this.optClickedHandler(item)}
                                    className="option-div col-md-5">{y.options[item]}</h3>
                            })}
                        </div>
                    </div>
                </div>
            );
            
        }
        return(
            <div className="container-fluid" style={{'backgroundColor' : 'lightblue' , 'height' : '92.6vh'}}>
                <div className="score-display d-flex justify-content-end align-items-center">
                    <h1>
                        Score : {this.state.score}
                    </h1>
                </div>
                <div>
                    {x}
                </div>
                <div className="d-flex justify-content-center">
                    {u}
                </div>
                <div className="d-flex justify-content-center">
                    {btnDisplay}
                </div>
                {this.state.completed ? <Redirect to="/standings" /> : null}
            </div>
        );
    }
}

export default Play;