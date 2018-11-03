import React, { Component } from 'react';

import Aukz from '../../hoc/Aukz/Aukz';
import Tortilla from '../../components/Tortilla/Tortilla';
import BuildControls from '../../components/Tortilla/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderReview from '../../components/Tortilla/OrderReview/OrderReview';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'



const ING_COST = {
    salad: 0.5,
    dressing: 0.5,
    meat: 0.9,    //high quality kebab meat 
    tomato: 0.6,
    onion: 0.3
}

class TortillaBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalCost: 2.30,
        orderable: false,
        reviewing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get("https://react-tf.firebaseio.com/ingredients.json")
            .then(response => {
                this.setState({ingredients: response.data});
                
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    updateOrderableState(ingredients){
        const total = Object.keys(ingredients)
            .map(ingKey => {
                return ingredients[ingKey]
            })
            .reduce((total, el) => {
                return total + el
            }, 0)
            this.setState({orderable: total > 0})
    }

    addIngHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updCount = oldCount + 1
        const updIngredients = {
            ...this.state.ingredients
        }
        updIngredients[type] = updCount
        const costAddition = ING_COST[type]
        const oldCost = this.state.totalCost
        const newCost = oldCost + costAddition
        this.setState({
            totalCost: newCost, 
            ingredients: updIngredients
        })
        this.updateOrderableState(updIngredients)
        }
    

    removeIngHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0){
            return
        }
        const updCount = oldCount - 1
        const updIngredients = {
            ...this.state.ingredients
        }
        updIngredients[type] = updCount
        const costDeduction = ING_COST[type]
        const oldCost = this.state.totalCost
        const newCost = oldCost - costDeduction
        this.setState({
            totalCost: newCost, 
            ingredients: updIngredients
        })
        this.updateOrderableState(updIngredients)
    }

    reviewHandler = () => {
        this.setState({
            reviewing: true
        })
    }

    reviewOutHandler = () => {
        this.setState({
            reviewing: false
        })
    }

    reviewContinueHandler = () => {
        // alert('You have selected continue.')
        this.setState({
            loading: true
        })
        const order = {
            ingredients: this.state.ingredients,
            cost: this.state.totalCost,
            customer: {
                name: 'Roland Royce',
                address: {
                    street: 'Test street',
                    zipcode: 123456,
                    country: 'Roman Empire'
                },
                email: 'royce@gmail.com'
            },
            deliveryMethod: 'Express One'
        };
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({
                    loading: false,
                    reviewing: false,
                })
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    reviewing: false
                })
            });

    }

    render() {
        const disabledInf = {
            ...this.state.ingredients
        }
        for (let key in disabledInf){
            disabledInf[key] = disabledInf[key] <= 0
        }
        let orderReview = <Spinner />;
        let tortilla = this.state.error ? <p>Ingredients were unable to load.</p> : <Spinner />;
        
        if (this.state.ingredients) {
            tortilla = <Aukz>
                            <Tortilla ingredients={this.state.ingredients} />
                            <BuildControls 
                                ingAdded={this.addIngHandler}
                                ingRemoved={this.removeIngHandler}
                                disabled={disabledInf}
                                cost={this.state.totalCost}
                                ordered={this.reviewHandler}
                                orderable={this.state.orderable}/>
                        </Aukz>;
            orderReview = <OrderReview  ingredients={this.state.ingredients}
                                        reviewCanceled={this.reviewOutHandler}
                                        reviewContinue={this.reviewContinueHandler} 
                                        totalCost={this.state.totalCost.toFixed(2)}/>;   
        }
        if (this.state.loading){
            orderReview = <Spinner />;
        }
                        
        return (
            <Aukz>
                <Modal disp={this.state.reviewing} modalOut={this.reviewOutHandler}>  
                {orderReview}
                </Modal>
                {tortilla}
            </Aukz>
        );
    }
}


export default withErrorHandler(TortillaBuilder, axios);