import React from 'react';
import AddQuestion from '../addQuestion';

const editQuestion = (props) =>(        
        <div>
            <AddQuestion mode="edit" genre = {props.genre} quizid = {props.quizid} id={props.id} method="put"/>
        </div>
);

export default editQuestion;