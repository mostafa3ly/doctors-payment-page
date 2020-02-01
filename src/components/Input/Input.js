import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
    return (
        <div className={classes.Container}>
            <input className={classes.Input} type={props.type} placeholder={props.placeholder} required/>
        </div>
    );
}
export default input;