pragma solidity >0.5.1 <0.6.0;

contract Ownable {

    address payable public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perfom the operation");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == address(0x6c15C74e58f10b3710201c3dfa259F37CddC545d), "Only admin can perfom the operation");
        _;
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "new owner should not be null");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}