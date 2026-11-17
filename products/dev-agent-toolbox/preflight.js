"use strict";
(() => {
  const form = document.getElementById("preflight");
  if (!form) return;
  const status = document.getElementById("preflight-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("contact-email").value.trim();
    const problem = document.getElementById("problem").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Enter a valid email address.";
      return;
    }
    if (problem.length < 20) {
      status.textContent = "Please describe the issue in at least 20 characters.";
      return;
    }
    const subject = "API contract review — free preflight";
    const body = "Contact email: " + email + "\n\nProblem summary:\n" + problem +
      "\n\nI understand this is a no-obligation scope inquiry, not an order or payment.";
    status.textContent = "Opening your email app. Review the draft and send it to submit your inquiry.";
    window.location.href = "mailto:falcon.project.ai@gmail.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();