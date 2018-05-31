pragma solidity ^0.4.24;

contract Dohsend {
    struct transaction {
        address _creator;
        address _receiver;
        uint _amt;
        uint32 _id;
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

    uint32 counter = 0;

    mapping (address => uint32[]) transactionsByCreator;
    mapping (address => uint32[]) transactionsByReceiver;
    mapping (uint32 => transaction) transactionById;

    function() public payable {}

    function createTransaction(address _receiver, uint _amt) public payable {
        require(msg.sender.balance >= msg.value);
        require(msg.value == _amt);

        transaction memory trx = transaction(msg.sender, _receiver, msg.value, counter, true);

        transactionsByCreator[msg.sender].push(counter);
        transactionsByReceiver[_receiver].push(counter);
        transactionById[counter] = trx;
        counter += 1;

        emit TransactionCreated(trx._id);
    }

    //used if the designated trx receipient is claiming the funds
    function claimTransaction(uint32 _id) public {
        transaction storage trx = transactionById[_id];
        require(msg.sender == trx._receiver);
        require(trx._isActive);
        trx._isActive = false;
        msg.sender.transfer(trx._amt);
        emit TransactionClaimed(trx._id);
    }

    //used if the trx creator is claiming the funds
    function reclaimTransaction(uint32 _id) public {
        transaction storage trx = transactionById[_id];
        require(msg.sender == trx._creator);
        require(trx._isActive);
        trx._isActive = false;

        msg.sender.transfer(trx._amt);

        emit TransactionReclaimed(trx._id);
    }

    function getCreatorTransactions(address _addy) public view returns (uint32[]) {
        uint32[] memory trxIds = transactionsByCreator[_addy];
        return trxIds;
    }

    function getReceiverTransactions(address _addy) public view returns (uint32[]) {
        uint32[] memory trxIds = transactionsByReceiver[_addy];
        return trxIds;
    }

    function getTransaction(uint32 _id) public view returns (address _creator, address _receiver, uint _amt, bool _isActive) {
        transaction memory trx = transactionById[_id];
        return (trx._creator, trx._receiver, trx._amt, trx._isActive);
    }
}
