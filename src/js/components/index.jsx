import React from 'react'
import { connect } from 'react-redux';
import Container from './app.jsx';
import { updateField, submitTrx, TrxReceived, getTrxsForAddr, claimTrx } from '../actions/index';

const stateToProps = (state) => {
    console.log('fdgfdgd: ', state);
    const connectedAddr = web3.eth.accounts[0];

    return {
        formData: { ...state.formData },
        pendingTrxs: state.pendingTrxs,
        pendingTrx: state.pendingTrx,
        trxsCreated: state.trxsCreated,
        trxsReceived: state.trxsReceived,
        app: state.App,
        connectedAddr,
        addrBalance: web3.fromWei(parseInt(web3.eth.getBalance(connectedAddr), 10))
    };
}

const dispatchToProps = (dispatch) => {
    return {
        updateField: (field, value) => dispatch(updateField(field, value)),
        submitTrx: (app, to, amt, account) => dispatch(submitTrx(app, to, amt, account)),
        getTrxsForAddr: (app, addr) => dispatch(getTrxsForAddr(app, addr)),
        claimTrx: (app, id, account) => dispatch(claimTrx(app, id, account))
    };
}

export default connect(
    stateToProps,
    dispatchToProps
)(Container);
