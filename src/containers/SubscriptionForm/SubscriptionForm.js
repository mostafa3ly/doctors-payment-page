import React, { Component } from 'react';
import Input from '../../components/Input/Input';
import classes from './SubscriptionForm.module.css';
import Amount from '../../components/Amount/Amout';
import SeenaAxios from '../../axios-seena';
import Loader from '../../components/UI/Loader/Loader'
import axios from 'axios';
import { sha256 } from 'js-sha256';


class SubscriptionForm extends Component {

    state = {
        validEmail: true,
        email: '',
        subscription: {
            customerName: '',
            nameOnCard: '',
            cardNumber: '',
            exDate: '',
            cvc: '',
            amount: ''
        },
        payfort: {
            service_command: 'TOKENIZATION',
            accessCode: 'xg7kR0Ek8rfOsXDE5AYz',
            merchant_identifier: 'UIdDWodS',
            language: 'en'
        },
        loading: false,
        error: false,
        errorMessage: '',
    }

    emailChangedHandler = (event) => {
        this.setState({ email: event.target.value });
    }

    inputChangedHandler = (event) => {
        let subscription = { ...this.state.subscription };
        subscription[event.target.name] = event.target.value;
        this.setState({ subscription: subscription });
    }

    validateEmailHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true, error: false });
        SeenaAxios.post('email/confirm', { email: this.state.email })
            .then((response) => {
                let data = response.data.Response;
                this.setState({ validEmail: true, id: data.id, name: data.name, loading: false });
            }, (error) => {
                this.setState({ loading: false, error: true, errorMessage: error.message });
            })
    }

    getSignature = () => {
        let signature =
            '$2y$10$FD548sbei'
            + 'access_code=' + 'xg7kR0Ek8rfOsXDE5AYz'
            + 'language=' + 'en'
            + 'merchant_identifier=' + 'UIdDWodS'
            + 'merchant_reference=' + 'yZGatuU7318jI1Au'
            + 'service_command=' + 'TOKENIZATION'
            + '$2y$10$FD548sbei';
        return sha256(signature);
    }

    subscriptionSubmitHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true, error: false });
        let signature = this.getSignature();
        let params = {
            service_command: 'TOKENIZATION',
            accessCode: 'xg7kR0Ek8rfOsXDE5AYz',
            merchant_identifier: 'UIdDWodS',
            merchant_reference: 'yZGatuU7318jI1Au',
            language: 'en',
            expiry_date: this.state.subscription.exDate,
            card_number: this.state.subscription.cardNumber,
            card_security_code: this.state.subscription.cvc,
            signature: signature
        }

        let bodyFormData = new FormData();
        for (let [key, value] of Object.entries(params)) {
            bodyFormData.set(key, value);
        }
        for (var pair of bodyFormData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        axios.post('https://sbcheckout.PayFort.com/FortAPI/paymentPage', bodyFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(function (response) {
            console.log(response);
            this.setState({ loading: false });
        }, (error) => {
            console.log(error);
            this.setState({ loading: false, error: true });
        });

    }

    render() {
        let form = null;
        let submitHandler = null;
        if (this.state.validEmail) {
            submitHandler = this.subscriptionSubmitHandler;
            form = (
                <React.Fragment>
                    <div className="row">
                        <div className='col-12'>
                            <Input name='customerName' placeholder="Customer Name" type="text"
                                value={this.state.subscription.customerName} changed={this.inputChangedHandler} />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-12'>
                            <Input name='nameOnCard' placeholder="Name on Card" type="text"
                                value={this.state.subscription.nameOnCard} changed={this.inputChangedHandler} />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-12'>
                            <Input name='cardNumber' placeholder="Card Number" type="number"
                                value={this.state.subscription.cardNumber} changed={this.inputChangedHandler} />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-md-6'>
                            <Input name='exDate' placeholder="Expiry Date" type="number"
                                value={this.state.subscription.exDate} changed={this.inputChangedHandler} />
                        </div>
                        <div className='col-md-6'>
                            <Input name='cvc' placeholder="CVC" type="number"
                                value={this.state.subscription.cvc} changed={this.inputChangedHandler} />
                        </div>
                    </div>

                    <p className={classes.SecurityNote}>For your security; we do not save any of your credit/debit card details</p>
                    <Amount value={this.state.subscription.amount} changed={this.inputChangedHandler} />
                    {this.state.loading ? <Loader /> : null}
                    {this.state.error ? <p className={classes.Error}>{this.state.errorMessage}</p> : null}
                    <button className={`my-2 ${classes.Submit}`}>Confirm</button>
                </React.Fragment>
            )
        }
        else {
            submitHandler = this.validateEmailHandler;
            form = (
                <div className="row">
                    <div className='col-12'>
                        <Input name="email" placeholder="Email" type="email" value={this.state.email} changed={this.emailChangedHandler} />
                        {this.state.loading ? <Loader /> : null}
                        {this.state.error ? <p className={classes.Error}>{this.state.errorMessage}</p> : null}
                        <button className={`my-4 ${classes.Submit}`}>Confirm</button>
                    </div>
                </div>
            )
        }

        return (
            <form className={`container ${classes.Form}`} onSubmit={submitHandler}>
                {form}
            </form>);
    }
}

export default SubscriptionForm;