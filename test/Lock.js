const { expect, use } = require("chai");
const { ethers, upgrades} = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Vesting", function () {
  let owner,user1,user2,user3,user4,user5,user6,user7,user8;
  let usdtToken ,usdtTokenFactory
  let xToken, xTokenFactory
  let vestingContract, vestingContractFactory

    beforeEach(async function () {
      [owner,user1,user2,user3,user4,user5,user6,user7,user8] = await ethers.getSigners();
      usdtTokenFactory = await ethers.getContractFactory("USDT");
      usdtToken = await usdtTokenFactory.deploy();

      xTokenFactory = await ethers.getContractFactory("MyToken");
      xToken = await xTokenFactory.deploy();

      vestingContractFactory = await ethers.getContractFactory("TokenSale");
      vestingContract = await vestingContractFactory.deploy(usdtToken.target, xToken.target);


      await xToken.mint(vestingContract.target,ethers.parseEther("50000000"));
    });

    it("Buy X Token", async()=>{
       await usdtToken.mint(user1.address,ethers.parseEther("50"));
       await usdtToken.connect(user1).approve(vestingContract.target,ethers.parseEther("50"));
       await vestingContract.connect(user1).buy();

       const userDetails = await vestingContract.users(user1.address);
       console.log(userDetails);

      await expect(vestingContract.connect(user1).buy()).to.be.revertedWith('Already deposited');


    })

    // it("Claim when vesting Percentage is 5% and vesting period is 20 days",async()=>{
    //   await vestingContract.setVesting(5, 20 * 24 * 60 * 60);

    //   await usdtToken.mint(user1.address,ethers.parseEther("50"));
    //   await usdtToken.connect(user1).approve(vestingContract.target,ethers.parseEther("50"));
    //   await vestingContract.connect(user1).buy();

    //   const blockBefore = await ethers.provider.getBlock("latest");
    //   console.log("Block Time Before:", blockBefore.timestamp);

    //    // Fast forward time by 29 days (should still be unable to claim)
    //    await ethers.provider.send("evm_increaseTime", [29 * 24 * 60 * 60]);
    //    await ethers.provider.send("evm_mine");

    //    const blockAfter = await ethers.provider.getBlock("latest");
    //    console.log("Block Time After:", blockAfter.timestamp);

    //    await expect(vestingContract.connect(user1).claim()).to.be.revertedWith("Claiming not started yet");

    //      // Fast forward time by 1 more day (total 30 days)
    //      await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();

    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("2.5"))

    //      await ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("5"))

    //      await ethers.provider.send("evm_increaseTime", [19 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");

    //      await expect(vestingContract.connect(user1).claim()).to.be.revertedWith("Claim interval not reached");

    //      await ethers.provider.send("evm_increaseTime", [21 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("10"))


    //      await ethers.provider.send("evm_increaseTime", [47 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("15"))


    //      await ethers.provider.send("evm_increaseTime", [13 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("17.5"))


    //      await ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("20"))



    //      await ethers.provider.send("evm_increaseTime", [160 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("40"))


    //      await ethers.provider.send("evm_increaseTime", [160 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await vestingContract.connect(user1).claim();
    //      expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("50"))


    //      await ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60]);
    //      await ethers.provider.send("evm_mine");
    //      await expect(vestingContract.connect(user1).claim()).to.be.revertedWith("No claimable tokens available");
         
    //      const userDetails = await vestingContract.users(user1.address);
    //      console.log(userDetails);
    // })


    it("Withdraw Funds",async()=>{
      await vestingContract.withdrawFunds(owner.address,usdtToken.balanceOf(vestingContract.target));
      await vestingContract.withdrawTokens(owner.address,xToken.balanceOf(vestingContract.target))
    })



    it("Claim when vesting Percentage is 5% and vesting period is 20 days",async()=>{
      await vestingContract.setVesting(5, 20 * 24 * 60 * 60);

      await usdtToken.mint(user1.address,ethers.parseEther("50"));
      await usdtToken.connect(user1).approve(vestingContract.target,ethers.parseEther("50"));
      await vestingContract.connect(user1).buy();

         await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await expect(vestingContract.connect(user1).claim()).to.be.revertedWith("Claim interval not reached");

         await ethers.provider.send("evm_increaseTime", [19 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await vestingContract.connect(user1).claim();
         expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("2.5"))

         await ethers.provider.send("evm_increaseTime", [21 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await vestingContract.connect(user1).claim();
         expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("5"))


         await ethers.provider.send("evm_increaseTime", [19 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await vestingContract.connect(user1).claim();
         expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("7.5"))


         await ethers.provider.send("evm_increaseTime", [180 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await vestingContract.connect(user1).claim();
         expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("30"))


         await ethers.provider.send("evm_increaseTime", [79 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await vestingContract.connect(user1).claim();
         expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("37.5"))



         await ethers.provider.send("evm_increaseTime", [160 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await vestingContract.connect(user1).claim();
         expect(await xToken.balanceOf(user1.address)).to.be.eq(ethers.parseEther("50"))


         await ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60]);
         await ethers.provider.send("evm_mine");
         await expect(vestingContract.connect(user1).claim()).to.be.revertedWith("No claimable tokens available");
         
         const userDetails = await vestingContract.users(user1.address);
         console.log(userDetails);
    })

   
  

  });