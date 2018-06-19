import React, { Component } from 'react';
import TrxList, {createdTrxItem, receivedTrxItem} from './TrxList.jsx';

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
            value="Create Transaction"
            onClick={handlers.submitTrx.bind(this,
                props.app,
                props.formData.recipientAddr,
                props.formData.amount,
                props.connectedAddr)} />
        <div className="existing-trxs">
            <div>
                <h4>Created Transactions</h4>
                {TrxList(
                    props.trxsCreated,
                    handlers.claimTrx.bind(this, props.app, props.connectedAddr),
                    props.showActive.created,
                    handlers.toggleActive.bind(this, 'created'),
                    createdTrxItem)}
            </div>
            <div>
                <h4>Received Transactions</h4>
                {TrxList(
                    props.trxsReceived,
                    handlers.claimTrx.bind(this, props.app, props.connectedAddr),
                    props.showActive.received,
                    handlers.toggleActive.bind(this, 'received'),
                    receivedTrxItem)}
            </div>
        </div>
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
