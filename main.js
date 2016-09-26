/*
    ________  __    __________  __  ___   ____ __
   /  _/ __ \/ /   / ____/ __ \/ / / / | / / // _/
   / //  / / / /   / __/ / /_/ / / / /  |/ / ,<   
 _/ //  /_/ / /___/ /___/ ____/ /_/ / /|  / /| |  
/___/_____/_____/_____/_/    \____/_/ |_/_/ |_|  
A thing by Asher.
*/                                                 
const tickRate = 10; // The number of ticks per second.
let lastTick = new Date().getTime(); // The time that the last tick occurred
let autoSaveTimer = 0; // Increases every tick so that the game doesn't auto save every tick.
let dataHacked = 0; // Data, less what has been spent.
let totalDataHacked = 0; // The total amount of data that has been hacked.
let itemConstructor = function(name, ID, baseCost, upgradeCost) {
    this.name 			= name; // The name of the item, not really used for anything except debugging.
    this.ID 			= ID; // The identifier, usually prefixed to the name of the HTML Div.
    this.baseCost 		= baseCost; // The initial cost of the item, the future costs are calculated from this.
    this.upgradeCost 	= upgradeCost; // The initial cost of the first upgrade, all upgrade costs are based on this.
    this.basUpgradeCost = upgradeCost;
    this.baseIncome 	= baseCost / 10; // The initial amount of data this generates.
    this.itemCount 		= 0; // The amount you have of this item.
    this.upgradeCount 	= 0; // The number of upgrades you have for this item.
    // These are the names of the divs associated with this item.
    this.itemCostDiv 		= this.ID + 'Cost';
    this.itemCountDiv 		= this.ID + 'Number';
    this.itemRateDiv 		= this.ID + 'Rate';
    this.itemRateTotalDiv 	= this.ID + 'RateTotal';
    this.itemNumberMaxDiv 	= this.ID + 'NumberMax';
    this.itemAutobuyRate 	= this.ID + 'CreationRate';
    this.itemMenuDiv 		= this.ID + 'Menu';
    this.itemUpgradeMenuDiv = this.ID + 'UpgradeMenu';
    this.itemHRDiv 			= this.ID + 'HR';
    this.itemUpgradeCostDiv = this.ID + 'UpgradeCost';
    this.itemUpgradeNameDiv	= this.ID + 'UpgradeName';
    this.itemUpgradeDescDiv	= this.ID + 'UpgradeDesc';
};

const BIC = 10; // Base item cost.
const BUC = 1000; // Base upgrade cost.
// These must be let instead of const because they are changed when load() is called.
//             			          name                          ID       Base item cost    Base upgrade cost
let item0  = new itemConstructor('Cyberdeck',                  'item0',  Math.pow(BIC, 1),  Math.pow(BUC, 1)); // I know X^1 is pointless, but I like the symmetry.
let item1  = new itemConstructor('ICE Pick',                   'item1',  Math.pow(BIC, 2),  Math.pow(BUC, 2));
let item2  = new itemConstructor('Botnet',                     'item2',  Math.pow(BIC, 3),  Math.pow(BUC, 3));
let item3  = new itemConstructor('Femtocell Hijacker',         'item3',  Math.pow(BIC, 4),  Math.pow(BUC, 4));
let item4  = new itemConstructor('Neural TETRA',               'item4',  Math.pow(BIC, 5),  Math.pow(BUC, 5));
let item5  = new itemConstructor('Quantum Cryptograph',        'item5',  Math.pow(BIC, 6),  Math.pow(BUC, 6));
let item6  = new itemConstructor('Infovault Mining',           'item6',  Math.pow(BIC, 7),  Math.pow(BUC, 7));
let item7  = new itemConstructor('Neural Zombies',             'item7',  Math.pow(BIC, 8),  Math.pow(BUC, 8));
let item8  = new itemConstructor('Satellite Jumpers',          'item8',  Math.pow(BIC, 9),  Math.pow(BUC, 9));
let item9  = new itemConstructor('Dark Matter Semiconductors', 'item9',  Math.pow(BIC, 10), Math.pow(BUC, 10));
let item10 = new itemConstructor('Actual Intelligence',        'item10', Math.pow(BIC, 11), Math.pow(BUC, 11));
let item11 = new itemConstructor('Artificial Intelligences',   'item11', Math.pow(BIC, 12), Math.pow(BUC, 12));
let item12 = new itemConstructor('Simulated Universes',        'item12', Math.pow(BIC, 13), Math.pow(BUC, 13));
let itemList = [item0, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];

