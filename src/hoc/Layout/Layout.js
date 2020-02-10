import React, { Component } from 'react';
import Header from '../../components/UI/Header/Header';
import SubscriptionForm from '../../containers/SubscriptionForm/SubscriptionForm';
import SuccessScreen from '../../containers/SuccessScreen/SuccessScreen';
import Logo from '../../components/UI/Logo/Logo';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

class Layout extends Component {

    render() {
        return (
            <BrowserRouter>
                <Logo />
                <Header />
                <Switch>
                    <Route path='/success' component={SuccessScreen} />
                    <Route path='/' component={SubscriptionForm} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Layout;