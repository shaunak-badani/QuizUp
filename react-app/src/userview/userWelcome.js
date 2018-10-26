import React from 'react';
import KBC from './kbc_logo.jpg';
import './userWelcome.css';

const userWelcome = (props) => (
    <div className="mai">
        <div className="bs">
            <h1>Welcome to the game Kaun Banega Tera Pati, {props.username} !</h1>
            <h2>Rules:</h2>
            <ul>
                <li><h4>In this game, we ask you to answer a set of questions</h4></li>
                <li><h4>You can choose from a wide  variety of genres,ranging from the F.R.I.E.N.D.S to Science.</h4></li>
                <li><h4>Answer correctly to win as many points as possible!</h4></li>
                <li><h4>The more points you score, the closer you get to actually scoring.</h4></li>
                <li><h4>If you make it to the top of the leaderboard, you get to go on a date with this beautiful woman!<sup>*</sup></h4></li>
                <li><h4>If she is already taken, then its probably because someone took this quiz before you, and won!</h4></li>
                <li><h4>But don't worry! We keep updating the woman on the right every 154 years, so if you live long enough, please do return! </h4></li>
                <li><h4>Till then, keep playing for that top position on the leaderboard! The competition is on!</h4></li>                
            </ul>
            <div className="d-flex justify-content-center btn-logout">
                {props.children}
            </div>
            <p>*Terms And Conditions Apply</p>
        </div>
        <div className="bg-image">
            <img src={KBC} alt="KBT Logo" className="KBT" />
        </div>
    </div>
);

export default userWelcome;