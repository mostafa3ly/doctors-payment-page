import React from 'react';
import classes from './Amount.module.css';

const amount = (props) => {
    return (
        <div className={classes.Container}>
            <input onChange={props.changed} value={props.value}
                name='amount' className={classes.Amount}
                placeholder='Amount' type='number' required />
            <div className={classes.Currency}>EGP</div>
        </div>
    )
}

export default amount;