document.getElementById('get-price').addEventListener('click', async function() {
    const cardName = document.getElementById('card-name').value;

    if (!cardName) {
        alert("Please enter a card name.");
        return;
    }

    // Scryfall API URL to search for cards by name
    const apiUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(cardName)}`;

    try {
        // Fetch card data from Scryfall API
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log(data);  // Log the API response to the console

        if (!response.ok) {
            alert("Error fetching data. Please try again.");
            return;
        }

        // If no card is found
        if (data.data.length === 0) {
            document.getElementById('card-value').textContent = 'Card not found.';
        } else {
            // Get the first card's price and name
            const card = data.data[0];
            const price = card.prices.usd || "Price not available";
            const cardName = card.name;

            // Display the card price
            document.getElementById('card-value').textContent = `Price: $${price}`;

            // Add a button to save the card to the collection
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Add to Collection';
            saveButton.addEventListener('click', function() {
                addCardToCollection(cardName, price);
            });

            document.getElementById('card-value').appendChild(saveButton);
        }
    } catch (error) {
        console.error('Error fetching card data:', error);
        alert('An error occurred. Please try again.');
    }
});

// Initialize collection and total
let collection = JSON.parse(localStorage.getItem('collection')) || [];
let totalValue = parseFloat(localStorage.getItem('totalValue')) || 0;

// Function to update the UI with the collection and total value
function updateUI() {
    // Update the collection list
    const collectionList = document.getElementById('collection-list');
    collectionList.innerHTML = '';  // Clear the list
    collection.forEach(card => {
        const listItem = document.createElement('li');
        listItem.textContent = `${card.name} - $${card.price}`;
        collectionList.appendChild(listItem);
    });

    // Update the total value
    document.getElementById('total-value').textContent = totalValue.toFixed(2);
}

// Function to add a card to the collection
function addCardToCollection(name, price) {
    // Add the card to the collection
    collection.push({ name, price: parseFloat(price) });
    
    // Update the total value
    totalValue += parseFloat(price);

    // Save the collection and total value to local storage
    localStorage.setItem('collection', JSON.stringify(collection));
    localStorage.setItem('totalValue', totalValue.toFixed(2));

    // Update the UI
    updateUI();
}

// Initial call to update UI if there is data in local storage
updateUI();
