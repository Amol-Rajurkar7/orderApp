const products = {
  burgers: [
    { name: "Classic Burger", price: 100, img: "./cb.jpg" },
    { name: "Veggie King Burger", price: 90, img: "./vb.jpg" },
    { name: "Chicken Maharaja Burger", price: 170, img: "./chb.jpg" },
    { name: "Shahi Paneer Burger", price: 190, img: "./spb.jpg" },
    { name: "Aloo Tikki Burger", price: 70, img: "./atb.jpg" }
  ],
  pizzas: [
    { name: "Cheese Pizza", price: 120, img: "./cp.jpg" },
    { name: "Pepperoni Pizza", price: 150, img: "./pcp.jpg" },
    { name: "Paneer Pizza", price: 140, img: "./pp.jpg" },
    { name: "Tandoori Chicken Pizza", price: 200, img: "./dcp.jpg" }
  ],
  drinks: [
    { name: "Coca Cola", price: 70, img: "./coke.jpg" },
    { name: "Orange Juice", price: 90, img: "./oj.jpg" },
    { name: "Ice Tea", price: 80, img: "./it.jpg" },
    { name: "Cold Coffee", price: 90, img: "./cf.jpg" }
  ],
  desserts: [
    { name: "Chocolate Ice Cream", price: 80, img: "./ci.jpg" },
    { name: "Brownie", price: 130, img: "./br.jpg" },
    { name: "Lava Cake", price: 100, img: "./lc.jpg" }
  ],
  comboOffers: [
    { name: "Cheese Pizza + Coca Cola", price: 89, img: "./pico.jpg" },
    { name: "Pepperoni Pizza + Orange Juice", price: 99, img: "./cpco.jpg" }
  ]
};

let currentOrder = [];
let orderNumber = 1;
let numberOfSets = 1;

const productContainer = document.getElementById("product-container");
const completeBtn = document.getElementById("complete");

function showPopup(message) {
  let popup = document.getElementById('popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'popup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#4caf50',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 9999,
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease',
      maxWidth: '90%',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    });
    document.body.appendChild(popup);
  }
  popup.textContent = message;
  popup.style.opacity = 1;
  popup.style.pointerEvents = 'auto';

  setTimeout(() => {
    popup.style.opacity = 0;
    popup.style.pointerEvents = 'none';
  }, 2000);
}

function loadProducts(category) {
  const items = products[category] || [];
  productContainer.innerHTML = items.map((item, index) => `
    <div class="product-card">
      <img src="${item.img}" alt="${item.name}" />
      <h4>${item.name}</h4>
      <p><b>Rs. ${item.price}</b></p>
      <button data-category="${category}" data-index="${index}">Add to Cart</button>
    </div>
  `).join('');

  productContainer.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      const idx = btn.dataset.index;
      addToOrder(products[cat][idx]);
    });
  });
}

function addToOrder(item) {
  const existing = currentOrder.find(entry => entry.item.name === item.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    currentOrder.push({ item, quantity: 1 });
  }
  showPopup(`${item.name} added to cart`);
  updateCompleteButton();
  const panel = document.getElementById("order-summary");
  if (panel) panel.style.display = 'none';
}

function removeFromOrder(name) {
  const idx = currentOrder.findIndex(entry => entry.item.name === name);
  if (idx >= 0) {
    currentOrder[idx].quantity -= 1;
    if (currentOrder[idx].quantity <= 0) currentOrder.splice(idx, 1);
    renderOrderSummary();
    updateCompleteButton();
  }
}

function renderOrderSummary() {
  let panel = document.getElementById("order-summary");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "order-summary";
    Object.assign(panel.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      border: '1px solid #ccc',
      padding: '20px',
      width: '340px',
      maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      zIndex: 10000,
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#333',
    });
    document.body.appendChild(panel);
  }

  if (currentOrder.length === 0) {
    panel.style.display = 'none';
    return;
  }

  const getTotal = () => currentOrder.reduce((sum, entry) =>
    sum + (entry.item.price * entry.quantity * numberOfSets), 0);

  panel.innerHTML = `
    <h3>Your Order</h3>
    <div style="margin-bottom: 12px;">
      <b>Number of Sets:</b>
      <button id="decrease-set" style="margin: 0 5px;">−</button>
      <span id="set-count">${numberOfSets}</span>
      <button id="increase-set" style="margin-left: 5px;">+</button>
    </div>
    <ul>
      ${currentOrder.map(entry => `
        <li style="margin-bottom: 8px;">
          ${entry.item.name} x ${entry.quantity * numberOfSets} - Rs. ${entry.item.price}
          <button class="remove-item" data-name="${entry.item.name}" style="margin-left: 10px; padding: 2px 6px; font-size:12px;">Remove</button>
        </li>
      `).join('')}
    </ul>
    <p><b>Total: Rs. ${getTotal()}</b></p>
    <button id="place-order" style="margin-right: 5px;">Place Order</button>
    <button id="cancel-order" style="margin-right: 5px;">Cancel</button>
    <button id="go-back">Go Back</button>
  `;

  panel.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => removeFromOrder(btn.dataset.name));
  });

  document.getElementById("increase-set").addEventListener("click", () => {
    numberOfSets++;
    renderOrderSummary();
  });

  document.getElementById("decrease-set").addEventListener("click", () => {
    if (numberOfSets > 1) {
      numberOfSets--;
      renderOrderSummary();
    }
  });

  document.getElementById("place-order").addEventListener("click", () => {
    placeOrder();
  });

  document.getElementById("cancel-order").addEventListener("click", cancelOrder);

  document.getElementById("go-back").addEventListener("click", () => {
    panel.style.display = 'none';
  });

  panel.style.display = 'block';
}

