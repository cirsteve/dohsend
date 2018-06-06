import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

const inputHandler = (cb, e) => cb(e.currentTarget.value);

const form = (fields, handler) => Object.keys(fields).map(
    k => <div key={k}><label>{k}</label><input type="text" value={fields[k]} onChange={inputHandler.bind(this, handler.bind(this, k))} /></div>
    );

const trxCreated = ({to, amt}, i) => (
    <div key={i} className="trx">
        <div>Sent to: {to}</div>
        <div>Amount: {amt}</div>
    </div>
)

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
                {form(props.formData, props.actions.updateField)}
            </div>
         </div>
         <input type="button"
            value="Create Transaction"
            onClick={props.actions.submitTrx.bind(this,
                props.app,
                props.formData.recipientAddr,
                props.formData.amount,
                props.connectedAddr)} />
        <div>
            <h3>Trxs Created</h3>
            {props.trxsCreated.map(trxCreated)}
        </div>
     </div>)

class App extends Component {
    componentWillMount () {
        console.log('cwm: ', this, this.props);
        this.props.actions.getTrxsForAddr(this.props.app, this.props.connectedAddr)
    }

    render () {
        console.log('rendering: ', this.props);
        return appComp(this.props);
    }
}

export default App;
