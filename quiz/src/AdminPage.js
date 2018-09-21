import React,{Fragment} from 'react';
import {NavLink,Route,Switch} from 'react-router-dom';
import AddQuestion from './containers/addQuestion';
import './AdminPage.css';

const adminPage = () => {
    return (
        <Fragment>
            <div className="Cust-Navbar">
                <NavLink to="/" className="Nav-Element">View Quiz</NavLink>
                <NavLink to="/" className="Nav-Element">Create Quiz</NavLink>
                <NavLink to="/" className="Nav-Element">Delete Quiz</NavLink>
                <NavLink to="/" className="Nav-Element">View Users</NavLink>
                <NavLink to="/" className="Nav-Element">Delete Users</NavLink>
                <NavLink to="/" className="Nav-Element">Logout</NavLink>
            </div>
            <Switch>
                <Route path="/" component={AddQuestion}></Route>
            </Switch>
        </Fragment>
    )
}

export default adminPage;