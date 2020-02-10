import React, { Component } from 'react';
import Input from '../../components/Input/Input';
import classes from './SubscriptionForm.module.css';
import Amount from '../../components/Amount/Amout';
import SeenaAxios from '../../axios-seena';
import Loader from '../../components/UI/Loader/Loader'
import { sha256 } from 'js-sha256';


class SubscriptionForm extends Component {
    state = {
        validEmail: false,
        email: '',
        subscription: {
            customer_name: '',
            card_holder_name: '',
            card_number: '',
            expiry_date: '',
            card_security_code: '',
            amount: ''
        },
        payfort: {
            accessCode: 'xg7kR0Ek8rfOsXDE5AYz',
            language: 'en',
            merchant_identifier: 'UIdDWodS',
            merchant_reference: '',
            return_url: window.location.href,
            service_command: 'TOKENIZATION',
            pass: '$2y$10$FD548sbei',
        },
        expiry_date_month: '',
        expiry_date_year: '',
        order_number: this.getRandomPattern() + '_' + Date.now(),
        token: '',
        loading: false,
        error: false,
        subscriptionLoading: false,
        subscriptionSuccess: false,
        errorMessage: '',
    }

    getRandomPattern() {
        let pattern = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 8; i++) {
            pattern += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return pattern;
    }

    emailChangedHandler = (event) => {
        this.setState({ email: event.target.value });
    }

    inputChangedHandler = (event) => {
        let subscription = { ...this.state.subscription };
        subscription[event.target.name] = event.target.value;
        this.setState({ subscription: subscription });
    }

    amountChangedHandler = (event) => {
        let payfort = { ...this.state.payfort };
        payfort.merchant_reference = `${this.state.order_number}_${this.state.user_id}_${event.target.value}`;
        this.setState({ payfort: payfort });
    }

    nameChangedHandler = (event) => {
        let subscription = { ...this.state.subscription };
        subscription.customer_name = event.target.value;
        this.setState({ subscription: subscription });
    }

    expiryDateChangedHandler = (event) => {
        let value = event.target.value;
        if (event.target.id === 'expiry_date_month') {
            if (value.length === 1 && Number(value) < 10) {
                value = '0' + value;
            }
        }
        this.setState({ [event.target.id]: value });
    }

    validateEmailHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true, error: false });
        SeenaAxios.post('email/confirm', { email: this.state.email })
            .then((response) => {
                let data = response.data.Response;
                this.setState({
                    validEmail: true,
                    user_id: data.id,
                    name: data.name,
                    loading: false,
                });

            }, (error) => {
                this.setState({ loading: false, error: true, errorMessage: error.message });
            })
    }

    getSignature = () => {
        let payfortParams = this.state.payfort;
        let signature =
            payfortParams.pass
            + `access_code=${payfortParams.accessCode}`
            + `language=${payfortParams.language}`
            + `merchant_identifier=${payfortParams.merchant_identifier}`
            + `merchant_reference=${payfortParams.merchant_reference}`
            + `return_url=${payfortParams.return_url}`
            + `service_command=${payfortParams.service_command}`
            + payfortParams.pass;

        return sha256(signature);
    }

    componentDidMount() {

        let search = window.location.search;
        let params = new URLSearchParams(search);
        let response_code = params.get('response_code');
        let merchant_reference = params.get('merchant_reference');
        let token_name = params.get('token_name');
        if (response_code) {
            if (response_code === "18000") {
                this.setState({ subscriptionLoading: true });
                let customer_name = localStorage.getItem('customer_name');
                localStorage.removeItem("customer_name");
                SeenaAxios.post('doctor/subscription',
                    {
                        user_id: merchant_reference.split('_')[2],
                        amount: merchant_reference.split('_')[3],
                        token_name: token_name,
                        customer_name: customer_name
                    })
                    .then((response) => {
                        const code = response.data.Error.code;
                        if (code === 21) {
                            window.location.replace(response.data.Response);
                        }
                        else if (code === 20) {
                            this.props.history.push("/success");
                        }
                    }, (error) => {
                        this.setState({ error: true, errorMessage: 'Invalid credentials' });
                    })
            }
            else {
                this.setState({
                    error: true,
                    errorMessage: 'Invalid credentials',
                    validEmail: true,
                    user_id: merchant_reference.split('_')[2]
                });
            }
        }

    }

    subscriptionSubmitHandler = (event) => {
        event.preventDefault();
        localStorage.setItem('customer_name', this.state.subscription.customer_name);
        this.setState({ loading: true, error: false });
        event.target.submit();
    }

    render() {
        let form = null;
        if (this.state.validEmail) {
            let payfortParams = this.state.payfort;
            form = (

                <form method="post" action="https://sbcheckout.payfort.com/FortAPI/paymentPage"
                    id="credit-modal-form" name="subscription-form" onSubmit={this.subscriptionSubmitHandler}>

                    <input type="hidden" name="service_command" value={payfortParams.service_command} />
                    <input type="hidden" name="access_code" value={payfortParams.accessCode} />
                    <input type="hidden" name="merchant_identifier" value={payfortParams.merchant_identifier} />
                    <input type="hidden" name="merchant_reference" value={payfortParams.merchant_reference} />
                    <input type="hidden" name="language" value={payfortParams.language} />
                    <input type="hidden" name="signature" value={this.getSignature()} />
                    <input type="hidden" name="remember_me" value="YES" />
                    <input type="hidden" name="return_url" value={payfortParams.return_url} />
                    <input type="hidden" name="expiry_date" value={this.state.expiry_date_year + this.state.expiry_date_month} />

                    <div className="row">
                        <div className='col-12'>
                            <Input
                                placeholder="Customer Name"
                                type="text"
                                changed={this.nameChangedHandler} />
                        </div>
                    </div>

                    <div className="row">
                        <div className='col-12'>
                            <Input
                                name='card_holder_name'
                                placeholder="Name on Card"
                                type="text"
                                max='50'
                                changed={this.inputChangedHandler} />
                        </div>
                    </div>

                    <div className="row">
                        <div className='col-12'>
                            <Input
                                name='card_number'
                                placeholder="Card Number"
                                type="number"
                                pattern="[0-9]{1,15}"
                                max='19'
                                changed={this.inputChangedHandler} />
                        </div>
                    </div>

                    <div className="row">
                        <div className='col-6 col-md-3 pr-1'>
                            <Input
                                placeholder="MM"
                                type="text"
                                max='2'
                                id="expiry_date_month"
                                changed={this.expiryDateChangedHandler} />
                        </div>

                        <div className='col-6 col-md-3 px-1'>
                            <Input
                                placeholder="YY"
                                type="text"
                                max='2'
                                id="expiry_date_year"
                                changed={this.expiryDateChangedHandler} />
                        </div>

                        <div className='col-md-6'>
                            <Input
                                name='card_security_code'
                                placeholder="CVC"
                                max='3'
                                pattern="[0-9]{1,15}"
                                changed={this.inputChangedHandler} />
                        </div>
                    </div>

                    <p className={classes.SecurityNote}>For your security; we do not save any of your credit/debit card details</p>
                    <Amount changed={this.amountChangedHandler} />
                    {this.state.loading ? <Loader /> : null}
                    {this.state.error ? <p className={classes.Error}>{this.state.errorMessage}</p> : null}
                    <input type='submit' value='Confirm' className={`my-2 ${classes.Submit}`} />
                </form>
            )
        }
        else {
            if (this.state.subscriptionLoading) {
                form = (<Loader />);
            }
            else {
                form = (
                    <form onSubmit={this.validateEmailHandler}>
                        <div className="row">
                            <div className='col-12'>
                                <Input name="email" placeholder="Email" type="email" value={this.state.email} changed={this.emailChangedHandler} />
                                {this.state.loading ? <Loader /> : null}
                                {this.state.error ? <p className={classes.Error}>{this.state.errorMessage}</p> : null}
                                <input className={`my-4 ${classes.Submit}`} value="Confirm" type='submit' />
                            </div>
                        </div>
                    </form>
                )
            }
        }

        return (
            <div className={`container ${classes.Form}`}>
                {form}
            </div>);
    }
}

export default SubscriptionForm;