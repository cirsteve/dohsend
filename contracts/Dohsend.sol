pragma solidity ^0.4.24;

contract Dohsend {
    struct Transaction {
        address creator;
        address receiver;
        uint amt;
        uint32 id;
    }

    event TransactionCreated(
        uint32 id,
        uint amt
    );

    event TransactionClaimed(
        uint id,
        address claimedBy
    );

    uint32 counter = 0;

    mapping (address => uint32[]) transactionsByCreator;
    mapping (address => uint32[]) transactionsByReceiver;
    mapping (uint => Transaction) transactions;

    function() public payable {}

    function createTransaction(address _receiver, uint _amt) public payable {
        require(msg.sender.balance >= msg.value);
        require(msg.value == _amt);

        Transaction memory trx = Transaction(msg.sender, _receiver, msg.value, counter);

        transactionsByCreator[msg.sender].push(counter);
        transactionsByReceiver[_receiver].push(counter);
        transactions[counter] = trx;
        counter += 1;

        emit TransactionCreated(trx.id, _amt);
    }

    function donate() public payable {
        require(msg.sender.balance >= msg.value);
    }

    //used if the trx creator is claiming the funds
    function claimTransaction(uint32 _id) public returns (bool) {
        Transaction storage trx = transactions[_id];
        require(msg.sender == trx.creator || msg.sender == trx.receiver);
        uint trxAmt = trx.amt;
        require(trxAmt > 0);
        trx.amt = 0;
        emit TransactionClaimed(trx.id, msg.sender);
        msg.sender.transfer(trxAmt);
        return true;
    }

    function getTransactions(uint32[] ids) internal returns (address[], address[], uint[]) {
        address[] memory creator = new address[](ids.length);
        address[] memory receiver = new address[](ids.length);
        uint[] memory amt = new uint[](ids.length);
        for (uint i=0; i<ids.length; i++) {
            Transaction trx = transactions[ids[i]];
            creator[i] = trx.creator;
            receiver[i] = trx.receiver;
            amt[i] = trx.amt;
        }

        return (creator, receiver, amt);
    }

    function getCreatorTransactions(address _addy) public view returns (uint32[] ids, address[] creator, address[] receiver, uint[] amt) {
        ids = transactionsByCreator[_addy];
        (creator, receiver, amt) = getTransactions(ids);
        return (ids, creator, receiver, amt);
    }

    function getReceiverTransactions(address _addy) public view returns (uint32[] ids, address[] creator, address[] receiver, uint[] amt) {
        ids = transactionsByReceiver[_addy];
        (creator, receiver, amt) = getTransactions(ids);
        return (ids, creator, receiver, amt);
    }

    function getTransaction(uint32 _id) public view returns (address creator, address receiver, uint amt) {
        Transaction memory trx = transactions[_id];
        creator = trx.creator;
        receiver = trx.receiver;
        amt = trx.amt;
        return (creator, receiver, amt);
    }
}