function updateCompleteButton() {
  const count = currentOrder.reduce((sum, entry) => sum + entry.quantity, 0);
  completeBtn.textContent = count > 0 ? `Complete Order (${count} item${count > 1 ? 's' : ''})` : 'Complete Order';
}

function saveReceipt(receiptText) {
  let receipts = JSON.parse(localStorage.getItem("savedReceipts") || "[]");
  receipts.push({ text: receiptText, timestamp: new Date().toISOString() });
  localStorage.setItem("savedReceipts", JSON.stringify(receipts));
}

function askPaymentMethod(onPaymentComplete) {
  const overlay = document.createElement('div');
  overlay.id = 'payment-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 12000
  });

  const modal = document.createElement('div');
  Object.assign(modal.style, {
    background: '#fff',
    padding: '20px 30px',
    borderRadius: '10px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '300px',
    width: '90%'
  });

  const msg = document.createElement('p');
  msg.textContent = "How would you like to pay?";

  const qrBtn = document.createElement('button');
  qrBtn.textContent = "Pay via QR Code";
  qrBtn.style.margin = "10px";
  qrBtn.style.padding = "8px 16px";

  const cashBtn = document.createElement('button');
  cashBtn.textContent = "Pay with Cash";
  cashBtn.style.margin = "10px";
  cashBtn.style.padding = "8px 16px";

  qrBtn.addEventListener("click", () => {
    modal.innerHTML = `<h4>Scan this QR to pay</h4>
      <img src="./rq.jpg" alt="QR Code" style="width: 200px; height: 200px;" />
      <p style="margin-top: 10px;">
        <button id="done-btn">Done</button>
      </p>`;
    document.getElementById('done-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (typeof onPaymentComplete === 'function') onPaymentComplete();
    });
  });

  cashBtn.addEventListener("click", () => {
    modal.innerHTML = `<h4>Please pay in cash at the counter.</h4>
      <p style="margin-top: 10px;">
        <button id="ok-btn">OK</button>
      </p>`;
    document.getElementById('ok-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (typeof onPaymentComplete === 'function') onPaymentComplete();
    });
  });

  modal.appendChild(msg);
  modal.appendChild(qrBtn);
  modal.appendChild(cashBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function placeOrder() {
  const total = currentOrder.reduce((sum, entry) => sum + (entry.item.price * entry.quantity * numberOfSets), 0);

  const receipt = `
Order #: ${orderNumber++}
----------------------------
${currentOrder.map(entry =>
    `${entry.item.name} x ${entry.quantity * numberOfSets} - Rs. ${entry.item.price}`
  ).join('\n')}
----------------------------
Number of Sets: ${numberOfSets}
Total: Rs. ${total}
Thank you for ordering!
  `.trim();

  // Show payment modal, then after payment show receipt & reset order
  askPaymentMethod(() => {
    alert(receipt);
    saveReceipt(receipt);

    currentOrder = [];
    numberOfSets = 1;
    renderOrderSummary();
    updateCompleteButton();
  });
}

function cancelOrder() {
  if (confirm("Cancel your entire order?")) {
    currentOrder = [];
    numberOfSets = 1;
    renderOrderSummary();
    updateCompleteButton();
    showPopup("Order cancelled");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadProducts("burgers");
  updateCompleteButton();

  document.querySelectorAll("[data-category]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      loadProducts(link.dataset.category);
      document.getElementById("sidebar").classList.remove("active");
    });
  });

  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
  });

  completeBtn.addEventListener("click", () => {
    if (currentOrder.length === 0) {
      alert("Your order is empty.");
      return;
    }
    renderOrderSummary();
  });
});

function showSavedReceipts() {
  const receipts = JSON.parse(localStorage.getItem("savedReceipts") || "[]");
  if (receipts.length === 0) {
    console.log("No saved receipts.");
  } else {
    receipts.forEach((r, i) => {
      console.log(`Receipt #${i + 1} (${new Date(r.timestamp).toLocaleString()}):\n${r.text}\n`);
    });
  }
}
