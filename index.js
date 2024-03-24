/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const { ethers } = require("ethers");

const app = express();
const port = 3000;

// Initialize Web3 provider
const web3 = new Web3("https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const provider = new ethers.providers.JsonRpcProvider(
  "https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID"
);

// Connect to USDT contract
const usdtContractAddress = "USDT_CONTRACT_ADDRESS";
const usdtContractABI = [
  /* USDT ABI */
];
const usdtContract = new web3.eth.Contract(
  usdtContractABI,
  usdtContractAddress
);

// Handle JSON bodies
app.use(bodyParser.json());

// Handle form submissions
app.post("/sendTokens", async (req, res) => {
  const { walletAddress, amount, tokenType } = req.body;

  try {
    // Check if wallet address is valid
    // Implement additional validation if needed

    // Check balance
    const balance =
      tokenType === "USDT"
        ? await usdtContract.methods.balanceOf(faucetAddress).call()
        : await provider.getBalance(faucetAddress);
    if (balance < amount) {
      throw new Error("Insufficient balance in the faucet.");
    }

    // Send tokens
    const tx = {
      to: walletAddress,
      value: tokenType === "USDT" ? 0 : amount * 1e18, // ETH amount in Wei
      data:
        tokenType === "USDT"
          ? usdtContract.methods.transfer(walletAddress, amount).encodeABI()
          : "0x",
      gas: 2000000,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      "YOUR_PRIVATE_KEY"
    );
    const txHash = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({
      message: "Tokens sent successfully. Transaction hash: " + txHash,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to send tokens: " + error.message });
  }
});

// Serve frontend files
app.use(express.static("public"));

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
