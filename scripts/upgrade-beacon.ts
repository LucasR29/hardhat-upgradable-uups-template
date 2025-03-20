import hre from "hardhat";

export async function main() {
  console.log("Upgrading BeaconProxyTest to V3...");

  const beaconAddress = process.env.BEACON_ADDRESS as string;
  const proxyAddress = process.env.BEACON_PROXY_ADDRESS as string;

  if (!beaconAddress) {
    throw new Error("BEACON_ADDRESS is not set");
  }

  console.log("Beacon address:", beaconAddress);
  console.log("Proxy address:", proxyAddress);

  // Get the old implementation address
  const oldImplementationAddress =
    await hre.upgrades.beacon.getImplementationAddress(beaconAddress);
  console.log("Old implementation address:", oldImplementationAddress);

  // Check the current implementation's contract name
  try {
    // Try to verify the current implementation contract type
    const currentImplementation = await hre.ethers.getContractAt(
      "BeaconProxyTest_V3",
      oldImplementationAddress
    );

    // Check for a V3-specific property - 'teste' is only in V3
    try {
      // Try to access the V3-specific property 'teste'
      const testeValue = await currentImplementation.teste();

      // If we can access teste, it's definitely V3
      console.log(
        "Warning: Implementation is already confirmed to be V3. No upgrade needed."
      );
      console.log("V3-specific property 'teste' value:", testeValue);

      // If we reach here, implementation is already V3
      if (proxyAddress) {
        const proxyWithV3ABI = await hre.ethers.getContractAt(
          "BeaconProxyTest_V3",
          proxyAddress
        );
        const [count, timestamp] =
          await proxyWithV3ABI.getCounterWithTimestamp();
        console.log("Current counter:", count);
        console.log("Last increment timestamp:", timestamp);
      }

      return;
    } catch (error) {
      // If this fails, it means the implementation is not V3
      console.log(
        "Implementation doesn't have V3-specific property 'teste'. Proceeding with upgrade..."
      );
    }
  } catch (error) {
    // If this fails entirely, it means the implementation can't even be cast to V3
    console.log(
      "Current implementation is definitely not V3. Proceeding with upgrade..."
    );
  }

  // Get the new implementation factory
  const newImplementationFactory = await hre.ethers.getContractFactory(
    "BeaconProxyTest_V3"
  );

  // Upgrade the beacon to the new implementation
  const upgradedBeacon = await hre.upgrades.upgradeBeacon(
    beaconAddress,
    newImplementationFactory
  );

  await upgradedBeacon.waitForDeployment();
  console.log("Beacon upgraded successfully");

  // Get the new implementation address
  const newImplementationAddress =
    await hre.upgrades.beacon.getImplementationAddress(beaconAddress);
  console.log("New implementation address:", newImplementationAddress);

  const implementationChanged =
    oldImplementationAddress !== newImplementationAddress;
  console.log("Implementation changed:", implementationChanged);

  // All proxies using this beacon are now automatically upgraded!
  if (implementationChanged) {
    console.log(
      "All beacon proxies have been upgraded to use the new implementation"
    );

    // Only try to call V3 functions if implementation actually changed
    if (proxyAddress) {
      // Optionally, you can get a reference to the proxy with the new ABI
      const proxyWithNewABI = await hre.ethers.getContractAt(
        "BeaconProxyTest_V3",
        proxyAddress
      );

      // You can call new functions or check state
      try {
        // Call the new function in V3
        const [count, timestamp] =
          await proxyWithNewABI.getCounterWithTimestamp();
        console.log("Current counter:", count);
        console.log("Last increment timestamp:", timestamp);

        // Also verify it's actually V3 by checking the V3-specific property
        try {
          const testeValue = await proxyWithNewABI.teste();
          console.log(
            "Successfully upgraded to V3. 'teste' property value:",
            testeValue
          );
        } catch (error) {
          console.warn(
            "Warning: Couldn't verify V3-specific property 'teste'."
          );
        }
      } catch (error: any) {
        console.error(
          "Failed to call V3 function. Upgrade might not be complete:",
          error.message
        );
      }
    }
  } else {
    console.log(
      "Warning: Implementation did not change. Upgrade might have failed."
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
