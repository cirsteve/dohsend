import { WEB3_PROVIDER, DEPLOYED_ADDRESS, ABI } from '../config'
import { submitTrxPending, transactionCreated, requestTrxs, requestTrxsPending, trxsReceived } from '../actions/index'

function getWeb3 () {
    let _web3;
    if(typeof web3 != 'undefined'){
       console.log("Using web3 detected from external source like Metamask")
       _web3 = new Web3(web3.currentProvider)
    }else{
       _web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
    }

    const deployedContract = _web3.eth.contract(ABI)
    //deployedContract._address = DEPLOYED_ADDRESS
    return {
        contractInstance: deployedContract.at(DEPLOYED_ADDRESS),
        web3: _web3
    };
}

const initialState = Object.assign({
    connectedAddr: null,
    formData: {
        recipientAddr: '',
        amount: 0
    },
    pendingCreateTrx: false,
    pendingRequestTrxs: false,
    trxPending: false}, getWeb3());

function updateField(state, {field, value}) {
    const update = {formData: Object.assign({}, state.formData)};
    update.formData[field] = value;
    return Object.assign({}, state, update);

}

function trxPending(state) {
    console.log('trx pending: ', state);
    return Object.assign({}, state, {pendingCreateTrx: true})
}

function trxCreated(state) {
    return function(dispatch) {
        dispatch(requestTrxsPending());

        return state.contractInstance.getCreatorTransactions(state.connectedAddr, {}, (err, result) => {
            if (err) console.log(err);
            console.log(result);
            dispatch(trxsReceived(result));
        })
    }
}

function handleTrxsReceived(state, trxs) {
    return Object.assign({}, state, {trxs:trxs});
};

export default function (state = initialState, action) {
    switch(action.type) {
        case 'UPDATE_FIELD':
            return updateField(state, action);
        case 'SUBMIT_TRX':
            return submitTrx(state, action);
        case 'SUBMIT_TRX_PENDING':
            return trxPending(state);
        case 'TRX_CREATED':
            return trxCreated()
        case 'TRX_PENDING':
            return trxPending();
        case 'REQUEST_TRXS':
            return requestTrxs(state);
        case 'TRX_RECEIVED':
            return handleTrxsReceived(state, action);
        default:
            return state;
    }
}

/**
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Compile the source code
let input = fs.readFileSync('./contracts/ProofOfExistence3.sol', 'utf8');
let output = solc.compile(input, 1);

let abi = JSON.parse(output.contracts[':ProofOfExistence3'].interface);
let bytecode = output.contracts[':ProofOfExistence3'].bytecode;

let gasEstimate = web3.eth.estimateGas({data: bytecode}).then(console.log);

// Contract object
let MyContract = web3.eth.contract(abi);
*/
