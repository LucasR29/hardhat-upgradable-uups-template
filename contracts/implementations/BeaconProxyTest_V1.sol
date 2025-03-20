// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BeaconProxyTest_V1 is Initializable, OwnableUpgradeable {
    string public message;
    uint256 public counter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, string memory _message) public initializer {
        __Ownable_init(initialOwner);
        message = _message;
        counter = 0;
    }

    function increment() public {
        counter++;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
} 