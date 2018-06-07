import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

const inputHandler = (cb, e) => cb(e.currentTarget.value);

const form = (fields, handler) => Object.keys(fields).map(
    k => <div key={k}><label>{k}</label><input type="text" value={fields[k]} onChange={inputHandler.bind(this, handler.bind(this, k))} /></div>
    );

const createdTrxItem = (app, acct, handler, {to, amt, id}, i) => (
    <div key={i} className="trx">
        <div>Sent to: {to}</div>
        <div>Amount: {amt}</div>
        <input type="button" onClick={handler.bind(this, app, acct, id)} value="Claim"/>
    </div>
)

const receivedTrxItem = (app, acct, handler, {from, amt, id}, i) => (
    <div key={i} className="trx">
        <div>Created by: {from}</div>
        <div>Amount: {amt}</div>
        <input type="button" onClick={handler.bind(this, app, acct, id)} value="Claim"/>
    </div>
)

const existingTrxs = (created, received, handler, app, acct) => {
    return (
    <div>
        <h3>Transactions Created</h3>
        <div>
            { created.length ? created.map(createdTrxItem.bind(this, app, acct, handler)) : '-'}
        </div>
        <h3>Transactions Received</h3>
        <div>
            { received.length ? received.map(receivedTrxItem.bind(this, app, acct, handler)) : '-'}
        </div>
    </div>);
}

const appComp = ({ ...props, ...handlers }) => (
      <div className="main-container">
         <h1>Send some funds without fear of losing them!</h1>
         <div className="block">
            <div>
            Your Address: {props.connectedAddr}
            <br />
            Eth: {props.addrBalance}
            </div>
            <div className="form">
                {form(props.formData, handlers.updateField)}
            </div>
         </div>
         <input type="button"
            value="Create Transaction"
            onClick={handlers.submitTrx.bind(this,
                props.app,
                props.formData.recipientAddr,
                props.formData.amount,
                props.connectedAddr)} />
        { existingTrxs(props.trxsCreated, props.trxsReceived, handlers.claimTrx, props.app, props.connectedAddr)}
     </div>)

class Container extends Component {
    componentWillMount () {
        this.props.getTrxsForAddr(this.props.app, this.props.connectedAddr)
    }

    render () {
        console.log('rendering: ', this.props);
        return appComp(this.props);
    }
}

export default Container;
