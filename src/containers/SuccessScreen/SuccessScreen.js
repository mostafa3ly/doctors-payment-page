import React from 'react';
import classes from './SuccessScreen.module.css';

const successScreen = (props) => {
    return (
        <div className={classes.Container}>
            <p>Subscription succeeded</p>
            <div>
                <span></span>
            </div>
        </div>
    );
}

export default successScreen;