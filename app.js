let provider;
let signer;
let contract;

const walletAddressEl = document.getElementById("walletAddress");
const connectBtn = document.getElementById("connectBtn");
const createEventBtn = document.getElementById("createEventBtn");
const refreshBtn = document.getElementById("refreshBtn");
const createStatusEl = document.getElementById("createStatus");
const eventsContainer = document.getElementById("eventsContainer");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function createEvent(string _name, string _date, string _description, uint256 _ticketPrice)",
  "function buyTicket(uint256 _eventId) payable",
  "function getEventsCount() view returns (uint256)",
  "function getEvent(uint256 _index) view returns (string, string, string, uint256, address, uint256)"
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed.");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    const userAddress = await signer.getAddress();
    walletAddressEl.textContent = formatAddress(userAddress);

    connectBtn.textContent = "Wallet Connected";
    connectBtn.disabled = true;

    alert("Wallet connected successfully.");
    await loadEvents();
  } catch (error) {
    console.error(error);
    alert("Failed to connect wallet: " + error.message);
  }
}

function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function createEvent() {
  if (!contract) {
    alert("Please connect your wallet first.");
    return;
  }

  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const description = document.getElementById("eventDescription").value.trim();
  const price = document.getElementById("eventPrice").value.trim();

  if (!name || !date || !description || !price) {
    alert("Please fill in all fields.");
    return;
  }

  const combinedDate = time ? `${date} ${time}` : date;
  const finalDescription = description;
  const priceInWei = ethers.utils.parseEther(price);

  try {
    createStatusEl.textContent = "Submitting transaction to blockchain...";
    alert("MetaMask will open. Please confirm the transaction to create the event.");

    const tx = await contract.createEvent(
      name,
      combinedDate,
      finalDescription,
      priceInWei
    );

    await tx.wait();

    createStatusEl.textContent = "Event created successfully on blockchain.";
    alert("Event created successfully.");

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventDescription").value = "";
    document.getElementById("eventPrice").value = "";

    await loadEvents();
  } catch (error) {
    console.error(error);
    createStatusEl.textContent = "Transaction failed.";
    alert("Event creation failed: " + error.message);
  }
}

async function buyTicket(eventId, ticketPrice) {
  if (!contract) {
    alert("Please connect your wallet first.");
    return;
  }

  try {
    alert("MetaMask will open. Please confirm the transaction to buy the ticket.");

    const tx = await contract.buyTicket(eventId, {
      value: ticketPrice
    });

    await tx.wait();

    alert("Ticket purchased successfully.");
    await loadEvents();
  } catch (error) {
    console.error(error);
    alert("Ticket purchase failed: " + error.message);
  }
}

async function loadEvents() {
  if (!contract) {
    eventsContainer.innerHTML = `<div class="empty-state">Connect your wallet to load events.</div>`;
    return;
  }

  try {
    const count = await contract.getEventsCount();
    const total = count.toNumber();

    if (total === 0) {
      eventsContainer.innerHTML = `<div class="empty-state">No events found yet. Create your first event.</div>`;
      return;
    }

    eventsContainer.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const eventItem = await contract.getEvent(i);

      const name = eventItem[0];
      const date = eventItem[1];
      const description = eventItem[2];
      const ticketPrice = eventItem[3];
      const creator = eventItem[4];
      const ticketsSold = eventItem[5];

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <h4>${escapeHtml(name)}</h4>
        <p class="event-meta"><strong>Date & Time:</strong> ${escapeHtml(date)}</p>
        <p class="event-description">${escapeHtml(description)}</p>
        <p class="event-meta"><strong>Ticket Price:</strong> ${ethers.utils.formatEther(ticketPrice)} ETH</p>
        <p class="event-meta"><strong>Tickets Sold:</strong> ${ticketsSold.toString()}</p>
        <p class="event-meta"><strong>Created By:</strong> ${escapeHtml(formatAddress(creator))}</p>
        <button class="buy-btn" onclick="buyTicket(${i}, '${ticketPrice.toString()}')">Buy Ticket</button>
      `;

      eventsContainer.appendChild(card);
    }
  } catch (error) {
    console.error("Load events failed:", error);
    alert("Could not load events: " + error.message);
    eventsContainer.innerHTML = `<div class="empty-state">Unable to load events.</div>`;
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

connectBtn.addEventListener("click", connectWallet);
createEventBtn.addEventListener("click", createEvent);
refreshBtn.addEventListener("click", loadEvents);

window.buyTicket = buyTicket;

window.addEventListener("load", () => {
  eventsContainer.innerHTML = `<div class="empty-state">Connect your wallet to begin using the DApp.</div>`;
});