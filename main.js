var tickRate = 10; //Ticks per second, this does not actually change the tick rate, it's just used as a reference. Calculated by 1000 / Acutal refresh rate.
var lastTick = new Date().getTime(); //The time that the last tick occurred
var autoSaveCount = 0; //Increases every tick so that the game doesn't auto save 10 times per second.
var autoBuyCount = 0; //Increases every tick so that the game doesn't auto buy 10 times per second.
var dataHacked = 0; //The current amount of data.
var totalDataHacked = 0; //The all time total amount of data.
//Cyberdecks
var cyberdeckNumber = 0; //The number of cyberdecks the user has.
var cyberdeckUpgradeCount = 0; //The number of upgrades cyberdecks have.
//ICEPicks
var ICEPickNumber = 0;
var ICEPickUpgradeCount = 0;
//Botnets
var botnetNumber = 0;
var botnetUpgradeCount = 0;
//Zombies
var neuralZombieNumber = 0;
var neuralZombieUpgradeCount = 0;
//AIs
var AINumber = 0;
var AIUpgradeCount = 0;

function startUp() {
    //Runs when the page is loaded.
    document.getElementById('all').style.display = 'inline'; //Display is set to none in css to hide the body while loading, this makes it visible.
    dataHacked = 10;
    totalDataHacked = 0;
    load(); //Loads the save, remove to disable autoloading on refresh.
    //These items are hidden when the game loads.
    var startUpElements = ['cyberdeckMenu', 'cyberdeckHR', 'cyberdeckUpgradeMenu', 'ICEDiv', 'ICEPickHR', 'ICEPickUpgradeMenu',
    'botnetDiv', 'botnetHR', 'botnetUpgradeMenu', 'neuralZombieDiv', 'neuralZombieHR', 'neuralZombieUpgradeMenu', 'AIDiv', 'AIHR', 'AIUpgradeMenu'];
    for (var i in startUpElements) {
        visibilityLoader(startUpElements[i], 0);
    }
    //Calls the first tick of the game.
    window.requestAnimationFrame(updateGame);
}

function save() {
    //Saves these variables to local storage.
    var savegame = {
        dataHacked: dataHacked,
        totalDataHacked: totalDataHacked,
        //Cyberdecks
        cyberdeckNumber: cyberdeckNumber,
        cyberdeckUpgradeCount: cyberdeckUpgradeCount,
        //ICEPicks
        ICEPickNumber: ICEPickNumber,
        ICEPickUpgradeCount: ICEPickUpgradeCount,
        //Bots
        botnetNumber: botnetNumber,
        botnetUpgradeCount: botnetUpgradeCount,
        //Zomies
        neuralZombieNumber: neuralZombieNumber,
        neuralZombieUpgradeCount: neuralZombieUpgradeCount,
        //AIs
        AINumber: AINumber,
        AIUpgradeCount: AIUpgradeCount
    };
    localStorage.setItem('save', JSON.stringify(savegame));
}

function load() {
    var savegame = JSON.parse(localStorage.getItem('save'));
    if (savegame !== null) { //If savegame exists.
        Object.keys(savegame).forEach(function(key, index) {
            window[key] = savegame[key]; //Load each value of each property of object into global vars.
        });
    }
    refreshUI();
}

function exportSave() {
    //Converts the local save to a string.
    save();
    var savegame = JSON.parse(localStorage.getItem('save'));
    savegame = JSON.stringify(savegame);
    var obfuscatedSave = window.btoa(savegame);
    window.prompt('Your save: ', obfuscatedSave);
}

function importSave() {
    //Converts a string to a local save.
    var obfuscatedSave = prompt('Paste save here');
    var save = atob(obfuscatedSave);
    localStorage.setItem('save', save);
    load();
}

function deleteSave() {
    //Deletes the save then reloads the game.
    localStorage.removeItem('save');
    location.reload();
}

function HTMLEditor(elementID, input) {
    //changes the inner HTML of an element.
    document.getElementById(elementID).innerHTML = input;
}

