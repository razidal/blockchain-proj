const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const OceanToken = await hre.ethers.getContractFactory("OceanToken");

  // Deploy the contract with the initial supply (e.g., 1 million tokens)
  const oceanToken = await OceanToken.deploy(1000000);

  // Wait for the deployment transaction to be mined
  await oceanToken.waitForDeployment();

  // Log the contract address
  console.log("OceanToken deployed to:", oceanToken.target);
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
