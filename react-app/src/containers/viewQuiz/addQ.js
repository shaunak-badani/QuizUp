import React from 'react';
import AddQuestion from '../addQuestion';

const addQ = (props) => (
    <div>
        <AddQuestion quizid={props.quizid} mode="add" genre={props.genre} id={props.id} method="post" />
    </div>
);

export default addQ;