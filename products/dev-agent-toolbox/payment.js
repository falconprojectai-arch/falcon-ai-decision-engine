"use strict";
(() => {
  const form = document.getElementById("tx-form");
  if (!form) return;
  const status = document.getElementById("tx-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const orderRef = document.getElementById("order-ref").value.trim();
    const email = document.getElementById("tx-email").value.trim();
    const amount = document.getElementById("tx-amount").value.trim();
    const txid = document.getElementById("txid").value.trim();
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(orderRef)) {
      status.textContent = "Enter the exact order reference from the written instructions.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Enter a valid contact email.";
      return;
    }
    if (!/^(?:\d+)(?:\.\d{1,6})?$/.test(amount) || Number(amount) <= 0) {
      status.textContent = "Enter the positive USDC amount shown in your written instructions.";
      return;
    }
    if (!/^0x[a-fA-F0-9]{64}$/.test(txid)) {
      status.textContent = "Enter a 0x-prefixed 32-byte transaction hash (64 hexadecimal characters).";
      return;
    }
    const subject = "Payment confirmation request — " + orderRef;
    const body = [
      "Order reference: " + orderRef,
      "Contact email: " + email,
      "Amount reported (USDC): " + amount,
      "Transaction hash: " + txid,
      "",
      "I understand this is a manual confirmation request. The order is not paid or accepted until the transaction is independently checked and confirmed by the service operator."
    ].join("\n");
    status.textContent = "Opening your email app. Review the details and send the draft; the payment is not yet confirmed.";
    window.location.href = "mailto:falcon.project.ai@gmail.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
