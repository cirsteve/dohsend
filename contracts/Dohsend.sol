pragma solidity ^0.4.24;

contract Dohsend {
    uint balanceCount = 1;

    struct Balance {
        address[2] addresses;
        uint amount;
    }

    event BalanceSent(
        address sender,
        address indexed receiver,
        uint amt,
        uint id
    );

    event BalanceClaimed(
        address claimedBy,
        address indexed complement,
        uint amt,
        uint id
    );

    mapping (address => uint[]) addresses;

    //list of addresses that have an active balance with the key address
    mapping (uint => Balance) balances;

    function() public payable {}

    function getComplement(address[2] addrs, address sender) pure public returns (address to) {
        if (keccak256(abi.encodePacked(sender)) == keccak256(abi.encodePacked(addrs[0]))) {
            to = addrs[1];
        }

        if (keccak256(abi.encodePacked(sender)) == keccak256(abi.encodePacked(addrs[1]))) {
            to = addrs[0];
        }

        address baseAddr = 0x0;
        if (keccak256(abi.encodePacked(to)) == keccak256(abi.encodePacked(baseAddr))) {
            revert();
        }
    }

    function createBalance(address _to) public payable returns (bool) {
        require(msg.sender.balance >= msg.value);
        address[2] memory accounts;
        accounts[0] = msg.sender;
        accounts[1] = _to;
        balances[balanceCount] = Balance(accounts, msg.value);
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

    function getBalance(uint _id) public view returns (address, address, uint) {
        Balance memory balance = balances[_id];
        return (balance.addresses[0], balance.addresses[1], balance.amount);
    }

    function getBalances(address _addr) public view returns ( uint[], uint[], address[]) {
        uint[] memory ids = addresses[_addr];
        uint[] memory amts = new uint[](ids.length);
        address[] memory addrs = new address[](ids.length);
        for (uint i=0; i<ids.length;i++) {
            Balance memory bal = balances[ids[i]];
            addrs[i] = getComplement(bal.addresses, msg.sender);
            amts[i] = bal.amount;
        }

        return (ids, amts, addrs);
    }

}