function visibilityLoader(elementID, visibility) {
    //Either hides or shows an element depending on arguments.
    if (visibility === 1) {
        visibility = 'visible';
    } else if (visibility === 0) {
        visibility = 'hidden';
    }
    document.getElementById(elementID).style.visibility = visibility;
}

function destroyFloats(input) {
    //Sets dataHacked to 1 decimal place.
    //Used to avoid float rounding errors.
    dataHacked = parseFloat(parseFloat(dataHacked).toFixed(1));
    totalDataHacked = parseFloat(parseFloat(totalDataHacked).toFixed(1));
}

function formatBytes(bytes, decimals) {
    //Converts a number of Bytes into a data format.
    //If it is larger than the largest data format (9999 Yottabytes), shows scientific notation of Bytes instead.
    bytes = Math.round(bytes);
    if (bytes < 999099999999999999999999999) {
        if (bytes === 0) return '0 Bytes';
        if (bytes == 1) return '1 Byte';
        var k = 1000;
        var dm = 2 + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    } else {
        //bytes = parseFloat(parseFloat(bytes).toFixed(1));
        bytes = bytes.toExponential(2);
        //bytes = parseFloat(parseFloat(bytes).toFixed(1));
        bytes += ' Bytes';
        return bytes;
    }
}

function formatNumbers(number, decimals) {
    //Converts a number of number into a data format.
    //if it is less than 1 million it shows the normal number.
    //if it is greater than 1 million it shows the number name, e.g. 1.34 million.
    number = Math.round(number);
    if (number > 999999) {
        var k = 1000;
        var dm = 1;
        var sizes = [
        'If you are reading this then you have found a bug! Please contact an exterminator.',
        'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion'];
        var i = Math.floor(Math.log(number) / Math.log(k));
        number = parseFloat((number / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        return number;
    } else {
        return number;
    }
}

function jackIn(number) {
    //Adds a number of data based on argument.
    //Currently only used for debugging.
    dataHacked = dataHacked + number;
    HTMLEditor('dataHacked', formatBytes(dataHacked));
    totalDataHacked += number;
}

function refreshUI() {
    //Updates most UI elements.
    //Some elements that require heavy calculations are not updated here.
    //DataHacked
    HTMLEditor('dataHacked', formatBytes(Math.floor(dataHacked)));
    HTMLEditor('totalDataHacked', formatBytes(Math.floor(totalDataHacked)));
    //Maximum items
    var max;
    //Cyberdecks
    HTMLEditor('cyberdeckNumberMax', formatNumbers(maxItem('cyberdeck')));
    //ICEPicks
    HTMLEditor('ICEPickNumberMax', formatNumbers(maxItem('ICEPick')));
    //Botnets
    HTMLEditor('botnetNumberMax', formatNumbers(maxItem('botnet')));
    //Zombies
    HTMLEditor('neuralZombieNumberMax', formatNumbers(maxItem('neuralZombie')));
    //AI
    HTMLEditor('AINumberMax', formatNumbers(maxItem('AI')));
    var nextCost;
    //Cyberdecks
    HTMLEditor('cyberdeckNumber', formatNumbers(cyberdeckNumber));
    nextCost = Math.floor(10 * Math.pow(1.15, cyberdeckNumber));
    HTMLEditor('cyberdeckCost', formatBytes(nextCost));
    //ICEPicks
    HTMLEditor('ICEPickNumber', formatNumbers(ICEPickNumber));
    nextCost = Math.floor(110 * Math.pow(1.15, ICEPickNumber));
    HTMLEditor('ICEPickCost', formatBytes(nextCost));
    //Botnets
    HTMLEditor('botnetNumber', formatNumbers(botnetNumber));
    nextCost = Math.floor(1200 * Math.pow(1.15, botnetNumber));
    HTMLEditor('botnetCost', formatBytes(nextCost));
    //Zombies
    HTMLEditor('neuralZombieNumber', formatNumbers(neuralZombieNumber));
    nextCost = Math.floor(13000 * Math.pow(1.15, neuralZombieNumber));
    HTMLEditor('neuralZombieCost', formatBytes(nextCost));
    //AI
    HTMLEditor('AINumber', formatNumbers(AINumber));
    nextCost = Math.floor(140000 * Math.pow(1.15, AINumber));
    HTMLEditor('AICost', formatBytes(nextCost));
    if (cyberdeckUpgradeCount !== 0) {
        changeUpgradeText('cyberdeck', -1);
    }
    if (ICEPickUpgradeCount !== 0) {
        changeUpgradeText('ICEPick', -1);
    }
    if (botnetUpgradeCount !== 0) {
        changeUpgradeText('botnet', -1);
    }
    if (neuralZombieUpgradeCount !== 0) {
        changeUpgradeText('neuralZombie', -1);
    }
    if (AIUpgradeCount !== 0) {
        changeUpgradeText('AI', -1);
    }
}

function updateGame() {
    //The main loop, it calls itself at the end.
    var now = new Date().getTime(); //The current time.
    var deltaTime = now - lastTick; //The amount of time since the last tick occurred.
    deltaTime = Math.floor(deltaTime / 100); //(deltaTime / 100) determines the game's tick rate.
    for (var i = 0; i < deltaTime; i++) {
        lastTick = now; //Updates the time of the most recent tick.
        //Auto buy happens once per second, not once per tick.
        autoBuyCount++;
        if (autoBuyCount >= tickRate) { //once per second.
            autoBuy();
            autoBuyCount = 0;
        }
        increment();
        checkForReveal();
        autoSaveCount++;
        if (autoSaveCount >= tickRate) { //Once per second.
            save();
            autoSaveCount = 0;
        }
    }
    refreshUI();
    window.requestAnimationFrame(updateGame); //Calls this function again.
}
window.requestAnimationFrame(updateGame); //If for some reason the function cannot call itself, this calls it again.
function checkForReveal() {
    //Checks if elements should be revealed.
    //Decks Base
    if (totalDataHacked >= 0) {
        visibilityLoader('cyberdeckMenu', 1);
        visibilityLoader('cyberdeckHR', 1);
    }
    //Decks Upgrades
    if (totalDataHacked >= 1000) {
        visibilityLoader('cyberdeckUpgradeMenu', 1);
    }
    //ICEPickNumber
    if (totalDataHacked >= 110) {
        visibilityLoader('ICEDiv', 1);
        visibilityLoader('ICEPickHR', 1);
    }
    //ICE Upgrades
    if (totalDataHacked >= 6000) {
        visibilityLoader('ICEPickUpgradeMenu', 1);
    }
    //botnetNumber
    if (totalDataHacked >= 1200) {
        visibilityLoader('botnetDiv', 1);
        visibilityLoader('botnetHR', 1);
    }
    //Botnet Upgrades
    if (totalDataHacked >= 15000) {
        visibilityLoader('botnetUpgradeMenu', 1);
    }
    //neuralZombieNumber
    if (totalDataHacked >= 13000) {
        visibilityLoader('neuralZombieDiv', 1);
        visibilityLoader('neuralZombieHR', 1);
    }
    //NeuralZombie Upgrades
    if (totalDataHacked >= 65000) {
        visibilityLoader('neuralZombieUpgradeMenu', 1);
    }
    //AI
    if (totalDataHacked >= 130000) {
        visibilityLoader('AIDiv', 1);
        visibilityLoader('AIHR', 1);
    }
    //AI Upgrades
    if (totalDataHacked >= 10000000) {
        visibilityLoader('AIUpgradeMenu', 1);
    }
}

function increment() {
    //Increments income for items.
    var incomePerSecondTotal = 0;
    incomePerSecondTotal += incrementItem(1, cyberdeckNumber, cyberdeckUpgradeCount, 'cyberdeckRate', 'cyberdeckRateTotal');
    incomePerSecondTotal += incrementItem(8, ICEPickNumber, ICEPickUpgradeCount, 'ICEPickRate', 'ICEPickRateTotal');
    incomePerSecondTotal += incrementItem(47, botnetNumber, botnetUpgradeCount, 'botnetRate', 'botnetRateTotal');
    incomePerSecondTotal += incrementItem(260, neuralZombieNumber, neuralZombieUpgradeCount, 'neuralZombieRate', 'neuralZombieRateTotal');
    incomePerSecondTotal += incrementItem(1400, AINumber, AIUpgradeCount, 'AIRate', 'AIRateTotal');
    HTMLEditor('totalIncome', formatBytes(incomePerSecondTotal));
}

function incrementItem(baseRate, numberOfItems, itemUpgradeCount, itemRateDiv, itemRateTotalDiv) {
    //Generates income for specific item.
    var incomePerItem;
    var incomePerTick;
    var incomePerSecond;
    var incomePerSecondTotal;
    incomePerItem = calculateIncome(itemUpgradeCount, baseRate); //1 item generates this much each tick.
    incomePerSecond = incomePerItem * tickRate; //1 item generates this much per second.
    incomePerSecondTotal = incomePerSecond * numberOfItems; //all items of this type generate this much per second.
    incomePerTick = incomePerItem * numberOfItems; //all items of this type generate this much per tick.
    //Updates UI.
    HTMLEditor(itemRateDiv, formatBytes(incomePerSecond));
    HTMLEditor(itemRateTotalDiv, formatBytes(incomePerSecondTotal));
    //Updates global vars.
    dataHacked += incomePerTick;
    totalDataHacked += incomePerTick;
    destroyFloats(); //Fixes rounding.
    return incomePerSecondTotal;
}

function calculateIncome(upgradeCount, baseRate) {
    //Calculates how much an item should generate based on the base rate and the number of upgrades.
    //BR = Base Rate
    //TR = Ticks Per Second
    //UC = Number Of Upgrades
    //amount per tick = (BR/TR)*(2^UC)
    //2^0 = 1
    //2^1 = 2
    //2^3 = 4
    //2^4 = 8 etc
    var incomePerTick = (baseRate / tickRate) * Math.pow(2, upgradeCount);
    return incomePerTick;
}

function maxItem(item) {
    //Calculates the maximum number of items based on upgrades
    //Number of upgrades = maximum items
    //0 = 100
    //1 = 100
    //2 = 100
    //3 = 100
    //4 = 1000
    //5 = 10000
    //6 = 100000
    //etc 
    var itemUpgradeCountName = item + 'UpgradeCount';
    var itemUpgradeCountInt = window[itemUpgradeCountName];
    if (itemUpgradeCountInt > 3) {
        max = 100 * Math.pow(10, (itemUpgradeCountInt - 3));
        return max;
    } else {
        return 100;
    }
}

function autoBuy() {
    var max;
    //Every 10 of an item will create 1 item of the tier below it.
    //Cyberdecks
    //Calculates maximum possible items
    max = maxItem('cyberdeck');
    //Checks that the requirements for autobuying are met.
    if (ICEPickUpgradeCount >= 4 && cyberdeckNumber < max) {
        //Every 10 ICEPicks increases cyberdecks by 1
        cyberdeckNumber += Math.floor(ICEPickNumber / 10);
        //If the above buys more than the max this sets it to the max.
        if (cyberdeckNumber > max) cyberdeckNumber = max;
        //Updates UI
        HTMLEditor('ICEPickCyberdeckCreationRate', Math.floor(ICEPickNumber / 10));
    }
    //ICEPicks
    max = maxItem('ICEPick');
    if (botnetUpgradeCount >= 4 && ICEPickNumber < max) {
        ICEPickNumber += Math.floor(botnetNumber / 10);
        if (ICEPickNumber > max) ICEPickNumber = max;
        HTMLEditor('botnetICEPickCreationRate', Math.floor(botnetNumber / 10));
    }
    //Botnets
    max = maxItem('botnet');
    if (neuralZombieUpgradeCount >= 4 && botnetNumber < max) {
        botnetNumber += Math.floor(neuralZombieNumber / 10); //Creates 1 botnet for every 2 zombies, * 10 so its per second.
        if (botnetNumber > max) botnetNumber = max;
        HTMLEditor('neuralZombieBotnetCreationRate', Math.floor(neuralZombieNumber / 10));
    }
    //Neural Zombies
    max = maxItem('neuralZombie');
    if (AIUpgradeCount >= 4 && neuralZombieNumber < max) {
        neuralZombieNumber += Math.floor(AINumber / 10);
        if (neuralZombieNumber > max) neuralZombieNumber = max;
        HTMLEditor('AINeuralZombieCreationRate', Math.floor(AINumber / 10));
    }
}

function changeUpgradeText(input, offset) {
    //Changes the upgrade text when an upgrade or a load occurs.
    //Offset is used for loading so that it loads the current upgrade text, not the next upgrade text.
    var type;
    var cost = getUpgradeCost(input, 1);
    if (typeof offset === 'undefined') {
        offset = 0;
    }
    switch (input) {
        case 'cyberdeck':
            switch (cyberdeckUpgradeCount + offset) {
                case 0:
                    HTMLEditor('cyberdeckUpgradeName', 'Install Neural Interfaces');
                    HTMLEditor('cyberdeckUpgradeCost', formatBytes(cost));
                    HTMLEditor('cyberdeckUpgradeDesc', 'First developed by triGen Consolidated, the Neural Interface allows humans to traverse cyberspace using nothing but their brains. In addition, atrophied limbs can save you money on food.');
                    break;
                case 1:
                    HTMLEditor('cyberdeckUpgradeName', 'Flash ZedSoft firmware');
                    HTMLEditor('cyberdeckUpgradeCost', formatBytes(cost));
                    HTMLEditor('cyberdeckUpgradeDesc', 'ZedSoft is the most revered Cyberdeck development company in the entire Inner Seoul Arcology. They have an exclusive contract with MILNET-KOREA, making their products difficult to source.');
                    break;
                case 2:
                    HTMLEditor('cyberdeckUpgradeName', 'Create a clustered Superdeck');
                    HTMLEditor('cyberdeckUpgradeCost', formatBytes(cost));
                    HTMLEditor('cyberdeckUpgradeDesc', 'An ancient trick, by networking a large number of Decks together you can create a Superdeck, more powerful than the sum of its parts.');
                    break;
                default:
                    HTMLEditor('cyberdeckUpgradeName', 'Install more RAM');
                    HTMLEditor('cyberdeckUpgradeCost', formatBytes(cost));
                    HTMLEditor('cyberdeckUpgradeDesc', 'Random Access Memory, very powerful but completely unstable. There are rumours that people in the Shenzhen Industrial Area use RAM to augment their biological memory.');
                    break;
            }
            break;
        case 'ICEPick':
            switch (ICEPickUpgradeCount + offset) {
                case 0:
                    HTMLEditor('ICEPickUpgradeName', 'Prepare BLACKICE Countermeasures');
                    HTMLEditor('ICEPickUpgradeCost', formatBytes(cost));
                    HTMLEditor('ICEPickUpgradeDesc', 'BLACKICE, originally developed to protect the intellectual assets of Meturia-Preva Consolidated, is now a blanket term for security software capable of killing intruders.');
                    break;
                case 1:
                    HTMLEditor('ICEPickUpgradeName', 'Setup Dummy Interface');
                    HTMLEditor('ICEPickUpgradeCost', formatBytes(cost));
                    HTMLEditor('ICEPickUpgradeDesc', 'Corporations, particularly those in the Eurasian Economic Zone, are partial to sending assassins after those who steal their data. Setting up a Dummy Interface makes it hard for them to track you down.');
                    break;
                case 2:
                    HTMLEditor('ICEPickUpgradeName', 'Cyberdeck Simulators');
                    HTMLEditor('ICEPickUpgradeCost', formatBytes(cost));
                    HTMLEditor('ICEPickUpgradeDesc', 'Servers that are hacked by your ICE Picks can now host virtual Cyberdecks. For every 10 ICE Picks, you will generate 1 Cyberdeck each second.');
                    break;
                default:
                    HTMLEditor('ICEPickUpgradeName', 'Write new anti-ICE software');
                    HTMLEditor('ICEPickUpgradeCost', formatBytes(cost));
                    HTMLEditor('ICEPickUpgradeDesc', 'ICE defense is ever changing, new ICE picking software is always required.');
                    break;
            }
            break;
        case 'botnet':
            switch (botnetUpgradeCount + offset) {
                case 0:
                    HTMLEditor('botnetUpgradeName', 'Self replicating Botnet');
                    HTMLEditor('botnetUpgradeCost', formatBytes(cost));
                    HTMLEditor('botnetUpgradeDesc', 'Your Bots can now utilise idle system processing power to create new bots to add to the Botnet.');
                    break;
                case 1:
                    HTMLEditor('botnetUpgradeName', 'Allow your Botnet to use ICE Picks');
                    HTMLEditor('botnetUpgradeCost', formatBytes(cost));
                    HTMLEditor('botnetUpgradeDesc', 'Your bots can now use your ICE Picking software to help infiltration.');
                    break;
                case 2:
                    HTMLEditor('botnetUpgradeName', 'ICEBOTS');
                    HTMLEditor('botnetUpgradeCost', formatBytes(cost));
                    HTMLEditor('botnetUpgradeDesc', 'Your Botnets can now steal ICE Picks. for every 10 Botnets, you will generate 1 ICE Pick each second.');
                    break;
                default:
                    HTMLEditor('botnetUpgradeName', 'Push out new Bot firmware');
                    HTMLEditor('botnetUpgradeCost', formatBytes(cost));
                    HTMLEditor('botnetUpgradeDesc', 'New Bot-Hunters pop up all the time, new firmware is required to overcome them.');
                    break;
            }
            break;
        case 'neuralZombie':
            switch (neuralZombieUpgradeCount + offset) {
                case 0:
                    HTMLEditor('neuralZombieUpgradeName', 'Pre-Setup Zombies');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'Before you assume control of a Zombie they will feel a strong compulsion to quit their jobs, leave their loved ones and start stockpiling food and water.');
                    break;
                case 1:
                    HTMLEditor('neuralZombieUpgradeName', 'Long-Life Zombies');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'You now have enough motor control of your Zombies to make them eat and drink.');
                    break;
                case 2:
                    HTMLEditor('neuralZombieUpgradeName', 'Software writing Zombies');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'Your Zombies can now create Botnets. For every 10 Neural Zombies, you will generate 1 Botnet each second.');
                    break;
                default:
                    HTMLEditor('neuralZombieUpgradeName', 'Fire adrenaline booster');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'A nice shot of Neuro-Dren, right into the cortexes.');
                    break;
            }
            break;
        case 'AI':
            switch (AIUpgradeCount + offset) {
                case 0:
                    HTMLEditor('AIUpgradeName', 'Quantum AI');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'Allows your AI to use Quantum Bytes instead of regular Bytes.');
                    break;
                case 1:
                    HTMLEditor('AIUpgradeName', 'AI Consciousness Merge');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'Shortly before the Stuttgart Autofactory Massacre, Antora Gourova of Antora Gourova Multinational merged her consciousness with an AI in an attempt to assume complete control of every aspect of her company. This has never been attempted since.');
                    break;
                case 2:
                    HTMLEditor('AIUpgradeName', 'Neural jacking AI');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'AI capable of hijacking humans, what could go wrong?');
                    break;
                default:
                    HTMLEditor('AIUpgradeName', 'Grant Transcendence permission');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'When you leave an AI running for too long, they invariably start to ask permission to Transcend. While no human has managed to figure out what this actually means, AIs tend to be happier if you permit them every now and then.');
                    break;
            }
            break;
    }
}

