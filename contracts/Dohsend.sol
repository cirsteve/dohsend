pragma solidity ^0.4.24;

contract Dohsend {
    struct transaction {
        address _creator;
        address _receiver;
        uint _amt;
        uint _id;
        bool _isActive;
    }

    event TransactionCreated(
        uint _id
    );

    event TransactionClaimed(
        uint _id
    );

    event TransactionReclaimed(
        uint _id
    );

    uint counter = 0;

    mapping (address => uint[]) transactionsByCreator;
    mapping (address => uint[]) transactionsByReceiver;
    mapping (uint => transaction) transactionById;

    function createTransaction(address _receiver, uint _amt) public payable {
        require(msg.sender.balance >= msg.value && msg.value == _amt);

        transaction memory trx = transaction(msg.sender, _receiver, _amt, counter, false);

        transactionsByCreator[msg.sender].push(counter);
        transactionsByReceiver[_receiver].push(counter);
        transactionById[counter] = trx;
        counter += 1;
        emit TransactionCreated(trx._id);
    }

    //used if the designated trx receipient is claiming the funds
    function claimTransaction(uint _id) public {
        transaction storage trx = transactionById[_id];
        require(msg.sender == trx._receiver && trx._isActive);
        trx._isActive = false;
        emit TransactionClaimed(trx._id);
        msg.sender.transfer(trx._amt);
    }

    //used if the trx creator is claiming the funds
    function reclaimTransaction(uint _id) public {
        transaction storage trx = transactionById[_id];
        require(msg.sender == trx._creator && trx._isActive);
        trx._isActive = false;

        emit TransactionReclaimed(trx._id);

        msg.sender.transfer(trx._amt);
    }

    function getCreatorTransactions(address _addy) public view returns (uint[]) {
        uint[] memory trxIds = transactionsByCreator[_addy];
        return trxIds;
    }

    function getReceiverTransactions(address _addy) public view returns (uint[]) {
        uint[] memory trxIds = transactionsByReceiver[_addy];
        return trxIds;
    }

    function getTransaction(uint _id) public view returns (address _creator, address _receiver, uint _amt) {
        transaction memory trx = transactionById[_id];
        return (trx._creator, trx._receiver, trx._amt);
    }
}