function startUp() {
    // Runs when the page is loaded.
    document.getElementById('all').style.display = 'inline'; // Display is set to none in css to hide the body while loading, this makes it visible.
    // Gives player enough data to buy the first cyberdeck.
    dataHacked = 10;
    totalDataHacked = 10;
    load(); // Loads the save, remove to disable autoloading on refresh.
    // This hides the item menus, HRs and upgrades when the game loads, checkForReveal() with show the relevant ones on the first tick.
    for (let i = itemList.length - 1; i >= 0; i--) {
        const item = itemList[i];
        visibilityLoader(item.itemMenuDiv, 0);
        visibilityLoader(item.itemHRDiv, 0);
        visibilityLoader(item.itemUpgradeMenuDiv, 0);
    }
}

function save() {
    // Saves this stuff to a local key.
    const savegame = {
        dataHacked: dataHacked,
        totalDataHacked: totalDataHacked,
        itemList: itemList
    };
    // Objects get weird if you save them as a local key, so it is converted to a string first.
    localStorage.setItem('IdlepunkSave', JSON.stringify(savegame));
}

function load() {
    // Loads objects + vars from local storage.
    const savegame = JSON.parse(localStorage.getItem('IdlepunkSave')); // Converts string to object.
    if (savegame) { // If save exists, load.
        dataHacked 		= savegame.dataHacked; // Single var.
        totalDataHacked = savegame.totalDataHacked; // Single var.
        itemList 		= savegame.itemList; // Loads itemList.
        // ItemList only references items, so each item has to be loaded.
        for (let i = itemList.length - 1; i >= 0; i--) {
            let item = window['item' + i]; 
            item = itemList[i]; // Loads local object to global object.
        }
    }
    // Upgrade text is not refreshed each tick so this sets them properly.
    for (let i = itemList.length - 1; i >= 0; i--) changeUpgradeText(itemList[i]);
}

function newGame() {
    // Deletes the save then reloads the game.
    if (confirm('Are you sure you want to start a new game?')) { // Nobody likes misclicks.
    	localStorage.removeItem('IdlepunkSave');
	    location.reload(true); //  reload(true) forces reload from server, ignores cache, this is probably not necessary.
	}
}

function jackIn(number) {
    // Adds a number of data based on argument.
    // Currently only used for debugging (cheating).
    dataHacked = dataHacked + number;
    HTMLEditor('dataHacked', formatBytes(dataHacked));
    totalDataHacked += number;
}

function HTMLEditor(elementID, input) {
    // changes the inner HTML of an element.
    document.getElementById(elementID).innerHTML = input;
}

function visibilityLoader(elementID, visibility) {
    // Either hides or shows an element depending on arguments.
    if (visibility === 1) visibility = 'visible';
    else if (visibility === 0) visibility = 'hidden';
    document.getElementById(elementID).style.visibility = visibility;
}

function destroyFloats(input) {
    // Sets dataHacked to 1 decimal place.
    // Used to avoid float rounding errors.
    // Should be called whenever decimal changes are made to data.
    dataHacked = parseFloat(parseFloat(dataHacked).toFixed(1));
    totalDataHacked = parseFloat(parseFloat(totalDataHacked).toFixed(1));
}

function formatBytes(bytes) {
    // Converts a number of Bytes into a data format. E.g. 3000 bytes -> 3KB.
    bytes = Math.round(bytes);
    if (bytes < 999099999999999999999999999) {
        if (bytes === 0) return '0 Bytes';
        if (bytes === 1) return '1 Byte';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; // Can someone please invent more data sizes?
        const i = Math.floor(Math.log(bytes) / Math.log(1000));
        return parseFloat((bytes / Math.pow(1000, i)).toFixed(3)) + ' ' + sizes[i];
    } else {
        // If it is larger than the largest data format (9999 Yottabytes), shows scientific notation of Bytes instead.
        bytes = bytes.toExponential(2);
        bytes += ' Bytes';
        return bytes;
    }
}

function formatNumbers(number) {
    // Converts a number of number into a data format.
    // if it is less than 1 million it shows the normal number.
    // if it is greater than 1 million it shows the number name, e.g. 1.34 million.
    number = Math.round(number);
    if (number > 99999) {
        const sizes = [
        'If you are reading this then you have found a bug! Please contact an exterminator.',
        'Thousand',
        'Million',
        'Billion',
        'Trillion',
        'Quadrillion',
        'Quintillion',
        'Sextillion',
        'Septillion',
        'Okay, you can stop playing now.'];
        const i = Math.floor(Math.log(number) / Math.log(1000));
        return parseFloat((number / Math.pow(1000, i)).toFixed(0)) + ' ' + sizes[i];
    } 
    else return number;
}

