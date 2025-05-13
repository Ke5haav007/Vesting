// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract USDT is ERC20 {

    constructor() ERC20("USDT", "USDT") {}
  


   function mint(address _user, uint _amount) external{
      _mint(_user,_amount );

    }
}