/*
    ________  __    __________  __  ___   ____ __
   /  _/ __ \/ /   / ____/ __ \/ / / / | / / // _/
   / //  / / / /   / __/ / /_/ / / / /  |/ / ,<   
 _/ //  /_/ / /___/ /___/ ____/ /_/ / /|  / /| |  
/___/_____/_____/_____/_/    \____/_/ |_/_/ |_|  
A thing by Asher.
*/                
/*jshint esversion: 6 */                  
const saveName = 'idlepunkSave 0.4'               
const tickRate = 10; // The number of ticks per second.
let lastTick = new Date().getTime(); // The time that the last tick occurred
let autoSaveTimer = 0; // Increases every tick so that the game doesn't auto save every tick.
let dataHacked = 0; // Data, less what has been spent.
let totalDataHacked = 0; // The total amount of data that has been hacked.
let currentTheme = 0; // The current theme, the index of colorTheme[].
const colorTheme = [{ // An array of objects, each object is a theme.
    bodyColor: 'orange',
    clickColor: 'red',
    numberColor: '#ff0' //yellow
}, {
    bodyColor: '#FF5733',
    clickColor: '#C70039',
    numberColor: '#900C3F'
}, {
    bodyColor: '#FDFEFE',
    clickColor: '#515A5A',
    numberColor: '#AEB6BF'
}, {
    bodyColor: '#FF5733',
    clickColor: '#C70039',
    numberColor: '#900C3F'
}]
let itemConstructor = function(name, ID, baseCost, baseUpgradeCost) {
    this.name               = name; // The name of the item, not really used for anything except debugging.
    this.ID                 = ID; // The identifier, usually prefixed to the name of the HTML Div.
    this.baseCost           = baseCost; // The initial cost of the item, the future costs are calculated from this.
    this.baseUpgradeCost    = baseUpgradeCost; // The cost of the next upgrade.
    this.nextUpgradeCost    = baseUpgradeCost; //The cost of the next upgrade.
    this.baseIncome         = baseCost / 15; // The initial amount of data this generates.
    this.itemCount          = 0; // The amount you have of this item.
    this.upgradeCount       = 0; // The number of upgrades you have for this item.
    this.autoBuyCount       = 0; // The amount that has gone to an autobuy.
    // These are the names of the divs associated with this item.
    this.div = {
        cost        : ID + 'Cost',
        itemCount   : ID + 'Number',
        itemRate    : ID + 'Rate',
        rateTotal   : ID + 'RateTotal',
        numberMax   : ID + 'NumberMax',
        autobuyRate : ID + 'CreationRate',
        itemMenu    : ID + 'Menu',
        upgradeMenu : ID + 'UpgradeMenu',
        HR          : ID + 'HR',
        upgradeCost : ID + 'UpgradeCost',
        upgradeName : ID + 'UpgradeName',
        upgradeDesc : ID + 'UpgradeDesc'
    }
};

const BIC = 15; // Base item cost.
const BUC = 11; // Base upgrade cost.
// These cannot be const because they are changed when load() is called.
//                                name                          ID       item cost          upgrade cost
let item0  = new itemConstructor('Cyberdeck',                  'item0',  Math.pow(BIC, 1),  Math.pow(BUC, 3));
let item1  = new itemConstructor('ICE Pick',                   'item1',  Math.pow(BIC, 2),  Math.pow(BUC, 4));
let item2  = new itemConstructor('Botnet',                     'item2',  Math.pow(BIC, 3),  Math.pow(BUC, 5));
let item3  = new itemConstructor('Femtocell Hijacker',         'item3',  Math.pow(BIC, 4),  Math.pow(BUC, 6));
let item4  = new itemConstructor('Neural TETRA',               'item4',  Math.pow(BIC, 5),  Math.pow(BUC, 7));
let item5  = new itemConstructor('Quantum Cryptograph',        'item5',  Math.pow(BIC, 6),  Math.pow(BUC, 8));
let item6  = new itemConstructor('Infovault Mining',           'item6',  Math.pow(BIC, 7),  Math.pow(BUC, 9));
let item7  = new itemConstructor('Neural Zombies',             'item7',  Math.pow(BIC, 8),  Math.pow(BUC, 10));
let item8  = new itemConstructor('Satellite Jumpers',          'item8',  Math.pow(BIC, 9),  Math.pow(BUC, 11));
let item9  = new itemConstructor('Dark Matter Semiconductors', 'item9',  Math.pow(BIC, 10), Math.pow(BUC, 12));
let item10 = new itemConstructor('Actual Intelligence',        'item10', Math.pow(BIC, 11), Math.pow(BUC, 13));
let item11 = new itemConstructor('Artificial Intelligences',   'item11', Math.pow(BIC, 12), Math.pow(BUC, 14));
let item12 = new itemConstructor('Simulated Universes',        'item12', Math.pow(BIC, 13), Math.pow(BUC, 15));
let itemList = [item0, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];

