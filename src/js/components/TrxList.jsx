import React, { Component } from 'react';


export const createdTrxItem = (handler, {to, amt, id}, i) => (
    <div key={i} className="trx">
        <div>Sent to: {to}</div>
        <div>Amount: {amt}</div>
        <input type="button" onClick={handler.bind(this, id)} value="Claim"/>
    </div>
)

export const receivedTrxItem = (handler, {from, amt, id}, i) => (
    <div key={i} className="trx">
        <div>Created by: {from}</div>
        <div>Amount: {amt}</div>
        <input type="button" onClick={handler.bind(this,  id)} value="Claim"/>
    </div>
)

const trxList = (trxs, claimTrx, comp) => (
    <div className="trx-list">
        { trxs.map(comp.bind(this, claimTrx)) }
    </div>
)

const listHeader = (showActive, toggleActive) => (
    <div className="list-controls">
        <div>
            Show Inactive<input type="checkbox" checked={showActive ? false : true} onChange={toggleActive} />
        </div>
    </div>
)

const trxsComp = (trxs, claimTrx, showActive, toggleActive, comp) => (
    <div className="trxs">
        {listHeader(showActive, toggleActive)}
        {trxs.length ?
            trxList(trxs, claimTrx, comp) : '-'}
    </div>
)


export default trxsComp;
