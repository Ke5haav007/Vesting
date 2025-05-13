// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import 'hardhat/console.sol';

contract TokenSale is Ownable {
    IERC20 public usdt; 
    IERC20 public projectToken; 

    uint256 public constant DEPOSIT_AMOUNT = 50 * 10**18; 
    uint256 public constant TOKEN_ALLOCATION = 50 * 10**18; 

    uint256 public vestingStartTime = 30 days; 
    uint256 public claimPercentage; 
    uint256 public claimInterval; 

    struct UserInfo {
        uint256 depositedAt;
        uint256 allocatedTokens;
        uint256 claimedTokens;
        uint256 lastClaimTime;
    }

    mapping(address => UserInfo) public users;

    event TokensDeposited(address indexed user, uint256 amount);
    event TokensClaimed(address indexed user, uint256 amount);
    event VestingUpdated(uint256 percentage, uint256 interval);

    constructor(address _usdt, address _projectToken) onlyOwner{
        usdt = IERC20(_usdt);
        projectToken = IERC20(_projectToken);
    }

    function buy() external {
        require(users[msg.sender].depositedAt == 0, "Already deposited");
        require(usdt.transferFrom(msg.sender, address(this), DEPOSIT_AMOUNT), "USDT transfer failed");
        users[msg.sender] = UserInfo({
            depositedAt: block.timestamp,
            allocatedTokens: TOKEN_ALLOCATION,
            claimedTokens: 0,
            // lastClaimTime: block.timestamp + vestingStartTime
            lastClaimTime:block.timestamp
        });

        emit TokensDeposited(msg.sender, DEPOSIT_AMOUNT);
    }

function claim() external {
    UserInfo storage user = users[msg.sender];
    require(user.depositedAt > 0, "No deposit found");
    // require(block.timestamp >= user.depositedAt + vestingStartTime, "Claiming not started yet");
    require(claimPercentage > 0 && claimInterval > 0, "Vesting not set");

    uint256 totalClaimableAmount;

        // Calculate how many intervals have passed since the last claim
        uint256 elapsedTime = block.timestamp - user.lastClaimTime;
        uint256 claimableIntervals = elapsedTime / claimInterval;

        require(claimableIntervals > 0, "Claim interval not reached");

        // Compute total claimable amount based on missed intervals
        totalClaimableAmount = (user.allocatedTokens * claimPercentage * claimableIntervals) / 100;

        // Update lastClaimTime to the most recent claim time
        user.lastClaimTime += claimableIntervals * claimInterval;


    // Ensure user doesn't claim more than allocated
    uint256 remainingTokens = user.allocatedTokens - user.claimedTokens;
    if (totalClaimableAmount > remainingTokens) {
        totalClaimableAmount = remainingTokens;
    }
    require(totalClaimableAmount > 0, "No claimable tokens available");
    user.claimedTokens += totalClaimableAmount;
    require(projectToken.transfer(msg.sender, totalClaimableAmount), "Token transfer failed");

    emit TokensClaimed(msg.sender, totalClaimableAmount);
}



    function setVesting(uint256 _percentage, uint256 _interval) external onlyOwner {
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");
        require(_interval > 0, "Invalid interval");

        claimPercentage = _percentage;
        claimInterval = _interval;

        emit VestingUpdated(_percentage, _interval);
    }

    function withdrawFunds(address to, uint256 amount) external onlyOwner {
        require(usdt.transfer(to, amount), "USDT withdrawal failed");
    }

    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(projectToken.transfer(to, amount), "Token withdrawal failed");
    }
}
