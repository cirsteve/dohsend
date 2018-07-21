pragma solidity ^0.4.24;

contract Dohsend {
    uint balanceCount = 1;

    struct Balance {
        address[2] addresses;
        uint amount;
    }

    event BalanceSent(
        address indexed sender,
        address indexed receiver,
        uint amt,
        uint id
    );

    event BalanceClaimed(
        address indexed claimedBy,
        address indexed complement,
        uint amt,
        uint id
    );

    mapping (address => uint[]) public addresses;

    //list of addresses that have an active balance with the key address
    mapping (uint => Balance) public balances;

    function() public payable {}

    function getComplement(address[2] addrs, address sender) pure public returns (address to) {
        if (sender == addrs[0]) {
            to = addrs[1];
        }

        if ( sender == addrs[1]) {
            to = addrs[0];
        }

        if (to == 0x0) {
            revert();
        }
    }

    function createBalance(address _to) public payable returns (bool) {
        require(msg.sender.balance >= msg.value);
        address[2] memory accounts = [msg.sender, _to];
        balances[balanceCount].addresses = accounts;
        balances[balanceCount].amount = msg.value;
        addresses[msg.sender].push(balanceCount);
        addresses[_to].push(balanceCount);
        emit BalanceSent(msg.sender, _to, msg.value, balanceCount);
        balanceCount += 1;
        return true;
    }

    function addToBalance(uint _id) public payable {
        require(msg.sender.balance >= msg.value);
        Balance storage balance = balances[_id];

        //ensure that one of the address matches the sender
        address to = getComplement(balance.addresses, msg.sender);
        balances[_id].amount += msg.value;
        emit BalanceSent(msg.sender, to, msg.value, _id);
    }

    function claimBalance(uint _id) public {
        Balance storage balance = balances[_id];
        require(msg.sender == balance.addresses[0] || msg.sender == balance.addresses[1]);
        uint amount = balance.amount;
        balance.amount = 0;
        msg.sender.transfer(amount);
        emit BalanceClaimed(msg.sender, getComplement(balance.addresses, msg.sender), amount, _id);
    }

    function claimBalances(uint[] _ids) public {
        for (uint i = 0; i< _ids.length; i++) {
            claimBalance(_ids[i]);
        }
    }

    function getBalance(uint _id) public view returns (address, address, uint) {
        Balance memory balance = balances[_id];
        return (balance.addresses[0], balance.addresses[1], balance.amount);
    }

    function getBalances(address _addr) public view returns ( uint[] ids, uint[] amts, address[] addrs) {
        ids = addresses[_addr];
        amts = new uint[](ids.length);
        addrs = new address[](ids.length);
        for (uint i=0; i<ids.length;i++) {
            Balance storage bal = balances[ids[i]];
            addrs[i] = getComplement(bal.addresses, _addr);
            amts[i] = bal.amount;
        }

        return (ids, amts, addrs);
    }

}
