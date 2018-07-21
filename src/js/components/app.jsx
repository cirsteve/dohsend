import React, { Component } from 'react';
import TrxList from './TrxList.jsx';

const inputHandler = (cb, e) => cb(e.currentTarget.value);

const form = (fields, handler) => Object.keys(fields).map(
    k => <div key={k}><label>{k}</label><input type="text" value={fields[k]} onChange={inputHandler.bind(this, handler.bind(this, k))} /></div>
    );

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
            value="Create Balance"
            onClick={handlers.submitCreateBalance.bind(this,
                props.app,
                props.connectedAddr,
                props.formData.recipientAddr,
                props.formData.amount)} />
        <div className="existing-trxs">
            <div>
                <h4>Balances</h4>
                {TrxList(
                    props.balances,
                    handlers.submitClaimBalance.bind(this, props.app, props.connectedAddr),
                    handlers.submitAddToBalance.bind(this, props.app, props.connectedAddr, props.gasPrice),
                    props.showActive,
                    handlers.toggleActive.bind(this))}
            </div>
        </div>
     </div>)

class Container extends Component {
    componentWillMount () {
        console.log('comp will mount ', this.props);
        this.props.getBalancesForAddr(this.props.app, this.props.connectedAddr);
        this.props.getAcctBalance(this.props.connectedAddr);
        this.props.getEventsForAddr(this.props.app, this.props.connectedAddr);
        this.props.getGasPrice();
    }

    render () {
        console.log('rendering: ', this.props);
        return appComp(this.props);
    }
}

export default Container;