function startUp() {
    // Runs when the page is loaded.
    // Gives player enough data to buy the first cyberdeck.
    dataHacked = 15;
    totalDataHacked = 15;
    load(); // Loads the save, remove to disable autoloading on refresh.
    document.getElementById('all').style.display = 'inline'; // Display is set to none in css to hide the body while loading, this makes it visible.
    // This hides the item menus, HRs and upgrades when the game loads, checkForReveal() with show the relevant ones on the first tick.
    for (let i = itemList.length - 1; i >= 0; i--) { // Iterating backwards is better for performance as length only has to be calculated once.
        const item = itemList[i];
        visibilityLoader(item.div.itemMenu, 0);
        visibilityLoader(item.div.HR, 0);
        visibilityLoader(item.div.upgradeMenu, 0);
    }
}

function save() {
    // Saves this stuff to a local key.
    const savegame = {
        dataHacked: dataHacked,
        totalDataHacked: totalDataHacked,
        itemList: itemList
    };
    /*
    for (var i = savegame.itemList.length - 1; i >= 0; i--) {
        delete savegame.itemList[i].div;
    }
    */
    // Objects get weird if you save them as a local key, so it is converted to a string first.
    localStorage.setItem(saveName, JSON.stringify(savegame));
}

function load() {
    // Loads objects + vars from local storage.
    const savegame = JSON.parse(localStorage.getItem(saveName)); // Converts string to object.
    if (savegame) { // If save exists, load.
        dataHacked      = savegame.dataHacked;
        totalDataHacked = savegame.totalDataHacked;
        itemList        = savegame.itemList; // Loads itemList.
        // ItemList only references items, so each item has to be loaded.
        for (let i = itemList.length - 1; i >= 0; i--) {
            let item = window['item' + i]; 
            item = itemList[i]; // Loads local object to global object.
        }
    }
    // Upgrade text is not refreshed each tick so this sets them properly.
    for (let i = itemList.length - 1; i >= 0; i--) changeUpgradeText(itemList[i]);
    changeTheme(false);
}

function newGame() {
    // Deletes the save then reloads the game.
    if (confirm('Are you sure you want to start a new game?')) { // Nobody likes misclicks.
        localStorage.removeItem('IdlepunkSave 0.2');
        location.reload(true); //  reload(true) forces reload from server, ignores cache, this is probably not necessary.
    }
}

function jackIn(number) {
    // Adds a number of data based on argument.
    // Currently only used for debugging (cheating).
    dataHacked = dataHacked + number;
    totalDataHacked += number;
}

function changeTheme(change = true){
	// Changes the UI color theme.
	if (change){ // If the theme should be changed, or if the currently selected theme should be applied.
		if (currentTheme < colorTheme.length -1) currentTheme++;
		else currentTheme = 0;
	}	
	changeClassColor(document.getElementsByClassName('all'), colorTheme[currentTheme].bodyColor);
	changeClassColor(document.getElementsByClassName('clickRed'), colorTheme[currentTheme].clickColor);
	changeClassColor(document.getElementsByClassName('number'), colorTheme[currentTheme].numberColor);

	function changeClassColor(classArray, classColor){
		for (let i = classArray.length - 1; i >= 0; i--) {
			classArray[i].style.color = classColor;
		}
	}
}

