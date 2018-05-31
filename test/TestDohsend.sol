pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Dohsend.sol";

contract TestDohsend {
  Dohsend dohsend = Dohsend(DeployedAddresses.Dohsend());

  function testCreateTransaction() public {
    address addy = 0x123;
    uint val = 100;
    dohsend.createTransaction(addy, val);

    (address trx0, address trx1, uint am, bool act) = dohsend.getTransaction(0);
  }

}
