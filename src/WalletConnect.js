import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

function WalletConnect() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [ethPrice, setEthPrice] = useState(0);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);

      const net = await provider.getNetwork();
      setNetwork(net.name);

      // Fetch ETH price
      const priceData = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );

      setEthPrice(priceData.data.ethereum.usd);

    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setBalance("");
    setNetwork("");
    setEthPrice(0);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Web3 Wallet Dashboard</h1>

      <button onClick={connectWallet} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Connect Wallet
      </button>

      {account && (
        <div style={{ marginTop: "30px" }}>
          <p>
            <b>Wallet Address:</b>{" "}
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>

          <p>
            <b>Balance:</b> {parseFloat(balance).toFixed(4)} ETH ($
            {(balance * ethPrice).toFixed(2)})
          </p>

          <p>
            <b>Network:</b> {network}
          </p>

          <button
            onClick={disconnectWallet}
            style={{
              marginTop: "15px",
              padding: "8px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;