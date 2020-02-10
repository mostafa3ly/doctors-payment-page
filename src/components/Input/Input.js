import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
    return (
        <div className={classes.Container}>
            <input
                name={props.name}
                className={classes.Input}
                type={props.type}
                onChange={props.changed}
                placeholder={props.placeholder}
                maxLength={props.max}
                id={props.id}
                required />
        </div>
    );
}
export default input;