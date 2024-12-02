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

            // Display the card price
            document.getElementById('card-value').textContent = `Price: $${price}`;
        }
    } catch (error) {
        console.error('Error fetching card data:', error);
        alert('An error occurred. Please try again.');
    }
});
