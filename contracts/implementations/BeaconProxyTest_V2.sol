// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BeaconProxyTest_V2 is Initializable, OwnableUpgradeable {
    string public message;
    uint256 public counter;
    // New state variable for V2
    uint256 public lastIncrementTimestamp;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, string memory _message) public reinitializer(2) {
        __Ownable_init(initialOwner);
        message = _message;
    }

    function increment() public {
        counter++;
        lastIncrementTimestamp = block.timestamp;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
    
    // New function in V2
    function getCounterWithTimestamp() public view returns (uint256, uint256) {
        return (counter, lastIncrementTimestamp);
    }
} 