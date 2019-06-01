import React,{Component,Fragment} from 'react';
import {Redirect} from 'react-router-dom';

class AddQuiz extends Component {
    constructor(){
        super();
        this.state = {
            form : {
                Q_id : 1,
                Genre : "",
            },
            quizzes : [],
            genreNameError : null,
            addedQuiz : false
        }
    }

    componentDidMount(){
        if(!this.props.genre){
            fetch('http://localhost:8080/quizzes')
                .then(res => res.json())
                    .then(data => this.setState({quizzes : data})); 
        }
        let y = {...this.state.form};
        y['Q_id'] = Number(this.props.id);
        if(this.props.genre)
            y['Genre'] = this.props.genre
        this.setState({form : y})
    }

    addQuizHandler = () => {
        if(this.props.genre && this.props.genreNameError)
            return
        if(!this.state.form.Genre)
        {
            this.setState({error : "Genre cannot be null"});
            return
        }
        console.log(this.state.form);
        console.log(JSON.stringify(this.state.form));
        fetch('http://localhost:8080/addQuiz',{
            method : 'POST',
            body : JSON.stringify(this.state.form)
        })
            .then(res => res.json())
                .then(data => {
                    console.log(data)}); //Making sure there are no Uncaught Promises
        this.setState({addedQuiz : true});
        
    }

    genreChangeHandler = (event) => {
        let x = {...this.state.form};
        if(!this.props.genre)
        {
            let y = this.state.quizzes.filter(item => item.genre === event.target.value).length;
            if(y)
                this.setState({genreNameError : "Sorry, this genre already exists. Please select another genre"});
            else
                this.setState({genreNameError : null});
        }
        x['Genre'] = event.target.value;
        this.setState({form : x}); 
    }

    render(){
        let u = null
        let q = <input type="text" placeholder="Type any genre :" className="form-control" onChange={this.genreChangeHandler} />;
        if(this.props.genre)
            q = <input type="text" disabled className="form-control inp-disabled" value={this.props.genre} /> 
        if(this.state.quizAdded)    
            q = <input type="text" disabled className="form-control inp-disabled" value={this.state.form.Genre} /> 
        if(this.state.addedQuiz)
          u = <Redirect to={"/viewQuizzes"} />
        let x = null;
        if(!this.props.genre)
            x = this.state.genreNameError;

        return(
            <Fragment>
                <div className="Form">
                    <form className="Form">
                        <label htmlFor='genre'>Genre:</label>
                        {q} 
                        {x}
                        <hr />
                        <button onClick={this.addQuizHandler} className="btn btn-success">Add Quiz!</button>
                    </form>
                </div>
                {u}
            </Fragment>
        );
    }
};

export default AddQuiz;