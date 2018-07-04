import React, { Component } from 'react';


class TrxItem extends Component {

    constructor(props) {
        super(props);
        this.state = {showAddInput: false, addAmt: 0};
    }

    render ()  {

        const addInputStyle = {
            display: this.state.showAddInput ? 'inline' : 'none'
        };

        return (
            <div className="trx">
                <div>Sent to: {this.props.balance.addr}</div>
                <div>Amount: {this.props.balance.amt}</div>
                <input type="button" disabled={this.props.balance.amt === 0 ? true : false} onClick={this.props.claimHandler.bind(this, this.props.balance.id)} value="Claim"/>
                <input type="button" onClick={this.toggleAddInput.bind(this)} value="Increase"/>
                <div style={addInputStyle}>
                    <input type="text" value={this.state.addAmt} onChange={this.updateAmount.bind(this)} />
                    <input type="button" onClick={this.handleSubmit.bind(this)} value="Send Increase"/>
                </div>
            </div>)
    }

    toggleAddInput () {
        this.setState(Object.assign({}, this.state, {showAddInput: !this.state.showAddInput}))
    }

    updateAmount (e) {
        this.setState(Object.assign({}, this.state, {addAmt: e.target.value}));
    }

    handleSubmit () {
        this.props.addHandler(this.props.balance.id, parseInt(this.state.addAmt))
        this.setState({showAddInput: false, addAmt: 0});
    }

}

TrxItem.defaultProps = {
    id: null,
    amt: 0,
    addr: null,
    addAmt: 0,
    claimHandler: null,
    addHandler: null,
    showAddInput: false
}

const trxList = (bals, claimBal, addBal) => (
    <div className="trx-list">
        { bals.map(b => <TrxItem key={b.id} balance={b} claimHandler={claimBal} addHandler={addBal} />) }
    </div>
)

const listHeader = (showActive, toggleActive) => (
    <div className="list-controls">
        <div>
            Show Inactive<input type="checkbox" checked={showActive ? false : true} onChange={toggleActive} />
        </div>
    </div>
)

const trxsComp = (trxs, claimBal, addBal, showActive, toggleActive, comp) => (
    <div className="trxs">
        {listHeader(showActive, toggleActive)}
        {trxs.length ?
            trxList(trxs, claimBal, addBal) : '-'}
    </div>
)


export default trxsComp;
