import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "../../ethereum/faucet.js";
import { Web3Provider } from '@ethersproject/providers'; 


// import dotenv from "dotenv";
// dotenv.config();

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

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
    setWithdrawError("");
    setWithdrawSuccess("");
    const provider = new ethers.providers.JsonRpcProvider(process.env.HOLESKY_RPC_URL);
    console.log("url:", process.env.HOLESKY_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const ABI = [
      "function transfer(address to, uint256 amount) public returns (bool)"
    ];


    // const tokenContract = new ethers.Contract(process.env.SEPOLIA_CONTRACT_ADDRESS, ABI, wallet);
    //To
    const tokenContract = new ethers.Contract("0xf7C34b29fC625bEB1E9EbA543e6Cb91b43Aa9172", ABI, wallet);


    const tx = await tokenContract.transfer(process.env.WALLET_ADDRESS, 1000);
    //From



    console.log("Transaction Hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction Confirmed:", receipt);

  };

  return (<div>
    <div className="backgroundDiv">    </div>

      <section className="hero ">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet</h1>
            <p>Fast and reliable. 50 OCT/day.</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{!withdrawError ? <div style={{ color: "green" }}>Successfully sent</div>
                  :
                  <div style={{ color: "red" }}>User rejected {withdrawError}</div>}
                </div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            </div>
            {walletAddress &&

              <div className="box address-box">

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
                    <p>
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
