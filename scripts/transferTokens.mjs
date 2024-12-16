import { ethers } from "ethers"; 
import dotenv from "dotenv";
dotenv.config();

const AMOUNT = ethers.parseUnits("1.0", 18); 

async function transferTokens() {
    const provider = new ethers.JsonRpcProvider(process.env.HOLESKY_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

   
    const ABI = [
        "function transfer(address to, uint256 amount) public returns (bool)"
    ];


    const tokenContract = new ethers.Contract(process.env.SEPOLIA_CONTRACT_ADDRESS, ABI, wallet);

    
    const tx = await tokenContract.transfer(process.env.WALLET_ADDRESS, AMOUNT);
    console.log("Transaction Hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction Confirmed:", receipt);
}

transferTokens().catch(console.error);