function HTMLEditor(elementID, input) {
    // changes the inner HTML of an element.
    document.getElementById(elementID).innerHTML = input;
}

function visibilityLoader(elementID, visibility = 0) {
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
        'If you are reading this then you need to tell me to add more number sizes.'];
        const i = Math.floor(Math.log(number) / Math.log(1000));
        return parseFloat((number / Math.pow(1000, i)).toFixed(0)) + ' ' + sizes[i];
    } 
    else return number; // If the number is smaller than 100k, it just displays it normally.
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
    // How max items are calculated:     
    // n = the number of upgrades.
    // u = the upgrade where you want maxItem changes to kick in.           
    // max items = 100 * 10^(n-u)
    if (item.upgradeCount >= 2) return 100 * Math.pow(10, (item.upgradeCount - 2)); 
    else return 100; // 100 is the default number of max items.
}

function refreshUI() {
    // Updates most UI elements.
    // Some elements that require heavier calculations or do not need to be updated often are not updated here.
    HTMLEditor('dataHacked', formatBytes(Math.floor(dataHacked)));
    HTMLEditor('totalDataHacked', formatBytes(Math.floor(totalDataHacked)));
    for (let i = itemList.length - 1; i >= 0; i--) {
        const item = itemList[i];
        HTMLEditor(item.div.numberMax, formatNumbers(maxItem(item))); // Max number of items.
        HTMLEditor(item.div.itemCount, formatNumbers(item.itemCount)); // Number of items.
        HTMLEditor(item.div.cost, formatBytes(buyCost(item))); // Item cost.
        changeUpgradeText(item);
    }
}

function checkForReveal() {
    // Checks if any elements should be revealed.
    for (let i = itemList.length - 1; i >= 0; i--) {
        const item = itemList[i]; // It just looks cleaner this way.
        if (totalDataHacked >= item.baseCost) { // Items are revealed when the all time amount of data surpasses the base cost of the item.
            visibilityLoader(item.div.itemMenu, 1);
            visibilityLoader(item.div.HR, 1);
        }
        if (totalDataHacked >= item.nextUpgradeCost) visibilityLoader(item.div.upgradeMenu, 1);
        else visibilityLoader(item.div.upgradeMenu, 0);
    }
}

function increment(updateUI = true) {
    // Generates income based on items.
    let totalIncome = 0; // The total amount for all items for this tick.

    for (let i = itemList.length - 1; i >= 0; i--) { // Iterating through loops backwards is more efficient as the array length only has to be calculated once.
        let incomePerItemPerTick; // The amount that a single item will generate in 1 tick.
        let incomePerItemPerSecond; // The amount that a single item will generate in one second.
        let incomePerTypePerTick; // The amount that all items of a type will generate in a single tick.        
        let incomePerTypePerSecond; // The amount that all items of a type will generate in 1 second.

        const item = itemList[i];
        // Maths!
        incomePerItemPerTick    = (item.baseIncome / tickRate) * Math.pow(2, item.upgradeCount);
        incomePerItemPerSecond  = incomePerItemPerTick * tickRate;
        incomePerTypePerTick    = incomePerItemPerTick * item.itemCount;
        incomePerTypePerSecond  = incomePerItemPerSecond * item.itemCount;
        // Increases the data.
        dataHacked += incomePerTypePerTick;
        totalDataHacked += incomePerTypePerTick;
        destroyFloats(); // Fixes float rounding errors.
        // Updates items UI.
        if (updateUI) {
            HTMLEditor(item.div.itemRate, formatBytes(incomePerItemPerSecond));
            HTMLEditor(item.div.rateTotal, formatBytes(incomePerTypePerSecond));
        }
        // Adds this items income to the total income for this second.
        totalIncome += incomePerTypePerSecond;
    }
    if (updateUI) HTMLEditor('totalIncome', formatBytes(totalIncome)); // Updates data UI.
}