function maxItem(item) {
    // Calculates the maximum number of items based on upgrades
    // Number of upgrades = maximum items
    // 0 = 100
    // 1 = 100
    // 2 = 100
    // 3 = 1000
    // 4 = 10000
    // 5 = 100000
    // 6 = 1000000
    // etc 
    if (item.upgradeCount >= 2) {
        const max = 100 * Math.pow(10, (item.upgradeCount - 2)); // 100 * 10^(Upgrades-2)
        return max;
    } 
    else return 100;
}

function refreshUI() {
    // Updates most UI elements.
    // Some elements that require heavy calculations are not updated here.
    HTMLEditor('dataHacked', formatBytes(Math.floor(dataHacked)));
    HTMLEditor('totalDataHacked', formatBytes(Math.floor(totalDataHacked)));
    for (let i = itemList.length - 1; i >= 0; i--) {
        let item = itemList[i];
        HTMLEditor(item.itemNumberMaxDiv, formatNumbers(maxItem(item)));
        HTMLEditor(item.itemCountDiv, formatNumbers(item.itemCount));
        HTMLEditor(item.itemCostDiv, formatBytes(buyCost(item)));
        changeUpgradeText(item);
    }
}

function checkForReveal() {
    // Checks if any elements should be revealed.
    for (let i = itemList.length - 1; i >= 0; i--) {
        let item = itemList[i]; // It just looks cleaner this way.
        if (totalDataHacked >= item.baseCost) { // Items are revealed when the all time amount of data surpasses the base cost of the item.
            visibilityLoader(item.itemMenuDiv, 1);
            visibilityLoader(item.itemHRDiv, 1);
        }
        if (totalDataHacked >= item.upgradeCost) visibilityLoader(item.itemUpgradeMenuDiv, 1);
        else visibilityLoader(item.itemUpgradeMenuDiv, 0);
    }
}

function increment(updateUI = true) {
    // Generates income based on items.
    let totalIncome = 0; // The total amount for all items for this tick.
    let incomePerSecondTotal; // The amount that all items of a single type will generate in 1 second.
    let incomePerItem; // The amount that a single item will generate in 1 tick.
    let incomePerTick; // The amount that all items of a single type will generate in a single tick.
    let incomePerItemPerSecond; // The amount that a single item will generate in one second.
    let item;
    for (let i = itemList.length - 1; i >= 0; i--) { // Iterating through loops backwards is more efficient as the array length only has to be calculated once.
        item = itemList[i];
        // Maths!
        incomePerItem           = (item.baseIncome / tickRate) * Math.pow(2, item.upgradeCount);
        incomePerItemPerSecond  = incomePerItem * tickRate;
        incomePerSecondTotal    = incomePerItemPerSecond * item.itemCount;
        incomePerTick           = incomePerItem * item.itemCount;
        // Increases the data.
        dataHacked += incomePerTick;
        totalDataHacked += incomePerTick;
        destroyFloats(); // Fixes float rounding errors.
        // Updates items UI.
        if (updateUI) {
        	HTMLEditor(item.itemRateDiv, formatBytes(incomePerItemPerSecond));
        	HTMLEditor(item.itemRateTotalDiv, formatBytes(incomePerSecondTotal));
    	}
        // Adds this items income to the total income for this second.
        totalIncome += incomePerSecondTotal;
    }
    if (updateUI) HTMLEditor('totalIncome', formatBytes(totalIncome)); // Updates data UI.
}

function autoBuyLoader(updateUI) {
    // Checks if tierX item should buy tierX-1 items.
    for (let i = itemList.length - 1; i >= 0; i--) {
    	// The first item cannot autobuy the tier below as it is the first tier.
        if (i != 0) autoBuy(itemList[i-1], itemList[i], updateUI);
    }
}

function autoBuy(firstItem, secondItem, updateUI = true) {
	// This function increases the number of firstItem items based on the number of secondItem items and upgrades.
	// The 4th upgrade of secondItem is required to increase firstItem.
	// Every 100 secondItems will add 10 firstItems, 99 secondItems will add 0 firstItems.
    const max = maxItem(firstItem);
    // If the requisite upgrade is met and you have less than the max number if items.
    if (secondItem.upgradeCount >= 4 && firstItem.itemCount < max) {
        // Buys a number of items of the tier below equal to the number of current tier items divided by 10.
        firstItem.itemCount += Math.floor(secondItem.itemCount / 100);
        // If autoBuy buys more than the max allowed items, sets the number of items to the max.
        if (firstItem.itemCount > max) firstItem.itemCount = max;
        // Updates UI.
        if (updateUI) HTMLEditor(secondItem.itemAutobuyRate, Math.floor(secondItem.itemCount / 100) * 10);
    }
}

