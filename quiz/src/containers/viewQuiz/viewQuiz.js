import React,{Component} from 'react';
import GenreDisplay from './GenreDisplay/GenreDisplay';

class ViewQuiz extends Component {
    constructor(){
        super();
        this.state = {
            quizzes : {}
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
            .then(response => response.json())
                .then(data => {
                    const groupedElements = this.groupBy(data,'genre')
                    this.setState({quizzes : groupedElements})
                })
    }

    render(){
        let q = Object.keys(this.state.quizzes).map(item => (
            <GenreDisplay   
                genreName={item}
                genreQuestions={this.state.quizzes[item]}
            />
            ));
        return(
            <h1>
                {q}
            </h1>
        )
    }
}

export default ViewQuiz;