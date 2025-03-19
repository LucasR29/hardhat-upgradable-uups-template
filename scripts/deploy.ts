import hre from "hardhat";

export async function main() {
    console.log('Deploying AnyflowHelloWorld_V1...')

    const args = [
        "0xeAB3b6952F62668108B0F254bbC7400C83A9d62D", // _initialOwner
        "Hello, World!", // _helloMessage
    ] as const;

    const factory = await hre.ethers.getContractFactory("AnyflowHelloWorld_V1");

    const contract = await hre.upgrades.deployProxy(factory, args);

    await contract.waitForDeployment();

    console.log("AnyflowHelloWorld_V1 deployed to:", await contract.getAddress());
}

main()
    .then(() => process.exit(0));