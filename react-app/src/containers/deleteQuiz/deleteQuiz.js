import React,{Component} from 'react';

class DeleteQuiz extends Component{
    constructor(){
        super()
        this.state = {
            quizzes : []
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/quizzes')
            .then(res => res.json())
            .then(data => this.setState({quizzes : data}));
    }

    qDeleteHandler = (i,q_i,g) => {
        fetch('http://localhost:8080/deleteQuiz/'+g+'/'+q_i,{
            method : 'DELETE'
        })
        .then(res=>res.json())
            .then(data => {
                console.log(data);
                
            });
        let x = this.state.quizzes.filter(item => item.Id !== i);
        console.log(x);
        this.setState({quizzes : x});
    }

    render(){
        let x = this.state.quizzes.map(item => (
            <tr key={item.id}>
              <td>{item.Id}</td>
              <td>{item.Q_id}</td>
              <td>{item.genre}</td>
              <td>              
                  <button className="btn btn-danger" onClick={() => this.qDeleteHandler(item.Id,item.Q_id,item.genre)} >
                    Delete Quiz
                  </button>
              </td>
            </tr>
        ));
    
        return(
            <div className="div-table">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>Id</td>
                            <td>Quiz Id</td>
                            <td>Quiz Genre</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {x}
                    </tbody>
                </table>
            </div>
        )        
    }
}

export default DeleteQuiz;