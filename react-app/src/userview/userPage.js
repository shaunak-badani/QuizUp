import React,{Component,Fragment} from 'react';
import {NavLink,Route} from 'react-router-dom';
import PlayQuiz from './playQuiz/playQuiz';
import Play from './playQuiz/play';
import QuizAttempt from './quizzesAttemted/quizzesAttempted';
import GlobLeaderboard from './gLeaderboard/gLeaderboard';
import GenreStandings from './genreStandings/genreStandings';
import UserWelcome from './userWelcome';

class UserPage extends Component {
    render(){
        return(
            <Fragment>
                <div className="Cust-Navbar">
                    <NavLink to="/" exact className="Nav-Element" activeClassName={"Nav-Active"}>Home</NavLink>
                    <NavLink to="/playQuiz" className="Nav-Element" activeClassName={"Nav-Active"}>Play Quiz</NavLink>
                    <NavLink to="/myQuizzes" className="Nav-Element" activeClassName={"Nav-Active"}>Quizzes Attempted</NavLink>
                    <NavLink to="/standings" className="Nav-Element" activeClassName={"Nav-Active"}>Global leaderboard</NavLink>
                    <NavLink to="/genreStandings" className="Nav-Element" activeClassName={"Nav-Active"}>Standings Across Genres</NavLink>
                </div>
                <Route path="/" exact render={()=><UserWelcome username={this.props.username} >{this.props.children} </UserWelcome>} />
                <Route path="/playQuiz" exact render={()=><PlayQuiz username={this.props.username} /> } />
                <Route path="/playQuiz/play/:genre/:id" render={({match}) => <Play username={this.props.username} id={match.params.id} genre={match.params.genre}/>} /> 
                <Route path="/myQuizzes" render={({match}) =><QuizAttempt username={this.props.username} /> } />
                <Route path="/standings" component={GlobLeaderboard}/>
                <Route path="/genreStandings" component={GenreStandings} />
            </Fragment>

        )
    }
}

export default UserPage;