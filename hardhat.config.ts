import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
