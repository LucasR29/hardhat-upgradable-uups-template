import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.28",
};

export default config;
