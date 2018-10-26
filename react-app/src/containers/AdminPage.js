import React,{Fragment} from 'react';
import {NavLink,Route,Switch} from 'react-router-dom';
import './AdminPage.css';
import ViewQuiz from './viewQuiz/viewQuiz';
import Quiz from './viewQuiz/Quiz/Quiz';
import EditQuestion from './viewQuiz/editQuestion';
import AddQ from './viewQuiz/addQ';
import AddQuiz from './createQuiz/addQuiz/addQuiz';
import CreateQuiz from './createQuiz/createQuiz';
import DeleteQuiz from './deleteQuiz/deleteQuiz';
import ViewUsers from './viewUsers/viewUsers';
import DeleteUsers from './deleteUsers/deleteUsers';
import WelcomePage from './welcomePage';

const adminPage = (props) => {
    return (
        <Fragment>
            <div className="Cust-Navbar">
                <NavLink to="/" exact className="Nav-Element" activeClassName={"Nav-Active"}>Home</NavLink>
                <NavLink to="/viewQuizzes" className="Nav-Element" activeClassName={"Nav-Active"}>View Quizzes</NavLink>
                <NavLink to="/createQuiz" className="Nav-Element" activeClassName={"Nav-Active"}>Create Quiz</NavLink>
                <NavLink to="/deleteQuiz" className="Nav-Element" activeClassName={"Nav-Active"}>Delete Quiz</NavLink>
                <NavLink to="/viewUsers" className="Nav-Element" activeClassName={"Nav-Active"}> View Users</NavLink>
                <NavLink to="/deleteUsers" className="Nav-Element" activeClassName={"Nav-Active"}>Delete Users</NavLink>
            </div>
            <Switch>
                {/* Defining routes for editing,viewing a quiz */}
                <Route path="/" exact render={() => <WelcomePage>{props.children}</WelcomePage> } />  
                <Route path="/viewQuizzes" exact component={ViewQuiz} />
                <Route path="/viewQuizzes/view/:genre/:id" exact render={({match}) => <Quiz 
                    genre={match.params.genre}
                    id={match.params.id}/>} />
                <Route path="/viewQuizzes/edit/:genre/:quizid/:id" render={({match}) =><EditQuestion quizid={match.params.quizid} id={match.params.id} genre={match.params.genre}/>} />
                <Route path="/viewQuizzes/add/:genre/:id" render={({match}) => <AddQ id={match.params.id} genre={match.params.genre} />} /> 
                {/* Defining routes for creating a quiz */}
                <Route path="/createQuiz" exact component={CreateQuiz} />
                <Route path="/createQuiz/quiz/:genre/:id" render={({match}) => <AddQuiz
                    genre={match.params.genre} 
                    id={match.params.id}/>} />
                <Route path="/createQuiz/newQuiz/:id" render={({match}) => <AddQuiz
                id={match.params.id} />} />
                {/* <Route path="/createquiz/" */}
                <Route path="/deleteQuiz" component={DeleteQuiz} />
                <Route path="/viewUsers" component={ViewUsers} />
                <Route path="/deleteUsers" component={DeleteUsers} />
            </Switch>
        </Fragment>
    )
}

export default adminPage;