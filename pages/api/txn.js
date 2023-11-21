const { ethers } = require('ethers');
const axios = require('axios');

// Replace with your Ethereum wallet private key and Infura API key
const privateKey = 'YOUR_PRIVATE_KEY';
const infuraApiKey = 'YOUR_INFURA_API_KEY';

// Replace with the token you want to sell and the token you want to buy
const sellTokenSymbol = 'DAI'; // Example: DAI
const buyTokenSymbol = 'USDC'; // Example: USDC

// Replace with the amount of tokens to sell and the slippage tolerance
const amountToSell = ethers.utils.parseUnits('1', 18); // Example: 1 DAI
const slippageTolerance = 2; // 2% slippage tolerance

async function getUniswapTradeData() {
    const url = `https://api.1inch.exchange/v3.0/1/quote?fromTokenSymbol=${sellTokenSymbol}&toTokenSymbol=${buyTokenSymbol}&amount=${amountToSell.toString()}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching Uniswap trade data:', error.message);
        throw error;
    }
}

async function approveTokenForSwap(contract, amount) {
    try {
        const tx = await contract.approve('0x11111112542D85B3EF69AE05771c2dCCff4fAa26', amount);
        await tx.wait();
        console.log('Token approved for swap');
    } catch (error) {
        console.error('Error approving token for swap:', error.message);
        throw error;
    }
}

async function swapTokens(contract, amount, minAmountOut) {
    try {
        const tx = await contract.swapExactTokensForTokens(amount, minAmountOut, ['0x6B175474E89094C44Da98b954EedeAC495271d0F', '0xa0b86991c6218b36c1d19D4a2e9eb0cE360cf9AD'], '0x11111112542D85B3EF69AE05771c2dCCff4fAa26', Date.now() + 1000 * 60 * 10); // Set deadline to 10 minutes from now
        await tx.wait();
        console.log('Tokens swapped successfully');
    } catch (error) {
        console.error('Error swapping tokens:', error.message);
        throw error;
    }
}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraApiKey}`);
    const wallet = new ethers.Wallet(privateKey, provider);

    const uniswapTradeData = await getUniswapTradeData();
    const slippageAdjustedAmount = amountToSell.mul(ethers.BigNumber.from(100 - slippageTolerance)).div(100);

    const sellTokenContract = new ethers.Contract(uniswapTradeData.fromToken.address, ['function approve(address spender, uint256 amount)'], wallet);
    await approveTokenForSwap(sellTokenContract, slippageAdjustedAmount);

    const oneInchContract = new ethers.Contract('0x11111112542D85B3EF69AE05771c2dCCff4fAa26', ['function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external'], wallet);
    await swapTokens(oneInchContract, slippageAdjustedAmount, 0); // Set minAmountOut to 0 for a guaranteed swap

    // Additional logic can be added for handling the received tokens or checking the transaction status
}

main();