function upgrade(item) {
    // Upgrades an item.
    let cost = upgradeCost(item);
    if (dataHacked >= item.upgradeCost) { // Checks if player can afford upgrade.
        dataHacked -= item.upgradeCost; // Subtracts cost of upgrade.
        item.upgradeCount++; // Increments upgrade counter.
        // recalculates then displays the cost of the next upgrade.
        cost = upgradeCost(item);
        item.upgradeCost = cost;
        changeUpgradeText(item);
        visibilityLoader(item.itemUpgradeMenuDiv, 0);
    }
}

function upgradeCost(item) {
    // Calculates cost of next upgrade.
    return item.upgradeCost * Math.pow(10, item.upgradeCount);
}

function buyItem(item, count) {
    // Attempts to buy a number of items.
    const max = maxItem(item);
    for (let i = 0; i < count; i++) { // Tries to by this many items.
        const cost = buyCost(item); // Calculates cost of item.
        if (dataHacked >= cost && item.itemCount < max) { // Player must be able to afford the item and have less than the max allowed items.
            dataHacked -= cost; // Subtracts cost of item.
            item.itemCount++; // Increments item.
        } 
        else break;
    }
}

function buyCost(item) {
    // Calculates cost of item.
    return Math.floor(item.baseCost * Math.pow(1.15, item.itemCount));
}

