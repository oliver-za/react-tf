import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutReview from '../../components/Order/CheckoutReview/CheckoutReview';
import ContactData from './ContactData/ContactData';


class Checkout extends Component {



    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        let smmry = <Redirect to="/" />
        if (this.props.ings) {
            smmry = (
                <div>
                    <CheckoutReview ingredients={this.props.ings}
                                    checkoutCancelled={this.checkoutCancelledHandler}
                                    checkoutContinued={this.checkoutContinuedHandler}  />
                    <Route path={this.props.match.path + '/contact-data'} 
                                    component={ContactData} />
                </div>
            );
        } 
        return smmry
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients
    }
}

export default connect(mapStateToProps)(Checkout);