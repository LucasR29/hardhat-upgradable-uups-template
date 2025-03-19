import hre from "hardhat";

export async function main() {
  console.log("Deploying AnyflowHelloWorld_V4...");

  const proxyAddress = process.env.PROXY_ADDRESS as string;
  if (!proxyAddress) {
    throw new Error("PROXY_ADDRESS is not set");
  }

  // Get the current implementation contract factory
  console.log("Importing proxy at address:", proxyAddress);
  const currentFactory = await hre.ethers.getContractFactory(
    "AnyflowHelloWorld_V1"
  );
  await hre.upgrades.forceImport(proxyAddress, currentFactory);
  console.log("Proxy successfully imported");

  const factory = await hre.ethers.getContractFactory("AnyflowHelloWorld_V4");

  // Get the old implementation address before upgrading
  const oldImplementationAddress =
    await hre.upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Old implementation address:", oldImplementationAddress);

  // Upgrade without calling initialize again
  const contract = await hre.upgrades.upgradeProxy(proxyAddress, factory, {
    kind: "uups",
  });

  await contract.waitForDeployment();

  // Get the proxy address
  const contractAddress = await contract.getAddress();
  console.log("Proxy address:", contractAddress);

  // Get the implementation address
  const implementationAddress =
    await hre.upgrades.erc1967.getImplementationAddress(contractAddress);
  console.log("New implementation address:", implementationAddress);

  console.log("AnyflowHelloWorld_V4 deployed to:", contractAddress);
}

main().then(() => process.exit(0));
