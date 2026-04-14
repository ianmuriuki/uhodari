import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const CulturalProof = await ethers.getContractFactory("CulturalProof");
  const contract = await CulturalProof.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CulturalProof deployed to:", address);
  console.log("Copy this address to backend/.env as CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
