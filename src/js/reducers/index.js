import TruffleContract from 'truffle-contract';
import { WEB3_PROVIDER, DEPLOYED_ADDRESS, ABI } from '../config'
import { submitTrxPending, transactionCreated, requestTrxs, requestTrxsPending, trxsReceived } from '../actions/index'
import DohsendArtifact from '../../../build/contracts/Dohsend.json'
//const Web3 = require('web3');

function initWeb3 () {
    let _web3;
    if(typeof web3 != 'undefined'){
       console.log("Using web3 detected from external source like Metamask")
       _web3 = web3.currentProvider;
    }else{
        console.log(`Using web3 by setting HttpProvider: ${WEB3_PROVIDER}`)
       _web3 = new Web3.providers.HttpProvider(WEB3_PROVIDER)
    }

    return _web3;
}

function initContract(_web3) {
    const Dohsend = TruffleContract(DohsendArtifact);
    Dohsend.setProvider(_web3.currentProvider);
    //Dohsend.network_id = 5777;
    return Dohsend;
}

function initApp() {
    let _web3 = initWeb3();
    web3 = new Web3(_web3);
    return {
        web3Provider: _web3,
        contracts: {
            Dohsend: initContract(web3)
        }
    };
}

const initialState = {
    loading: {
        balances: false
    },
    trxPending: false,
    connectedAddr: null,
    addrBalance: 0,
    formData: {
        recipientAddr: '',
        amount: 0
    },
    balances: {},//balances saved onchain via the dapp
    gasPrice: 0,
    showActive: false,
    App: Object.assign({}, initApp())
};

function updateField(state, {field, value}) {
    const update = {formData: Object.assign({}, state.formData)};
    update.formData[field] = value;
    return Object.assign({}, state, update);

}

function loading(state, dataType, isLoading) {
    console.log('trx pending: ', state);
    const update = Object.assign({}, state.loading);
    update[dataType] = isLoading;
    return Object.assign({}, state, {loading: update})
}

function transactionPending(state, trxType, isPending) {
    console.log('trx pending: ', state);
    return Object.assign({}, state, {pendingCreateTrx: true})
}

function balancesReceived(state, balances) {
    return Object.assign({}, state, {balances});
}

function balanceReceived(state, balance) {
    const balances = Object.assign({}, state.balances);
    balances[balance.id] = balance;
    return Object.assign({}, state, { balances });
}

function toggleActive(state, trxType) {
    const showActive = !state.showActive;
    return Object.assign({}, state, {showActive});
}

export default function (state = initialState, action) {
    switch(action.type) {
        case 'UPDATE_FIELD':
            return updateField(state, action);
        case 'SUBMIT_TRX':
            return submitTrx(state, action);
        case 'LOADING':
            return loading(state, action.dataType, action.isLoading);
        case 'TRANSACTION_PENDING':
            return transactionPending(state, action.transactionType, action.isPending);
        case 'BALANCES_RECEIVED':
            return balancesReceived(state, action.balances);
        case 'BALANCE_RECEIVED':
            return balanceReceived(state, action.balance);
        case 'ACCT_BALANCE_RECEIVED':
            return Object.assign({}, state, {addrBalance: action.balance});
        case 'GAS_PRICE_RECEIVED':
            return Object.assign({}, state, {gasPrice: action.price});
        case 'TOGGLE_SHOW_ACTIVE':
            return toggleActive(state, action.trxType);
        default:
            return state;
    }
}
