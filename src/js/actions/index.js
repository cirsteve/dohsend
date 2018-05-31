export function updateField(field, value) {
  return {
    type: 'UPDATE_FIELD',
    field,
    value
  }
}

export function submitTrx(to, amt) {
    return function (dispatch, getState) {
        dispatch(submitTrxPending());
        return getState().contractInstance.createTransaction(to, amt, {
            gas: 1000000,
            gasPrice: 10000,
            from: getState().web3.eth.accounts[0],
            value: getState().web3.toWei(amt, 'ether')
        }, (err, result) => {
            if (err) console.log('err: ', err);
            console.log('trx created: ', result);
            dispatch(trxCreated(result));

        });
    }
}

export function submitTrxPending() {
    return {
        type: 'SUBMIT_TRX_PENDING'
    }
}

export function transactionCreated() {
  return {
    type: 'TRX_CREATED'
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

export function trxsReceived(trxs) {
    return {
        type: 'TRXS_RECEIVED',
        trxs
    }
}
