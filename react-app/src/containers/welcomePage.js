import React from 'react';
import './welcomePage.css';

const welcomePage = (props) => (
    <div className="main-background">
        <div className="image-space">
        </div>  
        <div className="data-bs">
            <h1>Hello Admin!</h1>   
            <h4>This page is designed so that you can perform the following operations :</h4>
            <ul>
                <li>Add a quiz</li>
                <li>Delete a quiz</li>
                <li>Create a quiz</li>
                <li>Add a question in a quiz</li>
                <li>Delete a question in a quiz</li>
                <li>View a list of users</li>
                <li>Delete any user to make him realize your power</li>
                <li>And logout too</li>
                <div className="d-flex justify-content-center btn-logout">
                    {props.children}
                </div>
            </ul>
        </div>
    </div>
);

export default welcomePage;