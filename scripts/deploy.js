import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect("localhost");
  const contract = await ethers.deployContract("EventTicket");
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});