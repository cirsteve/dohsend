import React from 'react'
import { connect } from 'react-redux';
import App from './app.jsx';
import { updateField, submitTrx, TrxReceived } from '../actions/index';

const stateToProps = (state) => {
    console.log('fdgfdgd: ', state);
    return {
        formData: { ...state.formData },
        pendingTrxs: state.pendingTrxs,
        pendingTrx: state.pendingTrx,
        connectedAddr: state.web3.eth.accounts
    };
}

const dispatchToProps = (dispatch) => {
    return {
        updateField: (field, value) => dispatch(updateField(field, value)),
        submitTrx: (to, amt) => dispatch(submitTrx(to, amt))
    }
}

export default connect(
    stateToProps,
    dispatchToProps
)(App);
