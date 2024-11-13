function saveSettings() {
    const restaurantName = document.getElementById('restaurantName').value;
    const printerSize = document.getElementById('printerSize').value;
    const address = document.getElementById('address').value;
    const gstStatus = document.getElementById('gstStatus').value;
    const gstPercentage = document.getElementById('gstPercentage').value;

    const settings = {
        restaurantName,
        printerSize,
        address,
        gstStatus,
        gstPercentage: parseFloat(gstPercentage) || 0, // Store GST percentage as a number
    };

    if (restaurantName && printerSize && address && gstStatus) {
        localStorage.setItem('settings', JSON.stringify(settings));
        alert('Settings saved!');
    } else {
        alert('Please fill in all fields!');
    }
}

function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));

    if (savedSettings) {
        document.getElementById('restaurantName').value = savedSettings.restaurantName || '';
        document.getElementById('printerSize').value = savedSettings.printerSize || '';
        document.getElementById('address').value = savedSettings.address || '';
        document.getElementById('gstStatus').value = savedSettings.gstStatus || '';
        document.getElementById('gstPercentage').value = savedSettings.gstPercentage || ''; // Load GST percentage
    }
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);
