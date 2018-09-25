import React,{Fragment} from 'react';
import {NavLink,Route,Switch} from 'react-router-dom';
import './AdminPage.css';
import ViewQuiz from './containers/viewQuiz/viewQuiz';
import Quiz from './containers/Quiz/Quiz';
import EditQuestion from './containers/viewQuiz/editQuestion';
import AddQ from './containers/viewQuiz/addQ';
import Spinner from './containers/viewQuiz/Spinner';

const adminPage = () => {
    return (
        <Fragment>
            <div className="Cust-Navbar">
                <NavLink to="/viewQuizzes" className="Nav-Element" activeClassName={"Nav-Active"}>View Quizzes</NavLink>
                <NavLink to="/" className="Nav-Element" >Create Quiz</NavLink>
                <NavLink to="/" className="Nav-Element">Delete Quiz</NavLink>
                <NavLink to="/" className="Nav-Element">View Users</NavLink>
                <NavLink to="/" className="Nav-Element">Delete Users</NavLink>
                <NavLink to="/" className="Nav-Element">Logout</NavLink>
            </div>
            <Switch>
                {/* <Route path="/" exact component={AddQuestion}></Route> */}
                <Route path="/viewQuizzes" exact component={ViewQuiz} />
                <Route path="/viewQuizzes/view/:genre/:id" exact render={({match}) => <Quiz 
                    genre={match.params.genre}
                    id={match.params.id}/>} />
                <Route path="/viewQuizzes/edit/:id" render={({match}) =><EditQuestion id={match.params.id} />} />
                <Route path="/viewQuizzes/add/:genre/:id" render={({match}) => <AddQ genre={match.params.genre} id={match.params.id} />} /> 
                <Route path="/seeSpinner" component={Spinner} /> 
            </Switch>
        </Fragment>
    )
}

export default adminPage;