import React from 'react';
import classes from './Amount.module.css';

const amount = (props) => {
    return (
        <div className={classes.Container}>
                <div className={classes.Amount}>Amount</div>
                <div className={classes.Currency}>EGP</div>
        </div>
    )
}

export default amount;