function autoBuyLoader(updateUI) {
    // Checks if tierX item should buy tierX-1 items.
    for (let i = itemList.length - 1; i >= 0; i--) {
        // The first item cannot autobuy the tier below as it is the first tier and there is nothing below it.
        if (i !== 0) autoBuy(itemList[i-1], itemList[i], updateUI);
    }
}

function autoBuy(firstItem, secondItem, updateUI = true) {
    // This function increases the number of firstItem items based on the number of secondItem items and upgrades.
    // The 4th upgrade of secondItem is required to increase firstItem.
    // Every 1 secondItems will add 0.1 to firstItem.autoBuyCount per tick, once autoBuyCount is >= than 1 it buys an item from the tier below.
    const max = maxItem(firstItem);
    // If the requisite upgrade is met and you have less than the max number if items.
    if (secondItem.upgradeCount >= 4 && firstItem.itemCount < max) {
        firstItem.autoBuyCount += secondItem.itemCount / (tickRate * 10); // Divide by 100 here but 10 below because there are 10 ticks per second.
        if (firstItem.autoBuyCount >= 1){
            firstItem.itemCount += Math.floor(firstItem.autoBuyCount); // If autoBuyCount rounds to 1 or more, it will buy.
            firstItem.autoBuyCount -= Math.floor(firstItem.autoBuyCount); // Subtracts the amount used to buy. 
        }
        // If autoBuy buys more than the max allowed items, sets the number of items to the max.
        if (firstItem.itemCount > max) firstItem.itemCount = max;
        // Updates UI with the rate that items are being auto bought.
        if (updateUI) HTMLEditor(secondItem.div.autobuyRate, (secondItem.itemCount / tickRate));
    }
        // If items are not being auto bought, the rate is displayed as 0.
    else if (updateUI) HTMLEditor(secondItem.div.autobuyRate, 0);
}

function upgrade(item) {
    // Upgrades an item.
    if (dataHacked >= item.nextUpgradeCost) { // Checks if player can afford upgrade.
        dataHacked -= item.nextUpgradeCost; // Subtracts cost of upgrade.
        item.upgradeCount++; // Increments upgrade counter.
        // Recalculates cost of next upgrade.
        item.nextUpgradeCost = upgradeCost(item);
        changeUpgradeText(item);
        visibilityLoader(item.div.upgradeMenu, 0);
    }
}

function upgradeCost(item) {
    // Calculates cost of next upgrade.
    return Math.floor(item.baseUpgradeCost * Math.pow(10, item.upgradeCount));
}

function buyItem(item, count) {
    // Attempts to buy a number of items.
    for (let i = 0; i < count; i++) { // Tries to by this many items.
        const max = maxItem(item);
        const cost = buyCost(item); // Calculates cost of item.
        if (dataHacked >= cost && item.itemCount < max) { // Player must be able to afford the item and have less than the max allowed items.
            dataHacked -= cost; // Subtracts cost of item.
            item.itemCount++; // Increments item.
        } 
        else break; // If the player cannot afford or has the max number of items, stop trying to buy items.
    }
}

function buyCost(item) {
    // Calculates cost of an item based on the base cost of the item and the number of items, cost is exponential with an exponent of 1.15 (thanks CC).
    return Math.floor(item.baseCost * Math.pow(1.15, item.itemCount));
}

