import React,{Component,Fragment} from 'react';
import {Link} from 'react-router-dom';  
import './createQuiz.css';

class CreateQuiz extends Component{
    constructor(){
        super();
        this.state = {
            genres : [],
            newId : {},
        }
    }

    groupBy = function(arr,prop) {
        return arr.reduce(function(groups, item) {
            const val = item[prop]
            groups[val] = groups[val] || []
            groups[val].push(item)
            return groups
        }, {})
    }


    componentDidMount(){
        fetch('http://localhost:8080/quizzes')
            .then(res => res.json())
                .then(data => {
                    console.log(data);
                    let x = this.groupBy(data,'genre');
                    let y = {};
                    Object.keys(x).forEach(item => {
                        if(x[item].length===1)
                            y[item] = x[item][0].Q_id + 1;
                        else
                            y[item] = x[item].reduce((el1,el2) => el1.Q_id > el2.Q_id ? el1.Q_id : el2.Q_id) + 1;
                        console.log(x[item]);
                    });
                    this.setState({genres : x , newId :y});
                });
    }

    render(){
        return(
            <Fragment>
                <div className="Genre-Card">
                    <h1>Which genre of quiz do you want to create?</h1>
                    <div style={{"display" :"flex"}}>
                        {Object.keys(this.state.genres).map(item => (
                            <Link key={item} to={"/createQuiz/quiz/"+item+'/'+this.state.newId[item]}>
                                <div className="Question-Card">
                                    <h3>{item}</h3>
                                </div>
                            </Link> 
                ))}
                    </div>
                </div>
                <div className="Genre-Card">
                <h1>Or create your own genre?</h1>
                <div style={{"display" :"flex"}}>
                    <Link to={"/createQuiz/newQuiz/1"}>
                        <div className="Question-Card">
                            <h3>+</h3>
                        </div>
                    </Link> 
                </div>
            </div>
        </Fragment>
        );
    }
}

export default CreateQuiz;