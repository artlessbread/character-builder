// 1. MAIN FUNCTION TO GENERATE POWERS AND DISPLAY RESULTS
function generatePowers() {
    // Get the form and gather selected attributes
    const form = document.getElementById('character-form');
    const selectedAttributes = {
        class: form.elements['class'].value,
        race: form.elements['race'].value,
        body: form.elements['body'].value,
        mind: form.elements['mind'].value,
        background: form.elements['background'].value,
        disposition: form.elements['disposition'].value,
    };

    // Check that all categories have a selection
    for (let key in selectedAttributes) {
        if (!selectedAttributes[key]) {
            alert(`Please select an option for ${key}.`);
            return;
        }
    }

    // Generate the character name
    const characterName = generateCharacterName(selectedAttributes);

    // Create a list of attributes in a particular order (reverse, for example)
    const attributeOrder = ['disposition', 'background', 'mind', 'body', 'race', 'class'];
    const attributeList = attributeOrder.map(attr => selectedAttributes[attr]);

    // Generate attribute pairs and collect powers
    // (Requires a 'powers' object, typically loaded from powers.js)
    const attributeKeys = Object.keys(selectedAttributes);
    let powersList = [];
    for (let i = 0; i < attributeKeys.length; i++) {
        for (let j = i + 1; j < attributeKeys.length; j++) {
            const attr1 = selectedAttributes[attributeKeys[i]];
            const attr2 = selectedAttributes[attributeKeys[j]];

            const key1 = `${attr1}+${attr2}`;
            const key2 = `${attr2}+${attr1}`;

            // Check if either combination exists in the powers object
            if (powers[key1]) {
                powersList.push(powers[key1]);
            } else if (powers[key2]) {
                powersList.push(powers[key2]);
            }
        }
    }

    // Sort the powers for consistent display
    powersList.sort();

    // Display the output in the #powers-output container
    const outputDiv = document.getElementById('powers-output');
    outputDiv.innerHTML = '';  // Clear previous output

    // Prominent header for the character name
    const nameHeader = document.createElement('h2');
    nameHeader.style.fontSize = '2em';
    nameHeader.style.marginBottom = '0.5em';
    nameHeader.textContent = `You are a... ${characterName.toUpperCase()}`;
    outputDiv.appendChild(nameHeader);

    // Small text for attribute list
    const attributesText = document.createElement('p');
    attributesText.style.fontSize = '0.9em';
    attributesText.style.color = '#555';
    attributesText.textContent = `Attributes: ${attributeList.join(', ')}`;
    outputDiv.appendChild(attributesText);

    // Display the powers or a "no powers" message
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

    // Log the character creation (date/time, attributes, name) to localStorage
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


// 2. FUNCTION TO GENERATE A RANDOM NAME (2 ADJECTIVES + 1 CLASS TITLE)
function generateCharacterName(attributes) {
    // Example fragment data (adjectives, class titles, etc.)
    // Feel free to expand or replace with your own data
    const fragments = {
        race: {
            'Human': ['Valiant', 'Stalwart', 'Noble'],
            'Fey': ['Enigmatic', 'Sylvan', 'Arcane'],
            'Dwarf': ['Resolute', 'Iron', 'Sturdy'],
            'Halfling': ['Cheerful', 'Nimble', 'Wily'],
        },
        body: {
            'Small': ['Tiny', 'Little', 'Minute'],
            'Big': ['Massive', 'Gigantic', 'Colossal'],
            'Nimble': ['Agile', 'Swift', 'Lithe'],
            'Stout': ['Robust', 'Hale', 'Hearty'],
        },
        mind: {
            'Simple-minded': ['Plain', 'Earnest', 'Open'],
            'Streetsmart': ['Shrewd', 'Astute', 'Cunning'],
            'Booksmart': ['Erudite', 'Learned', 'Scholarly'],
            'Wise': ['Sagacious', 'Enlightened', 'Prudent'],
        },
        background: {
            'Military': ['Disciplined', 'Martial', 'Steadfast'],
            'Criminal': ['Rogue', 'Devious', 'Shadowy'],
            'Noble': ['Aristocratic', 'Regal', 'Imperial'],
            'Craftsman': ['Artisan', 'Skillful', 'Dexterous'],
        },
        disposition: {
            'Aggressive': ['Fierce', 'Bold', 'Intrepid'],
            'Cautious': ['Wary', 'Careful', 'Circumspect'],
            'Honest': ['Truthful', 'Sincere', 'Frank'],
            'Dishonest': ['Deceptive', 'Sly', 'Duplicitous'],
        },
        class: {
            'Mage': ['Magus', 'Sorcerer', 'Wizard', 'Warlock', 'Witch', 'Thaumaturgist'],
            'Fighter': ['Gladiator', 'Warrior', 'Knight', 'Dragoon', 'Raider', 'Grunt'],
            'Ranger': ['Scout', 'Archer', 'Huntress', 'Falconer', 'Trapper', 'Sniper'],
        },
    };

    // Collect one adjective from each of the five non-class attributes
    const selectedAdjectives = [];
    ['race', 'body', 'mind', 'background', 'disposition'].forEach(attr => {
        const options = fragments[attr][attributes[attr]] || [];
        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);
            selectedAdjectives.push(options[randomIndex]);
        }
    });

    // Shuffle and pick any two adjectives
    const shuffledAdjs = selectedAdjectives.sort(() => 0.5 - Math.random());
    const chosenAdjs = shuffledAdjs.slice(0, 2);

    // Select a random class title
    const classOptions = fragments.class[attributes.class] || ['Adventurer'];
    const randomClassIndex = Math.floor(Math.random() * classOptions.length);
    const classTitle = classOptions[randomClassIndex];

    // Final name: "Adjective Adjective ClassTitle"
    return `${chosenAdjs.join(' ')} ${classTitle}`;
}


