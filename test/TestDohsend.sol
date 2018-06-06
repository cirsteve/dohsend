pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Dohsend.sol";

contract TestDohsend {

  Dohsend dohsend = Dohsend(DeployedAddresses.Dohsend());

  function testCreateTransaction() public {
    address addy = 0x123;
    uint val = 1;
    dohsend.createTransaction.value(val)(addy, val);

    (address trx0, address trx1, uint amt) = dohsend.getTransaction(0);
    Assert(amt == val);
  }

  function testDonate() public {
    dohsend.donate.value(5);
  }

}
