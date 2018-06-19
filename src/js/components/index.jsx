import React from 'react'
import { connect } from 'react-redux';
import Container from './app.jsx';
import { updateField, submitTrx, TrxReceived, getTrxsForAddr, claimTrx, toggleShowActive } from '../actions/index';

const getActiveTrxs = (trxs) => trxs.filter(t=>t.amt != 0)

const stateToProps = (state) => {
    const connectedAddr = web3.eth.accounts[0];

    return {
        formData: { ...state.formData },
        pendingTrxs: state.pendingTrxs,
        pendingTrx: state.pendingTrx,
        trxsCreated: state.showActive.created ?
            getActiveTrxs(state.trxs.created) : state.trxs.created,
        trxsReceived: state.showActive.received ?
            getActiveTrxs(state.trxs.received) : state.trxs.received,
        app: state.App,
        connectedAddr,
        addrBalance: web3.fromWei(state.addrBalance),
        showActive: state.showActive
    };
}

const dispatchToProps = (dispatch) => {
    return {
        updateField: (field, value) => dispatch(updateField(field, value)),
        submitTrx: (app, to, amt, account) => dispatch(submitTrx(app, to, amt, account)),
        getTrxsForAddr: (app, addr) => dispatch(getTrxsForAddr(app, addr)),
        claimTrx: (app, id, account) => dispatch(claimTrx(app, id, account)),
        toggleActive: (trxType) => dispatch(toggleShowActive(trxType))
    };
}

export default connect(
    stateToProps,
    dispatchToProps
)(Container);
