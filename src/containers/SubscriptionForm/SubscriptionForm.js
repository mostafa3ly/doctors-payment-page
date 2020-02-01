import React, { Component } from 'react';
import Input from '../../components/Input/Input';
import classes from './SubscriptionForm.module.css';
import Amount from '../../components/Amount/Amout';

class SubscriptionForm extends Component {

    render() {
        return (
            <form className={`container ${classes.Form}`}>
                <div className="row">
                    <div className='col-12'>
                    <Input placeholder="Customer Name" type="text" />
                    </div>
                </div>
                <div className="row">
                    <div className='col-12'>
                    <Input placeholder="Name on Card" type="text" />
                    </div>
                </div>
                <div className="row">
                    <div className='col-12'>
                    <Input placeholder="Card Number" type="text" />
                    </div>
                </div>
                <div className="row">
                    <div className='col-6 col-md-12'>
                    <Input placeholder="Expiry Date" type="text" />
                    </div>
                    <div className='col-6 col-md-12'>
                    <Input placeholder="CVC" type="text" />
                    </div>
                </div>

                <p className={classes.SecurityNote}>For your security; we do not save any of your credit/debit card details</p>
                <Amount />
                <button className={classes.Submit}>Confirm</button>
            </form>
        )
    }
}

export default SubscriptionForm;