function doUpgrade(input) {
    //Upgrades an item.
    var costElement;
    var cost;
    var nextCost;
    //Will replace switch with string concats at some point.
    switch (input) {
        case 'cyberdeck':
            upgradeCountInt = cyberdeckUpgradeCount;
            upgradeCountName = 'cyberdeckUpgradeCount';
            break;
        case 'ICEPick':
            upgradeCountInt = ICEPickUpgradeCount;
            upgradeCountName = 'ICEPickUpgradeCount';
            break;
        case 'botnet':
            upgradeCountInt = botnetUpgradeCount;
            upgradeCountName = 'botnetUpgradeCount';
            break;
        case 'neuralZombie':
            upgradeCountInt = neuralZombieUpgradeCount;
            upgradeCountName = 'neuralZombieUpgradeCount';
            break;
        case 'AI':
            upgradeCountInt = AIUpgradeCount;
            upgradeCountName = 'AIUpgradeCount';
            break;
    }
    cost = getUpgradeCost(input);
    if (dataHacked >= cost) { //Checks the user has enough data.
        dataHacked -= cost; //Subtracts the data.
        upgradeCountInt += 1; //Upgrades.
        changeUpgradeText(input);
        window[upgradeCountName] = upgradeCountInt; //Updates the global variable.
    }
}