// 3. FUNCTION TO LOG CHARACTER DATA TO LOCALSTORAGE
function logCharacter(entry) {
    let log = JSON.parse(localStorage.getItem('characterLog')) || [];
    log.push(entry);
    localStorage.setItem('characterLog', JSON.stringify(log));
}


// 4. FUNCTION TO VIEW THE LOGGED CHARACTERS
function viewLog() {
    const logContainer = document.getElementById('log-container');
    const logTableContainer = document.getElementById('log-table-container');
    logContainer.style.display = 'block';  // Show the log container

    let log = JSON.parse(localStorage.getItem('characterLog')) || [];

    if (log.length === 0) {
        logTableContainer.innerHTML = '<p>No characters created yet.</p>';
        return;
    }

    // Build a simple HTML table of logged data
    let html = `
        <table>
            <tr>
                <th>Date/Time (CEST)</th>
                <th>Class</th>
                <th>Race</th>
                <th>Body</th>
                <th>Mind</th>
                <th>Background</th>
                <th>Disposition</th>
                <th>Name</th>
            </tr>
    `;

    for (const entry of log) {
        html += `
            <tr>
                <td>${entry.datetime}</td>
                <td>${entry.class}</td>
                <td>${entry.race}</td>
                <td>${entry.body}</td>
                <td>${entry.mind}</td>
                <td>${entry.background}</td>
                <td>${entry.disposition}</td>
                <td>${entry.name}</td>
            </tr>
        `;
    }

    html += '</table>';
    logTableContainer.innerHTML = html;
}


// 5. FUNCTION TO CLEAR THE LOG
function clearLog() {
    localStorage.removeItem('characterLog');
    viewLog(); // Refresh the log display (will show "No characters created yet.")
}


// 6. UTILITY FUNCTION TO GET CURRENT CEST TIME STRING
function getCurrentCESTTimeString() {
    // Typically using Europe/Berlin for CEST
    const options = {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date());
}
