// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract AnyflowHelloWorld_V2 is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint public helloCount;
    string public helloMessage;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        string memory _helloMessage
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        helloMessage = _helloMessage;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    event Hello(address _address, string _message, uint _count);

    function hello() public {
        helloCount++;
        emit Hello(msg.sender, helloMessage, helloCount);
    }

    function hello2() public {
        helloCount++;
        emit Hello(msg.sender, helloMessage, helloCount);
    }
}
