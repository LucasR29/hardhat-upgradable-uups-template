import hre from "hardhat";

export async function main() {
  console.log("Deploying BeaconProxyTest_V1 Beacon and Proxy...");

  // Deploy implementation
  const implementationFactory = await hre.ethers.getContractFactory(
    "BeaconProxyTest_V1"
  );

  // Deploy beacon
  const beacon = await hre.upgrades.deployBeacon(implementationFactory);
  await beacon.waitForDeployment();
  const beaconAddress = await beacon.getAddress();
  console.log("Beacon deployed to:", beaconAddress);

  // Get the implementation address
  const implementationAddress =
    await hre.upgrades.beacon.getImplementationAddress(beaconAddress);
  console.log("Implementation address:", implementationAddress);

  // Deploy a proxy using the beacon
  const args = [
    "0xeAB3b6952F62668108B0F254bbC7400C83A9d62D", // _initialOwner
    "Hello, Beacon Proxy!", // _message
  ];

  // Deploy a proxy using the beacon
  const beaconProxy = await hre.upgrades.deployBeaconProxy(
    beaconAddress,
    implementationFactory,
    args
  );

  await beaconProxy.waitForDeployment();
  const proxyAddress = await beaconProxy.getAddress();
  console.log("Beacon Proxy deployed to:", proxyAddress);

  // Store the addresses for later use in upgrades
  console.log("\nExport these addresses to use in upgrade script:");
  console.log(`export BEACON_ADDRESS=${beaconAddress}`);
  console.log(`export BEACON_PROXY_ADDRESS=${proxyAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
