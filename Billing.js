// Fetch cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Function to update the bill view
function updateBill() {
    const billTableBody = document.querySelector("#billTable tbody");
    billTableBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>${itemTotal.toFixed(2)}</td>
            <td><button class="remove-btn" onclick="removeItem(${index})">×</button></td>
        `;
        billTableBody.appendChild(row);
    });

    document.getElementById("totalAmount").textContent = `Total: ${total.toFixed(2)}`;
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
}

// Function to remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1); // Remove item by index
    updateBill(); // Refresh the bill view
}

// Open Checkout Modal
function openCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'flex';
}

// Close Checkout Modal
function closeModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Confirm Checkout and Show Success Modal with Customer Details
function confirmCheckout() {
    const customerName = document.getElementById('customerName').value;
    const customerContact = document.getElementById('customerContact').value;

    if (customerName && customerContact) {
        document.getElementById('successMessage').textContent = 
            `Thank you, ${customerName}! Total: ${document.getElementById("totalAmount").textContent}. Contact: ${customerContact}`;
        
        // Show Success Modal
        document.getElementById('successModal').style.display = 'block';
        
        // Clear cart and close the checkout modal
        localStorage.removeItem('cart');
        cart = [];
        updateBill();
        closeModal();
    } else {
        alert("Please fill in your name and contact details.");
    }
}

// Close Success Modal
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    window.location.href = 'Main.html';  // Redirect to home page after checkout
}

// Clear the Bill and Empty the Cart
function clearBill() {
    cart = [];
    localStorage.removeItem('cart');
    updateBill();
}

// Initialize the Bill on Page Load
document.addEventListener('DOMContentLoaded', updateBill);

function printBill() {
    const { jsPDF } = window.jspdf;

    if (!jsPDF) {
        console.error('jsPDF is not loaded properly');
        return;
    }

    const doc = new jsPDF('p', 'mm', [80, 297]);  // Custom paper size

    // Set font
    doc.setFont("helvetica");
    doc.setFontSize(8); // Font size adjusted for better fitting

    // Drawing line
    doc.line(5, 28, 57, 28); // Line after the header

    // Retrieve settings from localStorage
    const settings = JSON.parse(localStorage.getItem('settings')) || {};

    if (settings.restaurantName) doc.text(settings.restaurantName, 25, 32); // Restaurant Name
    if (settings.address) doc.text(settings.address, 25, 37); // Address

    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const customerName = document.getElementById("customerName") ? document.getElementById("customerName").value : "N/A";
    const customerContact = document.getElementById("customerContact") ? document.getElementById("customerContact").value : "N/A";

    doc.text(`Date: ${formattedDate}`, 5, 45);
    doc.text(`Name: ${customerName}`, 5, 50);
    doc.text(`No: ${customerContact}`, 5, 55);

    // Line separator after customer info
    doc.line(5, 60, 58, 60);

    // Table headings
    doc.setFontSize(7);
    doc.text('Item', 5, 65);
    doc.text('Price', 25, 65);
    doc.text('Qty', 40, 65);
    doc.text('Total', 50, 65);

    doc.line(5, 68, 58, 68); // Line below table headings

    let yPosition = 75;

    const table = document.querySelector("#billTable");
    const rows = table ? table.rows : [];

    // Loop through the bill table rows
    const maxRows = 10;  // Set a limit to prevent too many rows from being added
    for (let i = 1; i < rows.length && i <= maxRows; i++) {
        const cols = rows[i].cells;
        doc.text(cols[0].innerText, 5, yPosition);  // Item
        doc.text(cols[1].innerText, 25, yPosition); // Price
        doc.text(cols[2].innerText, 40, yPosition); // Qty
        doc.text(cols[3].innerText, 50, yPosition); // Total
        yPosition += 6; // Adjust space between rows
    }

    // Line separator before total
    doc.line(5, yPosition, 58, yPosition);

    const totalAmount = document.querySelector("#totalAmount") ? document.querySelector("#totalAmount").innerText.split(":")[1].trim() : "0";
    yPosition += 5;
    doc.text(`Total: ${totalAmount}`, 5, yPosition);

    if (settings.gstStatus === 'active') {
        const gstPercentage = settings.gstPercentage || 0;
        const gstAmount = (parseFloat(totalAmount) * gstPercentage) / 100;
        const totalWithGST = (parseFloat(totalAmount) + gstAmount).toFixed(2);

        yPosition += 5;
        doc.text(`GST (${gstPercentage}%): ${gstAmount.toFixed(2)}`, 5, yPosition);
        yPosition += 5;
        doc.text(`Total with GST: ${totalWithGST}`, 5, yPosition);
    }

    let billCounter = parseInt(localStorage.getItem('billCounter')) || 1;
    const formattedBillNumber = `bill_${String(billCounter).padStart(2, '0')}_${Date.now()}.pdf`;  // Added timestamp

    const pdfBlob = doc.output('blob');

    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = formattedBillNumber;

    // Simulate a click event on the link to trigger download
    link.dispatchEvent(new MouseEvent('click'));

    // Optionally remove the link after download
    setTimeout(() => {
        link.remove();
    }, 100);

    // Increment the bill counter
    localStorage.setItem('billCounter', billCounter + 1);

    // Optionally, redirect to the main page after printing
    window.location.href = 'Main.html';
}






// Close Success Modal
function closeSuccessModal() {
    document.getElementById("successModal").style.display = "none";
}

// Function to handle the checkout process (placeholder)
function openCheckoutModal() {
    document.getElementById("checkoutModal").style.display = "block";
}

function confirmCheckout() {
    // Here you can process the checkout, e.g., sending the data to the server
    document.getElementById("checkoutModal").style.display = "none";
    document.getElementById("successMessage").innerText = "Thank you for your purchase!";
    document.getElementById("successModal").style.display = "block";
}

function closeModal() {
    document.getElementById("checkoutModal").style.display = "none";
}

// Clear Bill
function clearBill() {
    const billTable = document.getElementById("billTable").getElementsByTagName('tbody')[0];
    billTable.innerHTML = "";
    document.getElementById("totalAmount").innerText = "Total: 0.00";
}
