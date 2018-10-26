import React from 'react';
import './Spinner.css';

const spinner = (props) => (
    <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default spinner;