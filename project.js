function generatePowers() {
    const form = document.getElementById('character-form');
    const selectedAttributes = {
        class: form.elements['class'].value,
        race: form.elements['race'].value,
        body: form.elements['body'].value,
        mind: form.elements['mind'].value,
        background: form.elements['background'].value,
        disposition: form.elements['disposition'].value,
    };

    // Check if all categories have a selection
    for (let key in selectedAttributes) {
        if (!selectedAttributes[key]) {
            alert(`Please select an option for ${key}.`);
            return;
        }
    }

       // Generate the character name
    const characterName = generateCharacterName(selectedAttributes);

    // Create an array of attributes in reverse order for the header
    const attributeOrder = ['disposition', 'background', 'mind', 'body', 'race', 'class'];
    const attributeList = attributeOrder.map(attr => selectedAttributes[attr]);

    // Generate attribute pairs and collect powers
    const attributeKeys = Object.keys(selectedAttributes);
    let powersList = [];

    for (let i = 0; i < attributeKeys.length; i++) {
        for (let j = i + 1; j < attributeKeys.length; j++) {
            const attr1 = selectedAttributes[attributeKeys[i]];
            const attr2 = selectedAttributes[attributeKeys[j]];

            // Create key combinations in both orders
            const key1 = `${attr1}+${attr2}`;
            const key2 = `${attr2}+${attr1}`;

            // Check if the combination exists in the powers object
            if (powers[key1]) {
                powersList.push(powers[key1]);
            } else if (powers[key2]) {
                powersList.push(powers[key2]);
            }
        }
    }

    // Sort powers alphabetically
    powersList.sort();

    // Display the character name prominently and attributes underneath
    const outputDiv = document.getElementById('powers-output');
    outputDiv.innerHTML = ''; // Clear previous output

    // Create the character name header
    const nameHeader = document.createElement('h2');
    nameHeader.style.fontSize = '2em';
    nameHeader.style.marginBottom = '0.5em';
    nameHeader.textContent = `You are a... ${characterName.toUpperCase()}`;
    outputDiv.appendChild(nameHeader);

    // Display the chosen attributes in smaller text
    const attributesText = document.createElement('p');
    attributesText.style.fontSize = '0.9em';
    attributesText.style.color = '#555';
    attributesText.textContent = `Attributes: ${attributeList.join(', ')}`;
    outputDiv.appendChild(attributesText);
    if (powersList.length === 0) {
        const noPowersMsg = document.createElement('p');
        noPowersMsg.textContent = 'No powers found for the selected combination.';
        outputDiv.appendChild(noPowersMsg);
    } else {
        const powersHeader = document.createElement('h3');
        powersHeader.textContent = 'Your Powers:';
        outputDiv.appendChild(powersHeader);

        powersList.forEach(power => {
            const powerDiv = document.createElement('div');
            powerDiv.className = 'power';
            powerDiv.innerHTML = `${power}`;
            outputDiv.appendChild(powerDiv);
        });
    }

    // Log the character
    logCharacter({
        datetime: getCurrentCESTTimeString(),
        class: selectedAttributes.class,
        race: selectedAttributes.race,
        body: selectedAttributes.body,
        mind: selectedAttributes.mind,
        background: selectedAttributes.background,
        disposition: selectedAttributes.disposition,
        name: characterName
    });
}

function generateCharacterName(attributes) {
    // Your existing generateCharacterName implementation.
    // ... (no changes needed here if you already have it implemented)
    // Ensure this function returns the generated character name as a string.
    // Placeholder return if needed:
    return "Example Name";
}

// Function to log character data in localStorage
function logCharacter(entry) {
    let log = JSON.parse(localStorage.getItem('characterLog')) || [];
    log.push(entry);
    localStorage.setItem('characterLog', JSON.stringify(log));
}

// Function to display the log
function viewLog() {
    const logContainer = document.getElementById('log-container');
    const logTableContainer = document.getElementById('log-table-container');
    logContainer.style.display = 'block';

    let log = JSON.parse(localStorage.getItem('characterLog')) || [];

    if (log.length === 0) {
        logTableContainer.innerHTML = '<p>No characters created yet.</p>';
        return;
    }

    let html = '<table><tr><th>Date/Time (CEST)</th><th>Class</th><th>Race</th><th>Body</th><th>Mind</th><th>Background</th><th>Disposition</th><th>Name</th></tr>';

    for (const entry of log) {
        html += `<tr>
            <td>${entry.datetime}</td>
            <td>${entry.class}</td>
            <td>${entry.race}</td>
            <td>${entry.body}</td>
            <td>${entry.mind}</td>
            <td>${entry.background}</td>
            <td>${entry.disposition}</td>
            <td>${entry.name}</td>
        </tr>`;
    }

    html += '</table>';
    logTableContainer.innerHTML = html;
}

// Function to clear the log
function clearLog() {
    localStorage.removeItem('characterLog');
    viewLog();
}

// Utility function to get current CEST time string
function getCurrentCESTTimeString() {
    // CEST is often represented by Europe/Berlin timezone
    // This will give a string like "DD/MM/YYYY, HH:MM:SS"
    const options = { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', 
                      hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date());
}