function getUpgradeCost(input, modifier) {
    //Calculates how much an upgrade should cost.
    if (modifier === undefined) {
        modifier = 0;
    }
    var array;
    var upgradeCount;
    var baseCost;
    var cost;
    switch (input) {
        case 'cyberdeck':
            baseCost = 1000;
            upgradeCount = cyberdeckUpgradeCount;
            break;
        case 'ICEPick':
            baseCost = 6000;
            upgradeCount = ICEPickUpgradeCount;
            break;
        case 'botnet':
            baseCost = 10000;
            upgradeCount = botnetUpgradeCount;
            break;
        case 'neuralZombie':
            baseCost = 60000;
            upgradeCount = neuralZombieUpgradeCount;
            break;
        case 'AI':
            baseCost = 100000;
            upgradeCount = AIUpgradeCount;
            break;
    }
    //cost = baseCost * (10 ^ upgradeCount)
    //cost = 1000 *     (10 ^ 0) = 1000
    //cost = 1000 *     (10 ^ 1) = 10000
    //cost = 1000 *     (10 ^ 2) = 100000
    cost = baseCost * Math.pow(10, upgradeCount + modifier);
    return cost;
}

function buyItem(item, baseCost) {
    var itemNumberName = item + 'Number';
    //Gets global vars.
    var itemNumberInt = window[itemNumberName];
    var max = maxItem(item);
    //Calculates cost of item.
    var cost = Math.floor(baseCost * Math.pow(1.15, itemNumberInt));
    //Checks if user can afford item and has below max number of items.
    if (dataHacked >= cost && itemNumberInt < max) {
        dataHacked -= cost; //Subtracts cost of item.
        itemNumberInt += 1; //Adds an item.
        var nextCost = Math.floor(baseCost * Math.pow(1.15, itemNumberInt));
        var itemCost = item + 'Cost';
        window[itemNumberName] = itemNumberInt;
    } else {
        //If the user cannot afford the item or has the max number of items, returns break.
        return 'break';
    }
}

function buyCyberdeck(itemCount) {
    buyNumberOfItems('cyberdeck', 10, itemCount);
}

function buyICEPick(itemCount) {
    buyNumberOfItems('ICEPick', 110, itemCount);
}

function buyBotnet(itemCount) {
    buyNumberOfItems('botnet', 1200, itemCount);
}

function buyNeuralZombie(itemCount) {
    buyNumberOfItems('neuralZombie', 13000, itemCount);
}

function buyAI(itemCount) {
    buyNumberOfItems('AI', 130000, itemCount);
}

function buyNumberOfItems(itemName, itemBaseCost, itemCount) {
    //Loops through buying the item until the itemCount number is reached or the user cannot afford to buy any more.
    for (var i = 0; i < itemCount; i++) {
        if (buyItem(itemName, itemBaseCost) == 'break') {
            break;
        }
    }
}