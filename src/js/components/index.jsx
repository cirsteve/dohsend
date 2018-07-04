import React from 'react'
import { connect } from 'react-redux';
import Container from './app.jsx';
import { updateField, createBalance, TrxReceived, getBalancesForAddr, claimBalance, addToBalance, toggleShowActive, getAcctBalance, getGasPrice } from '../actions/index';

async function getBalance (addr) {
    const balance = await web3.eth.getBalance(addr);
    return balance;
};

const stateToProps = (state) => {
    const connectedAddr = web3.eth.accounts[0];
    const balances = state.showActive ?
        Object.values(state.balances).filter(b => b.amt != 0) :
        Object.values(state.balances);


    return {
        formData: { ...state.formData },
        loadingBalances: state.loading.balances,
        pendingTransaction: state.pendingTransaction,
        app: state.App,
        addrBalance: parseFloat(state.addrBalance),
        showActive: state.showActive,
        gasPrice: state.gasPrice,
        connectedAddr,
        balances
    };
}

const dispatchToProps = (dispatch) => {
    return {
        updateField: (field, value) => dispatch(updateField(field, value)),
        submitCreateBalance: (app, account, to, amt) => dispatch(createBalance(app, account, to, amt)),
        submitAddToBalance: (app, account, gasPrice, id, amt) => dispatch(addToBalance(app, account, gasPrice, id, amt)),
        submitClaimBalance: (app, account, id) => dispatch(claimBalance(app, id, account)),
        getBalancesForAddr: (app, addr) => dispatch(getBalancesForAddr(app, addr)),
        getAcctBalance: (addr) => dispatch(getAcctBalance(addr)),
        getGasPrice: () => dispatch(getGasPrice()),
        toggleActive: () => dispatch(toggleShowActive())
    };
}

export default connect(
    stateToProps,
    dispatchToProps
)(Container);
