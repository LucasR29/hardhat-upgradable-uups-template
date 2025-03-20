import hre from "hardhat";

export async function main() {
  console.log("Deploying multiple beacon proxies...");

  const beaconAddress = process.env.BEACON_ADDRESS as string;
  if (!beaconAddress) {
    throw new Error("BEACON_ADDRESS is not set");
  }

  console.log("Using beacon at:", beaconAddress);

  // Get the implementation factory to attach to proxies
  const implementationFactory = await hre.ethers.getContractFactory(
    "BeaconProxyTest_V1"
  );

  // Example messages for different proxies
  const messages = [
    "First Beacon Proxy",
    "Second Beacon Proxy",
    "Third Beacon Proxy",
  ];

  // An array to store the deployed proxy addresses
  const proxyAddresses = [];

  // Deploy multiple proxies
  for (let i = 0; i < messages.length; i++) {
    console.log(
      `\nDeploying beacon proxy #${i + 1} with message: "${messages[i]}"`
    );

    const args = [
      "0xeAB3b6952F62668108B0F254bbC7400C83A9d62D", // _initialOwner
      messages[i], // _message
    ];

    // Deploy a new proxy using the existing beacon
    const beaconProxy = await hre.upgrades.deployBeaconProxy(
      beaconAddress,
      implementationFactory,
      args
    );

    await beaconProxy.waitForDeployment();
    const proxyAddress = await beaconProxy.getAddress();
    proxyAddresses.push(proxyAddress);

    console.log(`Beacon Proxy #${i + 1} deployed to:`, proxyAddress);

    // Get the contract interface to call functions
    const proxyContract = await hre.ethers.getContractAt(
      "BeaconProxyTest_V1",
      proxyAddress
    );

    // Read message from the proxy
    const message = await proxyContract.getMessage();
    console.log(`Message from proxy #${i + 1}:`, message);
  }

  console.log("\nAll proxies deployed successfully!");
  console.log("Proxy addresses:", proxyAddresses);

  // Important: When the beacon is upgraded, all these proxies will be upgraded simultaneously
  console.log(
    "\nNote: When you upgrade the beacon, all these proxies will be upgraded automatically"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