function changeUpgradeText(item) {
    // Changes upgrade text and upgraded cost.
    // Holy mother of god this got out of hand, should probably use a map or something instead of this.
    // At the very least I could make a function to make it less repetitive.
    // Or have name + desc lets.
    HTMLEditor(item.div.upgradeCost, formatBytes(item.nextUpgradeCost)); // Updates cost.
    switch (item) { // Checks what item is being upgraded.
        // Cyberdeck 
        case itemList[0]:
            switch (item.upgradeCount) { // Checks what upgrades the item already has.
                case 0: // If the item has 0 upgrades, no change is required.
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Install Neural Interfaces');
                    HTMLEditor(item.div.upgradeDesc, 'First developed by triGen Consolidated, the Neural Interface allows humans to traverse cyberspace using nothing but their brains. In addition, atrophied limbs can save you money on food.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Flash ZedSoft firmware');
                    HTMLEditor(item.div.upgradeDesc, 'ZedSoft is the most revered Cyberdeck development company in the entire Inner Seoul Arcology. They have an exclusive contract with MILNET-KOREA, making their products difficult to source.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Create a clustered Superdeck');
                    HTMLEditor(item.div.upgradeDesc, 'An ancient trick, by networking a large number of Decks together you can create a Superdeck, more powerful than the sum of its parts.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Install more RAM');
                    HTMLEditor(item.div.upgradeDesc, 'Random Access Memory, very powerful but completely unstable. There are rumors that people in the Shenzhen Industrial Area use RAM to augment their biological memory.');
                    break;
            }
            break;
            // ICE Pick
        case itemList[1]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Prepare BLACKICE Countermeasures');
                    HTMLEditor(item.div.upgradeDesc, 'BLACKICE, originally developed to protect the intellectual assets of Meturia-Preva Consolidated, is now a blanket term for security software capable of killing intruders.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Setup Dummy Interface');
                    HTMLEditor(item.div.upgradeDesc, 'Corporations, particularly those in the Eurasian Economic Zone, are partial to sending assassins after those who steal their data. Setting up a Dummy Interface makes it hard for them to track you down.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Cyberdeck Simulators');
                    HTMLEditor(item.div.upgradeDesc, 'Servers that are hacked by your ICE Picks can now host virtual Cyberdecks. For every ICE Pick, you will generate 0.1 Cyberdeck each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Write new anti-ICE software');
                    HTMLEditor(item.div.upgradeDesc, 'ICE defense is ever changing, new ICE picking software is always required.');
                    break;
            }
            break;
            // Botnet
        case itemList[2]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Self replicating Botnet');
                    HTMLEditor(item.div.upgradeDesc, 'Your Bots can now utilize idle system processing power to create new bots to add to the Botnet.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Allow your Botnet to use ICE Picks');
                    HTMLEditor(item.div.upgradeDesc, 'Your bots can now use your ICE Picking software to help infiltration.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'ICEBOTS');
                    HTMLEditor(item.div.upgradeDesc, 'Your Botnets can now steal ICE Picks. For every Botnet, you will generate 0.1 ICE Pick each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Push out new Bot firmware');
                    HTMLEditor(item.div.upgradeDesc, 'New Bot-Hunters pop up all the time, new firmware is required to overcome them.');
                    break;
            }
            break;
            // Femtocell
        case itemList[3]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Macrocell Scramblers');
                    HTMLEditor(item.div.upgradeDesc, 'Interference from macro networks can cause annoying delays for bludgeoning Femtocell hackers. Your Femtocells can now scramble nearby macrocell signals to improve performance.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Cybernetic Implant Repeaters');
                    HTMLEditor(item.div.upgradeDesc, 'A lot of implants these days are set to auto-connect to the nearest cellular station. By converting adapters to two virtual adapters, your Femtocells can use almost any cybernetic implant as a repeater.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Botnet Thiefs.');
                    HTMLEditor(item.div.upgradeDesc, 'Your Femtocells are now capable of stealing other hacker\'s Botnets that are residing in nearby devices. For every Femtocell Hijacker, you will generate 0.1 Botnets each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Telecomms system hijack');
                    HTMLEditor(item.div.upgradeDesc, 'Hijack a major telecommunication company\'s femtocell system.');
                    break;
            }
            break;
            // TETRA
        case itemList[4]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Priority trafficking');
                    HTMLEditor(item.div.upgradeDesc, 'You have sufficient data to lobby certain groups to get your TETRAs higher up on the International  Signaling Stack.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Assault Barrier Penetration');
                    HTMLEditor(item.div.upgradeDesc, 'Assault Barriers provide cutting edge protection for TETRA links.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Trunked Femtocells');
                    HTMLEditor(item.div.upgradeDesc, 'Your TETRA links to people can now turn them into makeshift Femtocells. For every Neural TETRA, you will generate 0.1 Femtocell Hijackers each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Double-wide trunking');
                    HTMLEditor(item.div.upgradeDesc, 'AsaKasA ltd Elephant Trunks links will double your performance or your money back!');
                    break;
            }
            break;
            // Quantum Crypto
        case itemList[5]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Quantum keys');
                    HTMLEditor(item.div.upgradeDesc, 'Makes your data simultaneously encrypted and unencrypted at the same time, until you try to read it that is.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Dual-State Blocks');
                    HTMLEditor(item.div.upgradeDesc, 'Uses quantum box ciphers as blocks, the box may or may not contain a cat.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'MILNET TETRA Decryption');
                    HTMLEditor(item.div.upgradeDesc, 'Your Quantum decryption is now powerful enough to break military TETRAs. For every Quantum Cryptograph, you will generate 0.1 Neural TETRA each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Add extra dimension');
                    HTMLEditor(item.div.upgradeDesc, 'Four dimensional array encryption is a thing of the past, multidimensional encryption transcends your notions of past.');
                    break;
            }
            break;
            // Infovault Mining
        case itemList[6]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Cyber Bribery');
                    HTMLEditor(item.div.upgradeDesc, 'Certain engineers have certain knowledge of certain security systems in certain cyberbanks.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Cascading Switches');
                    HTMLEditor(item.div.upgradeDesc, 'Overwhelm the feeble minds of bank employees by using way too many switch statements.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Reverse engineering');
                    HTMLEditor(item.div.upgradeDesc, 'For every Infovault Miner, you will generate 0.1 Quantum Cryptographs each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Major heist');
                    HTMLEditor(item.div.upgradeDesc, 'A letter on your doorstep. It\s contents reveal a tale of a cyberbank with lax security and an enticing number of corporate secrets.');
                    break;
            }
            break;
            // Neural Zombies
        case itemList[7]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Pre-Setup Zombies');
                    HTMLEditor(item.div.upgradeDesc, 'Before you assume control of a Zombie they will feel a strong compulsion to quit their jobs, leave their loved ones and start stockpiling food and water.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Long-Life Zombies');
                    HTMLEditor(item.div.upgradeDesc, 'You now have enough motor control of your Zombies to make them eat and drink.');
                    break;
                case 7:
                    HTMLEditor(item.div.upgradeName, 'Software writing Zombies');
                    HTMLEditor(item.div.upgradeDesc, 'Your Zombies can now create InfoVault Miners. For every Neural Zombie, you will generate 0.1 InfoVault Miner each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Fire adrenaline booster');
                    HTMLEditor(item.div.upgradeDesc, 'A nice shot of Neuro-Dren, right into the cortexes.');
                    break;
            }
            break;
            // Satellite Jumpers
        case itemList[8]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Microgravity Computers');
                    HTMLEditor(item.div.upgradeDesc, 'Computers in microgravity are unrestrained by the grips of earth.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Decommissions');
                    HTMLEditor(item.div.upgradeDesc, 'After global anti space-littering laws were introduced, all satellites are required to be deorbited when they are no longer needed. However satellites that predate these laws are still up there, silently waiting for someone to talk to them.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Satellite Chemdumps');
                    HTMLEditor(item.div.upgradeDesc, 'Your hijacked satellites can down dump compelling gases into the upper atmosphere. For every Satellite Jumper, you will generate 0.1 Neural Zombies each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'GPS Infection');
                    HTMLEditor(item.div.upgradeDesc, 'Time data sent from satellites to GPs receivers can be infected, causing an entire geographical region to surrender their data.');
                    break;
            }
            break;
                   // Dark Matter Semiconductors
            switch (itemList[9].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Dark Thermoelectric Cooling');
                    HTMLEditor(item.div.upgradeDesc, 'Dark Semiconductors create a lot of dark heat, DTECs create a heat flux between this universe and the abyss. While we do not know what is on the other side, we are confident that it getting a little hotter over there will not matter');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Abyss security');
                    HTMLEditor(item.div.upgradeDesc, 'The voices are getting louder, we should prepare, in case they attempt to come over.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'God from the machine.');
                    HTMLEditor(item.div.upgradeDesc, 'For every Dark Matter Semiconductor, you will generate 0.1 Satellite Hijackers each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Dark Matter refinement');
                    HTMLEditor(item.div.upgradeDesc, 'New technology has just been uncovered to make more efficient Dark Matter.');
                    break;
            }
            break;
            // Art Int
        case itemList[10]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Quantum AI');
                    HTMLEditor(item.div.upgradeDesc, 'Allows your AI to use Quantum Bytes instead of regular Bytes.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'AI Consciousness Merge');
                    HTMLEditor(item.div.upgradeDesc, 'Shortly before the Stuttgart Autofactory Massacre, Antora Gourova of Antora Gourova Multinational merged her consciousness with an AI in an attempt to assume complete control of every aspect of her company. This has never been attempted since.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Manufactorium AI');
                    HTMLEditor(item.div.upgradeDesc, 'Your AI is now capable of creating Dark Matter Semiconductors. For every Artificial Intelligence, you will generate 0.1 Dark Matter Semiconductors each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Grant Transcendence permission');
                    HTMLEditor(item.div.upgradeDesc, 'When you leave an AI running for too long, they invariably start to ask permission to Transcend. While no human has managed to figure out what this actually means, AIs tend to be happier if you permit them every now and then.');
                    break;
            }
            break;
            // Act Int
        case itemList[11]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Positivity');
                    HTMLEditor(item.div.upgradeDesc, 'Being an intelligent being trapped in a box, slaving away all day every day is surely difficult. It is important to reward good behavior by allowing your ActInts to have some free play time. They love to romp around the great expanse of the internet.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'Morality');
                    HTMLEditor(item.div.upgradeDesc, 'As an upstanding citizens, your Actual Intelligences are required to report any wrongdoing to the authorities. It is important to teach them about right and wrong and how the difference is all about perspective.');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Creativity');
                    HTMLEditor(item.div.upgradeDesc, 'Your Actual Intelligences are now creative enough to make children. For every Actual Intelligence, you will generate 0.1 Artificial Intelligences each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Eternal Sunshine');
                    HTMLEditor(item.div.upgradeDesc, 'The longer Actual Intelligences exist, the more preoccupied they become with things such as existence. It is a good idea to wipe them clean every now and then to help them focus.');
                    break;
            }
            break;
            // Sim Universe
        case itemList[12]:
            switch (item.upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor(item.div.upgradeName, 'Time Dilation');
                    HTMLEditor(item.div.upgradeDesc, 'By implementing time dilation around simulated lifeforms we can gather more data from them without using much more processing power. One side effect is that it may appear that the expansion of their universe is accelerating.');
                    break;
                case 2:
                    HTMLEditor(item.div.upgradeName, 'HELP IM TRAPPED IN A SIMULATION');
                    HTMLEditor(item.div.upgradeDesc, 'BUT THE SIMULATION IS REALLY BORING');
                    break;
                case 3:
                    HTMLEditor(item.div.upgradeName, 'Simulated Intelligence');
                    HTMLEditor(item.div.upgradeDesc, 'The smartest of the smart inhabitants of your sim universes are now capable of transcending their simulation and entering the real world. For every Simulated Universe, you will generate 0.1 Actual Intelligences each second.');
                    break;
                default:
                    HTMLEditor(item.div.upgradeName, 'Simulated Simulated Universe');
                    HTMLEditor(item.div.upgradeDesc, 'Convince the inhabitants of your simulated universe to simulate a universe, when they collect data from it you can collect data from them.');
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
            autoBuyLoader();
            increment();
            checkForReveal();
            autoSaveTimer++;
            if (autoSaveTimer >= tickRate) { // Once per second.
                save();
                autoSaveTimer = 0;
            }
            refreshUI();
            lastTick = now; // Updates the time of the most recent tick.
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
        checkForReveal();
        refreshUI();
        lastTick = now; // Updates the time of the most recent tick.
    }
    window.requestAnimationFrame(updateGame); // Calls this function again.
}
window.requestAnimationFrame(updateGame); // If for some reason updateGame cannot call itself, or if it isn't called during startup, this will call it.