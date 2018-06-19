export function updateField(field, value) {
  return {
    type: 'UPDATE_FIELD',
    field,
    value
  }
}

function handleTrxCreated(app, id) {
    return (dispatch, getState) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.getTransaction.call(id).then(result => {
                console.log('received trx: ', result);
                dispatch(creatorTrx(id, result[1], parseInt(result[2], 10)));
            });
        })
    };
};

function trxsReceived(subType, trxs) {
    return {
        type: 'TRXS_RECEIVED',
        subType,
        trxs
    };
}

function fetchCreatorTrxs(app, addr) {
    return (dispatch, getState) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.getCreatorTransactions.call(addr).then(result => {
                console.log('received creator trxs: ', result);
                dispatch(trxsReceived('created', result));
            });
        })
    };
};

function fetchReceiverTrxs(app, addr) {
    return (dispatch, getState) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.getReceiverTransactions.call(addr).then(result => {
                console.log('received receiver trxs: ', result);
                dispatch(trxsReceived('received', result));
            });
        })
    };
};


export function getTrxsForAddr(app, addr) {
    console.log('getting trxs for addr: ', addr)
    return dispatch => {
        dispatch(fetchCreatorTrxs(app, addr));
        dispatch(fetchReceiverTrxs(app, addr));
    }
}

export function submitTrx(app, to, amt, account) {
    return (dispatch, getState) => {
        dispatch(submitTrxPending());
        return app.contracts.Dohsend.deployed().then(function (instance) {
            const value = amt;//web3.toWei(amt, 'ether');
            console.log('sending submit trx - to: ', to, ' amt: ', amt, ' value: ', value,' account: ', account);
            return instance.createTransaction(to, amt, {
                gas: 1000000,
                gasPrice: 10000,
                from: account,
                value
            }).then(result => {
                console.log('trx created: ', result);
                dispatch(handleTrxCreated(app, parseInt(result.logs[0].args.id, 10)));
            }).catch(err => console.log(`submitTrx Errorer:${err.message}`));
        });
    };
}

export function submitTrxPending() {
    return {
        type: 'SUBMIT_TRX_PENDING'
    }
}

export function creatorTrx(id, to, amt) {
  return {
    type: 'CREATOR_TRX',
    id,
    to,
    amt
  }
}

export function requestTrxs(addr) {
    return {
        type: 'REQUEST_TRXS',
        addr
    }
}

export function requestTrxsPending(addr) {
    return {
        type: 'REQUEST_TRXS_PENDING'
    }
}

function trxsReceived(subType, trxs) {
    return {
        type: 'TRXS_RECEIVED',
        subType,
        trxs
    }
}

export function claimTrx(app, acct, id) {
    return (dispatch) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.claimTransaction(id, {
                gas: 1000000,
                gasPrice: 10000,
                from: acct
            }).then(result => {
                console.log('trx claimed: ', result);
                dispatch(getTrxsForAddr(app, acct));
            }).catch(err => console.log(`claim trx Errorer:${err.message}`));
        })
    }
}

export function toggleShowActive(trxType) {
    return {
        type: 'TOGGLE_SHOW_ACTIVE',
        trxType
    }
}
