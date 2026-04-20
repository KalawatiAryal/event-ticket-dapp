# EventChain - Hybrid DApp for Event Ticketing

EventChain is a Hybrid DApp developed for the CN6035 Mobile and Distributed Systems coursework.

## Project Overview

This project allows users to:
- connect MetaMask
- create blockchain-based events
- buy tickets using Ethereum transactions

The project demonstrates how a frontend application can interact with a Solidity smart contract through MetaMask and Hardhat.

## Technologies Used

- Solidity
- Ethereum
- Hardhat
- MetaMask
- HTML
- CSS
- JavaScript
- Ethers.js

## Features

- Wallet connection with MetaMask
- Event creation
- Ticket purchase
- Smart contract interaction
- Blockchain transaction handling

## Project Structure

- `contracts/` - Solidity smart contract files
- `scripts/` - deployment scripts
- `index.html` - frontend structure
- `style.css` - frontend design
- `app.js` - frontend blockchain interaction
- `hardhat.config.js` - Hardhat configuration
- `package.json` - project dependencies

## How to Run the Project Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Compile the smart contract

```bash
npx hardhat compile --force
```

### 3. Start Hardhat local blockchain

```bash
npx hardhat node
```

### 4. Deploy the contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Start the frontend

```bash
npx serve . -l 8080
```

### 6. Open the project in browser

```text
http://localhost:8080
```

## MetaMask Setup

Add a custom network in MetaMask with the following details:

- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

Then import a funded Hardhat account using one of the private keys shown in the Hardhat node terminal.

## Smart Contract Functions

- `createEvent()` - creates and stores a new event on blockchain
- `buyTicket()` - allows users to buy a ticket
- `getEvent()` - returns event details
- `getEventsCount()` - returns the total number of events

## Purpose of the Project

The purpose of this project is to demonstrate how blockchain can be used in a practical application for secure event creation and ticket purchasing. It also shows wallet connection, smart contract interaction, and blockchain transaction handling.

## Author

Name: Kalawati Aryal  
Student ID: 2659942

## Module

CN6035 Mobile and Distributed Systems Coursework
