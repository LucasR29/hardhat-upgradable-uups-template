import hre from "hardhat";

export async function main() {
  console.log("Deploying BeaconProxyFactory...");

  const beaconAddress = process.env.BEACON_ADDRESS as string;
  if (!beaconAddress) {
    throw new Error("BEACON_ADDRESS is not set");
  }

  console.log("Using beacon at:", beaconAddress);

  // Deploy the factory
  const BeaconProxyFactoryFactory = await hre.ethers.getContractFactory(
    "BeaconProxyFactory"
  );
  const factory = (await BeaconProxyFactoryFactory.deploy(
    beaconAddress,
    "0xeAB3b6952F62668108B0F254bbC7400C83A9d62D" // initialOwner
  )) as any;

  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("BeaconProxyFactory deployed to:", factoryAddress);

  // Export the factory address for later use
  console.log("\nExport this address to use the factory:");
  console.log(`export FACTORY_ADDRESS=${factoryAddress}`);

  // Use the factory to deploy a new proxy
  console.log("\nDeploying a proxy using the factory...");
  const createProxyTx = await factory.createProxy(
    "0xeAB3b6952F62668108B0F254bbC7400C83A9d62D", // initialOwner for proxy
    "Factory-created Proxy" // message
  );

  // Wait for the transaction to be mined
  const receipt = await createProxyTx.wait();

  if (receipt && receipt.status === 1) {
    // Get the proxy address from the event
    const proxyAddress = await getProxyAddressFromReceipt(receipt);
    console.log("New proxy deployed via factory to:", proxyAddress);

    // Get the contract interface to call functions
    const proxyContract = await hre.ethers.getContractAt(
      "BeaconProxyTest_V1",
      proxyAddress
    );

    // Read message from the proxy
    const message = await proxyContract.getMessage();
    console.log("Message from proxy:", message);

    // Get all proxies from the factory
    const proxies = await factory.getAllProxies();
    console.log("\nAll proxies deployed by factory:", proxies);
  } else {
    console.log("Proxy deployment failed");
  }
}

// Helper function to extract proxy address from transaction receipt
async function getProxyAddressFromReceipt(receipt: any): Promise<string> {
  // Find the ProxyDeployed event
  const factoryInterface = (
    await hre.ethers.getContractFactory("BeaconProxyFactory")
  ).interface;
  const proxyDeployedEvents = receipt.logs
    .map((log: any) => {
      try {
        return factoryInterface.parseLog({
          topics: log.topics,
          data: log.data,
        });
      } catch (e) {
        return null;
      }
    })
    .filter((event: any) => event && event.name === "ProxyDeployed");

  if (proxyDeployedEvents.length > 0) {
    return proxyDeployedEvents[0].args[0];
  }

  throw new Error("ProxyDeployed event not found in receipt");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