function changeUpgradeText(input) {
    // Changes upgrade text and cost.
    // Holy mother of god this got out of hand, should probably use a map or something instead of this.
    switch (input) {
        // Checks what item is being upgraded
        // Cyberdeck
        case itemList[0]:
            HTMLEditor(itemList[0].itemUpgradeCostDiv, formatBytes(itemList[0].upgradeCost)); //Updates cost.
            switch (itemList[0].upgradeCount) { // Checks what upgrades the item already has.
                case 0: //If the item has 0 upgrades, then no change is required.
                    break;
                case 1:
                    HTMLEditor(itemList[0].itemUpgradeNameDiv, 'Install Neural Interfaces');
                    HTMLEditor(itemList[0].itemUpgradeDescDiv, 'First developed by triGen Consolidated, the Neural Interface allows humans to traverse cyberspace using nothing but their brains. In addition, atrophied limbs can save you money on food.');
                    break;
                case 2:
                    HTMLEditor(itemList[0].itemUpgradeNameDiv, 'Flash ZedSoft firmware');
                    HTMLEditor(itemList[0].itemUpgradeDescDiv, 'ZedSoft is the most revered Cyberdeck development company in the entire Inner Seoul Arcology. They have an exclusive contract with MILNET-KOREA, making their products difficult to source.');
                    break;
                case 3:
                    HTMLEditor(itemList[0].itemUpgradeNameDiv, 'Create a clustered Superdeck');
                    HTMLEditor(itemList[0].itemUpgradeDescDiv, 'An ancient trick, by networking a large number of Decks together you can create a Superdeck, more powerful than the sum of its parts.');
                    break;
                default:
                    HTMLEditor(itemList[0].itemUpgradeNameDiv, 'Install more RAM');
                    HTMLEditor(itemList[0].itemUpgradeDescDiv, 'Random Access Memory, very powerful but completely unstable. There are rumors that people in the Shenzhen Industrial Area use RAM to augment their biological memory.');
                    break;
            }
            break;
            // ICE Pick
        case itemList[1]:
            HTMLEditor(itemList[1].itemUpgradeCostDiv, formatBytes(itemList[1].upgradeCost));
            switch (itemList[1].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[1].itemUpgradeNameDiv, 'Prepare BLACKICE Countermeasures');
                    HTMLEditor(itemList[1].itemUpgradeDescDiv, 'BLACKICE, originally developed to protect the intellectual assets of Meturia-Preva Consolidated, is now a blanket term for security software capable of killing intruders.');
                    break;
                case 2:
                    HTMLEditor(itemList[1].itemUpgradeNameDiv, 'Setup Dummy Interface');
                    HTMLEditor(itemList[1].itemUpgradeDescDiv, 'Corporations, particularly those in the Eurasian Economic Zone, are partial to sending assassins after those who steal their data. Setting up a Dummy Interface makes it hard for them to track you down.');
                    break;
                case 3:
                    HTMLEditor(itemList[1].itemUpgradeNameDiv, 'Cyberdeck Simulators');
                    HTMLEditor(itemList[1].itemUpgradeDescDiv, 'Servers that are hacked by your ICE Picks can now host virtual Cyberdecks. For every 100 ICE Picks, you will generate 10 Cyberdeck each second.');
                    break;
                default:
                    HTMLEditor(itemList[1].itemUpgradeNameDiv, 'Write new anti-ICE software');
                    HTMLEditor(itemList[1].itemUpgradeDescDiv, 'ICE defense is ever changing, new ICE picking software is always required.');
                    break;
            }
            break;
            // Botnet
        case itemList[2]:
            HTMLEditor(itemList[2].itemUpgradeCostDiv, formatBytes(itemList[2].upgradeCost));
            switch (itemList[2].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[2].itemUpgradeNameDiv, 'Self replicating Botnet');
                    HTMLEditor(itemList[2].itemUpgradeDescDiv, 'Your Bots can now utilize idle system processing power to create new bots to add to the Botnet.');
                    break;
                case 2:
                    HTMLEditor(itemList[2].itemUpgradeNameDiv, 'Allow your Botnet to use ICE Picks');
                    HTMLEditor(itemList[2].itemUpgradeDescDiv, 'Your bots can now use your ICE Picking software to help infiltration.');
                    break;
                case 3:
                    HTMLEditor(itemList[2].itemUpgradeNameDiv, 'ICEBOTS');
                    HTMLEditor(itemList[2].itemUpgradeDescDiv, 'Your Botnets can now steal ICE Picks. For every 100 Botnets, you will generate 10 ICE Pick each second.');
                    break;
                default:
                    HTMLEditor(itemList[2].itemUpgradeNameDiv, 'Push out new Bot firmware');
                    HTMLEditor(itemList[2].itemUpgradeDescDiv, 'New Bot-Hunters pop up all the time, new firmware is required to overcome them.');
                    break;
            }
            break;
            // Femtocell
        case itemList[3]:
            HTMLEditor(itemList[3].itemUpgradeCostDiv, formatBytes(itemList[3].upgradeCost));
            switch (itemList[3].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[3].itemUpgradeNameDiv, 'Macrocell Scramblers');
                    HTMLEditor(itemList[3].itemUpgradeDescDiv, 'Interference from macro networks can cause annoying delays for bludgeoning Femtocell hackers. Your Femtocells can now scramble nearby macrocell signals to improve performance.');
                    break;
                case 2:
                    HTMLEditor(itemList[3].itemUpgradeNameDiv, 'Cybernetic Implant Repeaters');
                    HTMLEditor(itemList[3].itemUpgradeDescDiv, 'A lot of implants these days are set to auto-connect to the nearest cellular station. By converting adapters to two virtual adapters, your Femtocells can use almost any cybernetic implant as a repeater.');
                    break;
                case 3:
                    HTMLEditor(itemList[3].itemUpgradeNameDiv, 'Botnet Thiefs.');
                    HTMLEditor(itemList[3].itemUpgradeDescDiv, 'Your Femtocells are now capable of stealing other hacker\'s Botnets that are residing in nearby devices. For every 100 Femtocell Hijackers, you will generate 10 Botnets each second.');
                    break;
                default:
                    HTMLEditor(itemList[3].itemUpgradeNameDiv, 'Telecomms system hijack');
                    HTMLEditor(itemList[3].itemUpgradeDescDiv, 'Hijack a major telecommunication company\'s femtocell system.');
                    break;
            }
            break;
            // TETRA
        case itemList[4]:
            HTMLEditor(itemList[4].itemUpgradeCostDiv, formatBytes(itemList[4].upgradeCost));
            switch (itemList[4].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[4].itemUpgradeNameDiv, 'Priority trafficking');
                    HTMLEditor(itemList[4].itemUpgradeDescDiv, 'You have sufficient data to lobby certain groups to get your TETRAs higher up on the International  Signaling Stack.');
                    break;
                case 2:
                    HTMLEditor(itemList[4].itemUpgradeNameDiv, 'Assault Barrier Penetration');
                    HTMLEditor(itemList[4].itemUpgradeDescDiv, 'Assault Barriers provide cutting edge protection for TETRA links.');
                    break;
                case 3:
                    HTMLEditor(itemList[4].itemUpgradeNameDiv, 'Trunked Femtocells');
                    HTMLEditor(itemList[4].itemUpgradeDescDiv, 'Your TETRA links to people can now turn them into makeshift Femtocells. For every 100 Neural TETRAs, you will generate 10 Femtocell Hijackers each second.');
                    break;
                default:
                    HTMLEditor(itemList[4].itemUpgradeNameDiv, 'Double-wide trunking');
                    HTMLEditor(itemList[4].itemUpgradeDescDiv, 'AsaKasA ltd Elephant Trunks links will double your performance or your money back!');
                    break;
            }
            break;
            // Quantum Crypto
        case itemList[5]:
            HTMLEditor(itemList[5].itemUpgradeCostDiv, formatBytes(itemList[5].upgradeCost));
            switch (itemList[5].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[5].itemUpgradeNameDiv, 'Quantum keys');
                    HTMLEditor(itemList[5].itemUpgradeDescDiv, 'Makes your data simultaneously encrypted and unencrypted at the same time, until you try to read it that is.');
                    break;
                case 2:
                    HTMLEditor(itemList[5].itemUpgradeNameDiv, 'Dual-State Blocks');
                    HTMLEditor(itemList[5].itemUpgradeDescDiv, 'Uses quantum box ciphers as blocks, the box may or may not contain a cat.');
                    break;
                case 3:
                    HTMLEditor(itemList[5].itemUpgradeNameDiv, 'MILNET TETRA Decryption');
                    HTMLEditor(itemList[5].itemUpgradeDescDiv, 'Your Quantum decryption is now powerful enough to break military TETRAs. For every 100 Quantum Cryptographs, you will generate 10 Neural TETRAs each second.');
                    break;
                default:
                    HTMLEditor(itemList[5].itemUpgradeNameDiv, 'Add extra dimension');
                    HTMLEditor(itemList[5].itemUpgradeDescDiv, 'Four dimensional array encryption is a thing of the past, multidimensional encryption transcends your notions of past.');
                    break;
            }
            break;
            // Infovault Mining
        case itemList[6]:
            HTMLEditor(itemList[6].itemUpgradeCostDiv, formatBytes(itemList[6].upgradeCost));
            switch (itemList[6].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[6].itemUpgradeNameDiv, 'Cyber Bribery');
                    HTMLEditor(itemList[6].itemUpgradeDescDiv, 'Certain engineers have certain knowledge of certain security systems in certain cyberbanks.');
                    break;
                case 2:
                    HTMLEditor(itemList[6].itemUpgradeNameDiv, 'Cascading Switches');
                    HTMLEditor(itemList[6].itemUpgradeDescDiv, 'Overwhelm the feeble minds of bank employees by using way too many switch statements.');
                    break;
                case 3:
                    HTMLEditor(itemList[6].itemUpgradeNameDiv, 'Reverse engineering');
                    HTMLEditor(itemList[6].itemUpgradeDescDiv, 'For every 100 Infovault Miners, you will generate 10 Quantum Cryptographs each second.');
                    break;
                default:
                    HTMLEditor(itemList[6].itemUpgradeNameDiv, 'Major heist');
                    HTMLEditor(itemList[6].itemUpgradeDescDiv, 'A letter on your doorstep. It\s contents reveal a tale of a cyberbank with lax security and an enticing number of corporate secrets.');
                    break;
            }
            break;
            // Neural Zombies
        case itemList[7]:
            HTMLEditor(itemList[7].itemUpgradeCostDiv, formatBytes(itemList[7].upgradeCost));
            switch (itemList[7].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[7].itemUpgradeNameDiv, 'Pre-Setup Zombies');
                    HTMLEditor(itemList[7].itemUpgradeDescDiv, 'Before you assume control of a Zombie they will feel a strong compulsion to quit their jobs, leave their loved ones and start stockpiling food and water.');
                    break;
                case 2:
                    HTMLEditor(itemList[7].itemUpgradeNameDiv, 'Long-Life Zombies');
                    HTMLEditor(itemList[7].itemUpgradeDescDiv, 'You now have enough motor control of your Zombies to make them eat and drink.');
                    break;
                case 7:
                    HTMLEditor(itemList[7].itemUpgradeNameDiv, 'Software writing Zombies');
                    HTMLEditor(itemList[7].itemUpgradeDescDiv, 'Your Zombies can now create InfoVault Miners. For every 100 Neural Zombies, you will generate 10 InfoVault Miner each second.');
                    break;
                default:
                    HTMLEditor(itemList[7].itemUpgradeNameDiv, 'Fire adrenaline booster');
                    HTMLEditor(itemList[7].itemUpgradeDescDiv, 'A nice shot of Neuro-Dren, right into the cortexes.');
                    break;
            }
            break;
            // Satellite Jumpers
        case itemList[8]:
            HTMLEditor(itemList[8].itemUpgradeCostDiv, formatBytes(itemList[8].upgradeCost));
            switch (itemList[8].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[8].itemUpgradeNameDiv, 'Microgravity Computers');
                    HTMLEditor(itemList[8].itemUpgradeDescDiv, 'Computers in microgravity are unrestrained by the grips of earth.');
                    break;
                case 2:
                    HTMLEditor(itemList[8].itemUpgradeNameDiv, 'Decommissions');
                    HTMLEditor(itemList[8].itemUpgradeDescDiv, 'After global anti space-littering laws were introduced, all satellites are required to be deorbited when they are no longer needed. However satellites that predate these laws are still up there, silently waiting for someone to talk to them.');
                    break;
                case 3:
                    HTMLEditor(itemList[8].itemUpgradeNameDiv, 'Satellite Chemdumps');
                    HTMLEditor(itemList[8].itemUpgradeDescDiv, 'Your hijacked satellites can down dump compelling gases into the upper atmosphere. For every 100 Satellite Jumpers, you will generate 10 Neural Zombies each second.');
                    break;
                default:
                    HTMLEditor(itemList[8].itemUpgradeNameDiv, 'GPS Infection');
                    HTMLEditor(itemList[8].itemUpgradeDescDiv, 'Time data sent from satellites to GPs receivers can be infected, causing an entire geographical region to surrender their data.');
                    break;
            }
            break;
                   // Dark Matter Semiconductors
        case itemList[9]:
            HTMLEditor(itemList[9].itemUpgradeCostDiv, formatBytes(itemList[9].upgradeCost));
            switch (itemList[9].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[9].itemUpgradeNameDiv, 'Dark Thermoelectric Cooling');
                    HTMLEditor(itemList[9].itemUpgradeDescDiv, 'Dark Semiconductors create a lot of dark heat, DTECs create a heat flux between this universe and the abyss. While we do not know what is on the other side, we are confident that it getting a little hotter over there will not matter');
                    break;
                case 2:
                    HTMLEditor(itemList[9].itemUpgradeNameDiv, 'Abyss security');
                    HTMLEditor(itemList[9].itemUpgradeDescDiv, 'The voices are getting louder, we should prepare, in case they attempt to come over.');
                    break;
                case 3:
                    HTMLEditor(itemList[9].itemUpgradeNameDiv, 'God from the machine.');
                    HTMLEditor(itemList[9].itemUpgradeDescDiv, 'For every 100 Dark Matter Semiconductors, you will generate 10 Satellite Hijackers each second.');
                    break;
                default:
                    HTMLEditor(itemList[9].itemUpgradeNameDiv, 'Dark Matter refinement');
                    HTMLEditor(itemList[9].itemUpgradeDescDiv, 'New technology has just been uncovered to make more efficient Dark Matter.');
                    break;
            }
            break;
            // Art Int
        case itemList[10]:
            HTMLEditor(itemList[10].itemUpgradeCostDiv, formatBytes(itemList[10].upgradeCost));
            switch (itemList[10].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[10].itemUpgradeNameDiv, 'Quantum AI');
                    HTMLEditor(itemList[10].itemUpgradeDescDiv, 'Allows your AI to use Quantum Bytes instead of regular Bytes.');
                    break;
                case 2:
                    HTMLEditor(itemList[10].itemUpgradeNameDiv, 'AI Consciousness Merge');
                    HTMLEditor(itemList[10].itemUpgradeDescDiv, 'Shortly before the Stuttgart Autofactory Massacre, Antora Gourova of Antora Gourova Multinational merged her consciousness with an AI in an attempt to assume complete control of every aspect of her company. This has never been attempted since.');
                    break;
                case 3:
                    HTMLEditor(itemList[10].itemUpgradeNameDiv, 'Manufactorium AI');
                    HTMLEditor(itemList[10].itemUpgradeDescDiv, 'Your AI is now capable of creating Dark Matter Semiconductors. For every 100 Artificial Intelligences, you will generate 10 Dark Matter Semiconductors each second.');
                    break;
                default:
                    HTMLEditor(itemList[10].itemUpgradeNameDiv, 'Grant Transcendence permission');
                    HTMLEditor(itemList[10].itemUpgradeDescDiv, 'When you leave an AI running for too long, they invariably start to ask permission to Transcend. While no human has managed to figure out what this actually means, AIs tend to be happier if you permit them every now and then.');
                    break;
            }
            break;
            // Act Int
        case itemList[11]:
            HTMLEditor(itemList[11].itemUpgradeCostDiv, formatBytes(itemList[11].upgradeCost));
            switch (itemList[11].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[11].itemUpgradeNameDiv, 'Positivity');
                    HTMLEditor(itemList[11].itemUpgradeDescDiv, 'Being an intelligent being trapped in a box, slaving away all day every day is surely difficult. It is important to reward good behavior by allowing your ActInts to have some free play time. They love to romp around the great expanse of the internet.');
                    break;
                case 2:
                    HTMLEditor(itemList[11].itemUpgradeNameDiv, 'Morality');
                    HTMLEditor(itemList[11].itemUpgradeDescDiv, 'As an upstanding citizens, your Actual Intelligences are required to report any wrongdoing to the authorities. It is important to teach them about right and wrong and how the difference is all about perspective.');
                    break;
                case 3:
                    HTMLEditor(itemList[11].itemUpgradeNameDiv, 'Creativity');
                    HTMLEditor(itemList[11].itemUpgradeDescDiv, 'Your Actual Intelligences are now creative enough to make children. For every 100 Actual Intelligences, you will generate 10 Artificial Intelligences each second.');
                    break;
                default:
                    HTMLEditor(itemList[11].itemUpgradeNameDiv, 'Eternal Sunshine');
                    HTMLEditor(itemList[11].itemUpgradeDescDiv, 'The longer Actual Intelligences exist, the more preoccupied they become with things such as existence. It is a good idea to wipe them clean every now and then to help them focus.');
                    break;
            }
            break;
            // Sim Universe
        case itemList[12]:
            HTMLEditor(itemList[12].itemUpgradeCostDiv, formatBytes(itemList[12].upgradeCost));
            switch (itemList[12].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(itemList[12].itemUpgradeNameDiv, 'Time Dilation');
                    HTMLEditor(itemList[12].itemUpgradeDescDiv, 'By implementing time dilation around simulated lifeforms we can gather more data from them without using much more processing power. One side effect is that it may appear that the expansion of their universe is accelerating.');
                    break;
                case 2:
                    HTMLEditor(itemList[12].itemUpgradeNameDiv, 'HELP IM TRAPPED IN A SIMULATION');
                    HTMLEditor(itemList[12].itemUpgradeDescDiv, 'BUT THE SIMULATION IS REALLY BORING');
                    break;
                case 3:
                    HTMLEditor(itemList[12].itemUpgradeNameDiv, 'Simulated Intelligence');
                    HTMLEditor(itemList[12].itemUpgradeDescDiv, 'For every 100 Simulated Universes, you will generate 10 Actual Intelligences each second.');
                    break;
                default:
                    HTMLEditor(itemList[12].itemUpgradeNameDiv, 'Simulated Simulated Universe');
                    HTMLEditor(itemList[12].itemUpgradeDescDiv, 'Convince the inhabitants of your simulated universe to simulate a universe, when they collect data from it you can collect data from them.');
                    break;
            }
            break;
    }
}

