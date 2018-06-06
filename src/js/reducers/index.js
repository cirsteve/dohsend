import TruffleContract from 'truffle-contract';
import { WEB3_PROVIDER, DEPLOYED_ADDRESS, ABI } from '../config'
import { submitTrxPending, transactionCreated, requestTrxs, requestTrxsPending, trxsReceived } from '../actions/index'
import DohsendArtifact from '../../../build/contracts/Dohsend.json'

function initWeb3 () {
    let _web3;
    if(false && typeof web3 != 'undefined'){
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
    web3 = new Web3(_web3)
    return {
        web3Provider: _web3,
        contracts: {
            Dohsend: initContract(web3)
        }
    };
}

const initialState = {
    connectedAddr: null,
    formData: {
        recipientAddr: '',
        amount: 0
    },
    trxsCreated: [],
    trxsRecevied: [],
    trxPending: false,
    App: Object.assign({}, initApp())
};

function updateField(state, {field, value}) {
    const update = {formData: Object.assign({}, state.formData)};
    update.formData[field] = value;
    return Object.assign({}, state, update);

}

function trxPending(state) {
    console.log('trx pending: ', state);
    return Object.assign({}, state, {pendingCreateTrx: true})
}

function addCreatorTrx(state, to, amt) {
    const trxs = state.trxsCreated;
    trxs.push({to, amt});
    return Object.assign({}, state, {trxsCreated: trxs});
}

function handleTrxsReceived(state, trxType, trxs) {
    const typeKey = trxType === 'creator' ?
        'trxsCreated' : 'trxsReceived';
    const update = {};
    let creators, receivers, amts;
    [creators, receivers, amts] = [...trxs];
    update[typeKey] = creators.map((t, i) => {
        return {
            from: creators[i],
            to: receivers[i],
            amt: parseInt(amts[i], 10)}
        });
    return Object.assign({}, state, update);
};

export default function (state = initialState, action) {
    switch(action.type) {
        case 'UPDATE_FIELD':
            return updateField(state, action);
        case 'SUBMIT_TRX':
            return submitTrx(state, action);
        case 'SUBMIT_TRX_PENDING':
            return trxPending(state);
        case 'CREATOR_TRX':
            return addCreatorTrx(state, action.to, action.amt);
        case 'TRX_PENDING':
            return trxPending();
        case 'REQUEST_TRXS':
            return requestTrxs(state);
        case 'TRXS_RECEIVED':
            return handleTrxsReceived(state, action.subType, action.trxs);
        default:
            return state;
    }
}
