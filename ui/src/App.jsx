import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "../../ethereum/faucet.js";
import { Web3Provider } from '@ethersproject/providers';

// import dotenv from "dotenv";
// dotenv.config();

const AMOUNT = ethers.parseUnits("1.0", 18);

const HOLESKY_RPC_URL = "https://holesky.infura.io/v3/dbcc98661c9c43d88e57ccb78128e417"
const PRIVATE_KEY = "1ad3614ba54e329f040a9d61de11f8969adaa7d8e9973ae1e8ca7be0d7c27e96"
const SEPOLIA_CONTRACT_ADDRESS = "0x8e39fc83d3cF574E2207fC6fE18c65DdDaF8D77f"

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");


  async function transferTokens(walletAddress) {
    const provider = new ethers.JsonRpcProvider(HOLESKY_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


    const ABI = [
        "function transfer(address to, uint256 amount) public returns (bool)"
    ];


    const tokenContract = new ethers.Contract(SEPOLIA_CONTRACT_ADDRESS, ABI, wallet);


    const tx = await tokenContract.transfer(walletAddress, AMOUNT);
    console.log("Transaction Hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction Confirmed:", receipt);

}

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new Web3Provider(window.ethereum);
        console.log("provider:", provider);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log("accounts:", accounts);
        /* get signer */
        setSigner(provider.getSigner());
        console.log("here1");

        /* local contract instance */
        setFcContract(faucetContract(provider));
        console.log("here2");
        /* set active wallet address */
        setWalletAddress(accounts[0]);
        console.log("here3");
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        console.log("provider:");
        const provider = new Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          /* get signer */
          setSigner(provider.getSigner());
          /* local contract instance */
          setFcContract(faucetContract(provider));
          /* set active wallet address */
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getOCTHandler = async () => {
    try {
      const tx = await transferTokens(walletAddress);
      setTransactionData(tx.hash);
    } catch (err) {
      console.error(err.message);
      setWithdrawError(err.message);
    }

  };

  return (<div>
    <div className="backgroundDiv">    </div>

    <section className="hero ">
      <div className="faucet-hero-body">
        <div className="container">
          <h1 className="title is-1">Send Tokens</h1>
          <p>Fast and reliable.</p>
          {withdrawError && (
            <div className="withdraw-error">{!withdrawError ? <div style={{ color: "green" }}>Successfully sent</div>
              :
              <div style={{ color: "red" }}>User rejected {withdrawError}</div>}
            </div>
          )}
          {withdrawSuccess && (
            <div className="withdraw-success">{withdrawSuccess}</div>
          )}{" "}
          <div className="connectedButtonDiv">
            <button className="connectedButton" onClick={connectWallet}>
              <span className="is-link has-text-weight-bold">
                {walletAddress && walletAddress.length > 0
                  ? `Connected: ${walletAddress.substring(
                    0,
                    6
                  )}...${walletAddress.substring(38)}`
                  : "Connect Wallet"}
              </span>
            </button>
          </div>
          {walletAddress &&

            <div>


              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={getOCTHandler}
                    disabled={walletAddress ? false : true}
                  >
                    Send OCT
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p style={{display: "flex", justifyContent: "center"}}>
                    {transactionData
                      ? `Transaction hash: ${transactionData}`
                      : "--"}
                  </p>
                </div>
              </article>
            </div>
          }

        </div>
      </div>
    </section>
  </div>);
}

export default App;
