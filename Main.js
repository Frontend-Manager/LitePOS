// Fetch cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Function to add items to the cart
function addItemToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    updateCart();
}

// Update cart data and UI (cart item count)
function updateCart() {
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelector('.item-count').textContent = itemCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Custom function to show the empty cart alert
function showCustomAlert() {
    document.getElementById('customAlert').style.display = 'block';
}

// Close the custom alert
function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// Updated function to proceed to billing page
function proceedToBilling() {
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'billing.html';
    } else {
        showCustomAlert();  // Show custom alert instead of alert()
    }
}


// Initialize the cart count when the page loads
updateCart();
// Toggle the dropdown open/close
function toggleDropdown() {
    const dropdown = document.getElementById("categoryDropdown");
    dropdown.classList.toggle("open");
}

// Close dropdown if clicking outside of it
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("categoryDropdown");
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
    }
});

// Function to filter items by category and update the selected category in the dropdown
function filterItemsByCategory(category) {
    const selectedCategory = document.querySelector(".dropdown-selected");
    selectedCategory.textContent = category; // Set the selected text in dropdown
    toggleDropdown(); // Close dropdown after selection

    // Add your filtering logic here to display only items in the chosen category
    const items = document.querySelectorAll(".item-card");

    items.forEach(item => {
        const itemCategory = item.querySelector("p").innerText;
        if (category === "all" || itemCategory === category) {
            item.style.display = "block"; // Show item if it matches the selected category
        } else {
            item.style.display = "none"; // Hide items that don’t match
        }
    });
}
