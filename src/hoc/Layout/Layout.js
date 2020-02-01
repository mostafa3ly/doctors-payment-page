import React, { Component } from 'react';
import Header from '../../components/UI/Header/Header';
import SubscriptionForm from '../../containers/SubscriptionForm/SubscriptionForm';
import Logo from '../../components/UI/Logo/Logo';

class Layout extends Component {

    render() {
        return (
            <React.Fragment>
                <Logo/>
                <Header />
                <SubscriptionForm />
            </React.Fragment>
        )
    }
}

export default Layout;