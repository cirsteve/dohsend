export function updateField(field, value) {
  return {
    type: 'UPDATE_FIELD',
    field,
    value
  }
}


export function toggleShowActive() {
    return {
        type: 'TOGGLE_SHOW_ACTIVE'
    }
}

function loading(dataType, isLoading) {
    return {
        type: 'LOADING',
        dataType,
        isLoading
    };
}

function pendingTransaction(transactionType, isPending) {
    return {
        type: 'PENDING_TRANSACTION',
        transactionType,
        isPending
    }
}

function balancesReceived(balances) {
    return {
        type: 'BALANCES_RECEIVED',
        balances
    };
}

function handleBalancesResponse(response) {
    const balances = response[0].reduce((acc, id, idx) => {
        acc[id] = {
            addr: response[2][idx],
            amt: parseFloat(response[1][idx]),
            id: parseInt(id, 10)
        };

        return acc;
    }, {});

    return (dispatch, getState) => {
        dispatch(balancesReceived(balances));
        dispatch(loading('balances', false));
    };

}

function fetchBalances(app, addr) {
    console.log('fetching balances for ', addr);
    return (dispatch, getState) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.getBalances.call(addr).then(result => {
                console.log('received balances: ', result);
                dispatch(handleBalancesResponse(result));
            });
        })
    };
};

export function getBalancesForAddr(app, addr) {
    return dispatch => {
        dispatch(loading('balances', true))
        dispatch(fetchBalances(app, addr));
    }
}

function balanceReceived(balance) {
    return {
        type: 'BALANCE_RECEIVED',
        balance
    };
}

function formatBalanceResponse (bal) {
    console.log('for bal resp: ', bal);
    return {
        id: parseInt(bal.id, 10),
        addr: bal.receiver,
        amt: parseFloat(bal.amt)
    };
}

export function createBalance(app, acct, addr, amt) {
    console.log('cb: ', arguments);
    return (dispatch) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.createBalance(addr, {
                gas: 1000000,
                gasPrice: 10000,
                from: acct,
                value: amt
            }).then(result => {
                console.log('create bal: ', result);
                dispatch(getAcctBalance(acct));
                dispatch(balanceReceived(formatBalanceResponse(result.logs[0].args)));
                dispatch(pendingTransaction('createBalance', false));
            });
        })
    };
}

export function addToBalance(app, acct, gasPrice, id, amt) {
    console.log('adding bal: ', arguments);
    return (dispatch) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.addToBalance(id, {
                gas: 1000000,
                gasPrice: 10000,
                from: acct,
                value: amt
            }).then(result => {
                console.log('add to bal: ', result);
                dispatch(getAcctBalance(acct));
                dispatch(balanceReceived(formatBalanceResponse(result.logs[0].args)));
                dispatch(pendingTransaction('addToBalance', false));
            }).catch((err) => console.log('addToBalance error: ', err));
        })
    };
}

export function claimBalance(app, acct, id) {
    return (dispatch) => {
        return app.contracts.Dohsend.deployed().then(instance => {
            return instance.claimBalance(id, {
                //gas: 1000000,
                //gasPrice: 10000,
                from: acct
            }).then(result => {
                console.log('bal claimed: ', result);
                dispatch(getAcctBalance(acct));
                dispatch(getBalancesForAddr(app, acct));
            }).catch(err => console.log(`claim trx Errorer:${err.message}`));
        })
    }
}

function accountBalanceReceived(addr, balance) {
    console.log('got acct bal: ', balance);
    return {
        type: 'ACCT_BALANCE_RECEIVED',
        addr,
        balance
    };
};

//get the balance of the account connected to the client
export function getAcctBalance(addr) {
    return (dispatch) => {
        console.log('getting acct balance for ', addr);
        if (!addr) return;
        return web3.eth.getBalance(addr, (err, balance) => {
            if (err) {
                console.log('err:', err)
            } else {
                dispatch(accountBalanceReceived(addr, balance))
            }
        })
    }
};

function gasPriceReceived(price) {
    console.log('got gas price: ', price);
    return {
        type: 'GAS_PRICE_RECEIVED',
        price
    }
}

export function getGasPrice() {
    return (dispatch) => {
        return web3.eth.getGasPrice(function(_, price) { dispatch(gasPriceReceived(parseInt(price, 10)))});
    };
}

export function getEventsForAddr(app, addr) {
    return (dispatch) => {
        app.contracts.Dohsend.BalanceSent({sender: addr}, {fromBlock: 0, toBlock: 'latest'}).get((err, res) => {
            if (err) console.log('BalanceSent: ', err);
            console.log('BalanceSent: ', res);
        })
    }
}
