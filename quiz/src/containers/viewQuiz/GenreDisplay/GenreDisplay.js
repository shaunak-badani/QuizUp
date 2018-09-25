import React from 'react';
import {Link} from 'react-router-dom';
import './GenreDisplay.css';

const genreDisplay = (props) => {
    props.genreQuestions.sort((el1,el2) => el1.Q_id > el2.Q_id);
    return (
        <div className="Genre-Card">
            <h1>{props.genreName}</h1>
            <div style={{"display" :"flex"}}>
                {props.genreQuestions.map(item => (
                    <Link to={"/viewQuizzes/view/"+item.genre+"/"+item.Q_id}>
                        <div className="Question-Card">
                            <h3>{item.Q_id}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default genreDisplay;