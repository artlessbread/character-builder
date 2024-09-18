function generatePowers() {
    // Get selected attributes
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

    // Display the powers
    if (powersList.length === 0) {
        const noPowersMsg = document.createElement('p');
        noPowersMsg.textContent = 'No powers found for the selected combination.';
        outputDiv.appendChild(noPowersMsg);
        return;
    }

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

// Function to generate a unique character name based on selected attributes
function generateCharacterName(attributes) {
    // Attribute-based adjectives
    const fragments = {
        race: {
            'Human': ['Dependable', 'Ambitious', 'Versatile'],
            'Fey': ['Enigmatic', 'Mystical', 'Sylvan'],
            'Dwarf': ['Bearded', 'Resolute', 'Digging'],
            'Halfling': ['Cheerful', 'Lucky', 'Brave'],
        },
        body: {
            'Small': ['Tiny', 'Little', 'Teeny-Weeny'],
            'Big': ['Massive', 'Humongous', 'Colossal'],
            'Nimble': ['Agile', 'Twinkle-Toed', 'Lithe'],
            'Stout': ['Heavy-Boned', 'Plump', 'Hearty'],
        },
        mind: {
            'Simple-minded': ['Imbecile', 'Dull-Witted', 'Dense'],
            'Streetsmart': ['Shrewd', 'Slick', 'Cunning'],
            'Booksmart': ['Erudite', 'Learned', 'Scholarly'],
            'Wise': ['Sagacious', 'Enlightened', 'Insightful'],
        },
        background: {
            'Military': ['Disciplined', 'Martial', 'Steadfast'],
            'Criminal': ['Rogueish', 'Delinquent', 'Shadowy'],
            'Noble': ['Aristocratic', 'Regal', 'High-born'],
            'Craftsman': ['Handy', 'Skillful', 'Dexterous'],
        },
        disposition: {
            'Aggressive': ['Quarrelsome', 'Bold', 'Intrepid'],
            'Cautious': ['Wary', 'Spineless', 'Vigilant'],
            'Honest': ['Blunt', 'Sincere', 'Frank'],
            'Dishonest': ['Swindling', 'Corrupt', 'Duplicitous'],
        },
        class: {
            'Mage': ['Magus', 'Sorcerer', 'Wizard'],
            'Fighter': ['Gladiator', 'Warrior', 'Knight'],
            'Ranger': ['Scout', 'Archer', 'Huntress'],
        },
    };

    // Select one adjective per attribute (other than class)
    const selectedAdjectives = [];

    ['race', 'body', 'mind', 'background', 'disposition'].forEach(attr => {
        const options = fragments[attr][attributes[attr]];
        if (!options) {
            console.error(`No adjectives found for ${attr}: ${attributes[attr]}`);
            return;
        }
        const randomIndex = Math.floor(Math.random() * options.length);
        const adjective = options[randomIndex];
        selectedAdjectives.push(adjective);
    });

    // Randomly pick two adjectives from the selected ones
    const shuffledAdjectives = selectedAdjectives.sort(() => 0.5 - Math.random());
    const nameAdjectives = shuffledAdjectives.slice(0, 2);

    // Get the class title (randomly if multiple options)
    const classOptions = fragments.class[attributes.class];
    const randomClassIndex = Math.floor(Math.random() * classOptions.length);
    const classTitle = classOptions[randomClassIndex];

    // Combine to create the name
    const characterName = `${nameAdjectives[0]} ${nameAdjectives[1]} ${classTitle}`;

    return characterName;
}