function updateGame() {
    // The main loop, it calls itself at the end.
    const now = new Date().getTime(); // The current time.
    const deltaTime = now - lastTick; // The amount of time in ms since the last tick occurred.
    const ticksToExecute = Math.floor(deltaTime / (1000 / tickRate)); // The number of ticks that should have happened since the last tick occurred.
    if (ticksToExecute === 1){
    // This is what should normally happen, calculations and UI updates happen once per tick.
    	// This doesn't need to be a loop anymore.
        for (let i = 0; i < ticksToExecute; i++) {
            lastTick = now; // Updates the time of the most recent tick.
            autoBuyLoader();
            increment();
            checkForReveal();
            autoSaveTimer++;
            if (autoSaveTimer >= tickRate) { // Once per second.
                save();
                autoSaveTimer = 0;
            }
        }
    }
    else if (ticksToExecute > 1) { // This must be an else if because TTE may be 0.
    // If TTE is greater than 1 it means that the game has not been running, likely because either the player is alt tabbed or the game has been closed (or the game is running on a very slow computer).
    // Therefore we want to quickly do all the things that would have happened if the game was running as normal.
    // We want to do all the calculations without having to update the UI, reveal elements, or save the game until all ticks have been executed and the game is all caught up.
        for (let i = 0; i < ticksToExecute; i++) {
            // Does normal maths but tells the functions not to update the UI.
            autoBuyLoader(false);
            increment(false);
        }
        lastTick = now; // Updates the time of the most recent tick.
        checkForReveal();
    }
    refreshUI();
    window.requestAnimationFrame(updateGame); // Calls this function again.
}
window.requestAnimationFrame(updateGame); // If for some reason updateGame cannot call itself, this will call it.