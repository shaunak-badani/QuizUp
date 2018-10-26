import React,{Component} from 'react';

class QuizAttempt extends Component {
    constructor(){
        super();
        this.state = {
            quizA : []
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/userPoints/'+this.props.username)
            .then(res => res.json())
                .then(data => this.setState({quizA : data}));
    }

    render(){
        if(!this.state.quizA.length)
            return(<h1>Loading</h1>)
        let x = this.state.quizA.map(item=>(
            <tr>
                <td>{item.QId}</td>
                <td>{item.Genre}</td>
                <td>{item.Points}</td>
            </tr>
        ))
        return(
            <div className="div-table">
                <h1>Your Attempted Quizzes : </h1>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <th>Quiz Id</th>
                        <th>Genre</th>
                        <th>Points</th>
                    </thead>
                    <tbody>
                        {x}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default QuizAttempt;