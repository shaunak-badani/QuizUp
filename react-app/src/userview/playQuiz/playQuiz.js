import React,{Component,Fragment} from 'react';
import GenreDisplay from './GenreDisplay/GenreDisplay';
import './playQuiz.css';

class PlayQuiz extends Component{
    constructor(){
        super();
        this.state = {
            quizzes : {},
            loaded : false
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
        this.setState({loaded : true});
        
    }

    render(){
        console.log(this.state.quizzes);
        let q = null;
        if(this.state.quizzes && this.state.loaded)
        {
            q = Object.keys(this.state.quizzes).map(item => <GenreDisplay
                 genreName = {item}
                 genreQuestions = {this.state.quizzes[item]} />);
        }
        return(
            <Fragment>
                <h1 className="p-quiz-h">Which Quiz do you want to play today?</h1>
                <h1>
                    {q}
                </h1>
            </Fragment>
        )
        
    }
}

export default PlayQuiz;


// componentDidMount(){
//     fetch('http://localhost:8080/quizzes')
//         .then(response => response.json())
//             .then(data => {
//                 const groupedElements = this.groupBy(data,'genre')
//                 this.setState({quizzes : groupedElements})
//             })
// }

// render(){
//     let q = Object.keys(this.state.quizzes).map(item => (
//         <GenreDisplay   
//             genreName={item}
//             genreQuestions={this.state.quizzes[item]}
//         />
//         ));
//     return(
//         <h1>
//             {q}
//         </h1>
//     )
// }