// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MyToken is ERC20 {

    constructor() ERC20("MyToken", "MyToken") {}
  


   function mint(address _user, uint _amount) external{
      _mint(_user,_amount );

    }
}