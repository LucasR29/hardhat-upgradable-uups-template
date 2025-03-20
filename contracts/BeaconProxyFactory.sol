// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

/**
 * @title BeaconProxyFactory
 * @dev Factory contract that deploys BeaconProxy instances
 */
contract BeaconProxyFactory is Ownable {
    // The beacon that proxies will point to
    address public immutable beacon;
    
    // Array of all proxies deployed by this factory
    address[] public deployedProxies;
    
    // Event emitted when a new proxy is created
    event ProxyDeployed(address indexed proxy, string message);

    /**
     * @dev Constructor sets the beacon address and initializes ownership
     * @param _beacon The address of the UpgradeableBeacon
     * @param initialOwner The initial owner of the factory
     */
    constructor(address _beacon, address initialOwner) Ownable(initialOwner) {
        require(_beacon != address(0), "Beacon address cannot be zero");
        beacon = _beacon;
    }
    
    /**
     * @dev Creates a new BeaconProxy with initialization parameters
     * @param initialOwner The owner of the new proxy
     * @param message The message to initialize the proxy with
     * @return proxyAddress The address of the newly created proxy
     */
    function createProxy(address initialOwner, string calldata message) external returns (address proxyAddress) {
        // Encode the initialization call to initialize(address,string)
        bytes memory initData = abi.encodeWithSignature(
            "initialize(address,string)",
            initialOwner,
            message
        );
        
        // Deploy a new BeaconProxy
        BeaconProxy proxy = new BeaconProxy(
            beacon,
            initData
        );
        
        proxyAddress = address(proxy);
        deployedProxies.push(proxyAddress);
        
        emit ProxyDeployed(proxyAddress, message);
        return proxyAddress;
    }
    
    /**
     * @dev Returns the number of proxies deployed by this factory
     */
    function getProxyCount() external view returns (uint256) {
        return deployedProxies.length;
    }
    
    /**
     * @dev Returns all proxies deployed by this factory
     */
    function getAllProxies() external view returns (address[] memory) {
        return deployedProxies;
    }
} 