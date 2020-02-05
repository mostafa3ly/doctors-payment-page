import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
    return (
        <div className={classes.Container}>
            <input name={props.name} className={classes.Input} type={props.type}
                value={props.value}
                onChange={props.changed}
                placeholder={props.placeholder} required />
        </div>
    );
}
export default input;