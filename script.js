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

            // Create and append the 'Add to Collection' button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Add to Collection';
            saveButton.style.marginTop = '10px';  // Add some spacing
            saveButton.addEventListener('click', function() {
                console.log(`Adding ${cardName} to collection`);
                addCardToCollection(cardName, price, selectedVersion);
            });

            // Create a container div for the button
            const buttonContainer = document.createElement('div');
            buttonContainer.appendChild(saveButton);

            // Create a dropdown to choose the version
            const versionSelect = document.createElement('select');
            versionSelect.setAttribute('id', 'version-select');
            const versions = card.printings;  // Get the list of printings
            versions.forEach(version => {
                const option = document.createElement('option');
                option.value = version;
                option.textContent = version;
                versionSelect.appendChild(option);
            });

            versionSelect.addEventListener('change', function() {
                selectedVersion = versionSelect.value;
            });

            // Append the dropdown to the button container
            buttonContainer.appendChild(versionSelect);

            // Append the button container to the card value display area
            const cardValueArea = document.getElementById('card-value');
            cardValueArea.appendChild(buttonContainer);
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

    // Add each card to the list, along with a "Remove" button
    collection.forEach((card, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${card.name} - $${card.price} (${card.version})`;  // Display version

        // Create a container for the "Remove" button
        const removeButtonContainer = document.createElement('div');
        
        // Create a "Remove" button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', function() {
            removeCardFromCollection(index);
        });

        // Append the remove button to the button container
        removeButtonContainer.appendChild(removeButton);

        // Append the remove button container to the list item
        listItem.appendChild(removeButtonContainer);

        // Append the list item to the collection list
        collectionList.appendChild(listItem);
    });

    // Update the total value
    document.getElementById('total-value').textContent = totalValue.toFixed(2);
}

// Function to add a card to the collection
function addCardToCollection(name, price, version) {
    // Add the card with version to the collection
    collection.push({ name, price: parseFloat(price), version });
    
    // Update the total value
    totalValue += parseFloat(price);

    // Save the collection and total value to local storage
    localStorage.setItem('collection', JSON.stringify(collection));
    localStorage.setItem('totalValue', totalValue.toFixed(2));

    // Update the UI
    updateUI();
}

// Function to remove a card from the collection
function removeCardFromCollection(index) {
    // Remove the card at the given index
    const cardToRemove = collection[index];
    collection.splice(index, 1);

    // Update the total value
    totalValue -= cardToRemove.price;

    // Save the updated collection and total value to local storage
    localStorage.setItem('collection', JSON.stringify(collection));
    localStorage.setItem('totalValue', totalValue.toFixed(2));

    // Update the UI
    updateUI();
}

// Initial call to update UI if there is data in local storage
updateUI();
