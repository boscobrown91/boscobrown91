document.addEventListener("DOMContentLoaded", function () {
    // Login form validation
    const loginForm = document.querySelector(".login-container form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const tenantID = loginForm.querySelector("input[type='text']").value.trim();
        const password = loginForm.querySelector("input[type='password']").value.trim();
        
        if (tenantID === "" || password === "") {
            alert("Please enter both Tenant ID and Password.");
        } else {
            alert("Login Successful!");
        }
    });

    // Payment form validation and simulation
    const paymentForm = document.querySelector(".payment-container form");
    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const phoneNumber = paymentForm.querySelector("input[type='text']").value.trim();
        const amount = paymentForm.querySelector("input[type='number']").value.trim();

        if (!/^\d{10}$/.test(phoneNumber)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (amount === "" || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        // Simulate M-Pesa transaction
        alert(`Processing payment of KES ${amount} via M-Pesa for ${phoneNumber}...`);
        setTimeout(() => {
            alert("Payment Successful!");
        }, 2000);
    });
});
