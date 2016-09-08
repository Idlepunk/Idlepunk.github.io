var tickRate = 10; //Ticks per second, this does not actually change the tick rate, it's just used as a reference. Calculated by 1000 / Acutal refresh rate.
var lastTick = (new Date).getTime(); //The time that the last tick occurred
var autoSaveCount = 0; //Increases every tick so that the game doesn't auto save 10 times per second.
var autoBuyCount = 0; //Increases every tick so that the game doesn't auto buy 10 times per second.
var dataHacked = 0; //The current amount of data.
var totalDataHacked = 0; //The all time total amount of data.
//Cyberdecks
var cyberdeckNumber = 0; //The number of cyberdecks the user has.
var cyberdeckPurchased = 0; //The number of cyberdecks the user has purchased (autobought ones are not counted.)
var cyberdeckUpgradeCount = 0; //The number of upgrades cyberdecks have.
//ICEPicks
var ICEPickNumber = 0;
var ICEPickPurchased = 0;
var ICEPickUpgradeCount = 0;
//Botnets
var botnetNumber = 0;
var botnetPurchased = 0;
var botnetUpgradeCount = 0;
//Zombies
var neuralZombieNumber = 0;
var neuralZombiePurchased = 0;
var neuralZombieUpgradeCount = 0;
//AIs
var AINumber = 0;
var AIPurchased = 0;
var AIUpgradeCount = 0;

function startUp() {
    //Runs when the page is loaded.
    document.getElementById('all').style.display = 'inline'; //Display is set to none in css to hide the body while loading, this makes it visible.
    dataHacked = 10;
    totalDataHacked = 0;
    load(); //Loads the save, remove to disable autoloading on refresh.
    //These items are hidden when the game loads.
    var startUpElements = [
     'cyberdeckMenu',
     'cyberdeckHR',
     'cyberdeckUpgradeMenu',
     'ICEDiv',
     'ICEPickHR',
     'ICEPickUpgradeMenu',
     'botnetDiv',
     'botnetHR',
     'botnetUpgradeMenu',
     'neuralZombieDiv',
     'neuralZombieHR',
     'neuralZombieUpgradeMenu',
     'AIDiv',
     'AIHR',
     'AIUpgradeMenu'
     ];
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
        cyberdeckPurchased: cyberdeckPurchased,
        cyberdeckUpgradeCount: cyberdeckUpgradeCount,
        //ICEPicks
        ICEPickNumber: ICEPickNumber,
        ICEPickPurchased: ICEPickPurchased,
        ICEPickUpgradeCount: ICEPickUpgradeCount,
        //Bots
        botnetNumber: botnetNumber,
        botnetPurchased: botnetPurchased,
        botnetUpgradeCount: botnetUpgradeCount,
        //Zomies
        neuralZombieNumber: neuralZombieNumber,
        neuralZombiePurchased: neuralZombiePurchased,
        neuralZombieUpgradeCount: neuralZombieUpgradeCount,
        //AIs
        AINumber: AINumber,
        AIPurchased: AIPurchased,
        AIUpgradeCount: AIUpgradeCount
    }
    localStorage.setItem('save', JSON.stringify(savegame));
}

function load() {
    //Loads these variables from local storage.
    var savegame = JSON.parse(localStorage.getItem('save'));
    if (savegame !== null) { //Will not attempt to load if the save does not exist.
        //dataHacked
        if (typeof savegame.dataHacked !== 'undefined') dataHacked = savegame.dataHacked; //If its an old save it may be undefined.
        //totalDataHacked
        if (typeof savegame.totalDataHacked !== 'undefined') totalDataHacked = savegame.totalDataHacked;
        
        //cyberdeckNumber
        if (typeof savegame.cyberdeckNumber !== 'undefined') cyberdeckNumber = savegame.cyberdeckNumber; //This must be done for every element.
        document.getElementById('cyberdeckNumber').innerHTML = cyberdeckNumber;
        var nextCost = Math.floor(10 * Math.pow(1.15, cyberdeckNumber));
        document.getElementById('cyberdeckCost').innerHTML = formatBytes(nextCost);
        //cyberdeckPurchased
        if (typeof savegame.cyberdeckPurchased !== 'undefined') cyberdeckPurchased = savegame.cyberdeckPurchased;
        //cyberdeckUpgradeCount
        if (typeof savegame.cyberdeckUpgradeCount !== 'undefined') cyberdeckUpgradeCount = savegame.cyberdeckUpgradeCount;
        //cyberdecksUpgrades
        if (cyberdeckUpgradeCount !== 0) changeUpgradeText('cyberdeck', -1);

        //ICEPickNumber
        if (typeof savegame.ICEPickNumber !== 'undefined') ICEPickNumber = savegame.ICEPickNumber;
        document.getElementById('ICEPickNumber').innerHTML = ICEPickNumber;
        nextCost = Math.floor(110 * Math.pow(1.15, ICEPickNumber));
        document.getElementById('ICEPickCost').innerHTML = formatBytes(nextCost);
        //ICEPickPurchased
        if (typeof savegame.ICEPickPurchased !== 'undefined') ICEPickPurchased = savegame.ICEPickPurchased;
        //ICEPickUpgradeCount
        if (typeof savegame.ICEPickUpgradeCount !== 'undefined') ICEPickUpgradeCount = savegame.ICEPickUpgradeCount;
        //ICEPicksUpgrades
        if (ICEPickUpgradeCount !== 0) changeUpgradeText('ICEPick', -1);

        //botnetNumber 
        if (typeof savegame.botnetNumber !== 'undefined') botnetNumber = savegame.botnetNumber;
        document.getElementById('botnetNumber').innerHTML = botnetNumber;
        nextCost = Math.floor(1200 * Math.pow(1.15, botnetNumber));
        document.getElementById('botnetCost').innerHTML = formatBytes(nextCost);
        //botnetPurchased
        if (typeof savegame.botnetPurchased !== 'undefined') botnetPurchased = savegame.botnetPurchased;
        //BotnetMultipler
        if (typeof savegame.botnetUpgradeCount !== 'undefined') botnetUpgradeCount = savegame.botnetUpgradeCount;
        //Botnet Upgrades
        if (botnetUpgradeCount !== 0) changeUpgradeText('botnet', -1);

        //neuralZombieNumber
        if (typeof savegame.neuralZombieNumber !== 'undefined') neuralZombieNumber = savegame.neuralZombieNumber;
        document.getElementById('neuralZombieNumber').innerHTML = neuralZombieNumber;
        nextCost = Math.floor(13000 * Math.pow(1.15, neuralZombieNumber));
        document.getElementById('neuralZombieCost').innerHTML = formatBytes(nextCost);
        //neuralZombiePurchased
        if (typeof savegame.neuralZombiePurchased !== 'undefined') neuralZombiePurchased = savegame.neuralZombiePurchased;
        //neuralZombieUpgradeCount
        if (typeof savegame.neuralZombieUpgradeCount !== 'undefined') neuralZombieUpgradeCount = savegame.neuralZombieUpgradeCount;
        //neuralZombiesUpgrades
        if (neuralZombieUpgradeCount !== 0) changeUpgradeText('neuralZombie', -1);

        //AINumber
        if (typeof savegame.AINumber !== 'undefined') AINumber = savegame.AINumber;
        document.getElementById('AINumber').innerHTML = AINumber;
        nextCost = Math.floor(140000 * Math.pow(1.15, AINumber));
        document.getElementById('AICost').innerHTML = formatBytes(nextCost);
        //AIPurchased
        if (typeof savegame.AIPurchased !== 'undefined') AIPurchased = savegame.AIPurchased;
        //AIUpgradeCount
        if (typeof savegame.AIUpgradeCount !== 'undefined') AIUpgradeCount = savegame.AIUpgradeCount;
        //AIsUpgrades
        if (AIUpgradeCount !== 0) changeUpgradeText('AI', -1);
    }
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

function showText(input) {
    //Shows different text in element depending on what the mouse is hovering over.
    //Currently not in use.
    var text;
    var quote = '<br><i>- William Gibson, Neuromancer.</i>';
    switch (input) {
        case 'dataJackMouseOver':
            text = 'The sky above the port was the color of television, tuned to a dead channel.' + quote;
            break;
        case 'cyberdeckMouseOver':
            text = "This was it. This was what he was, who he was, his being. He forgot to eat. Molly left cartons of rice and foam trays of sushi on the corner of the long table. Sometimes he resented having to leave the deck to use the chemical toilet they'd set up in a corner of the loft." + quote;
            break;
        case 'ICEPickMouseOver':
            text = '"We were running a virus called Mole. The Mole series was the first generation of real intrusion programs." "Icebreakers," Case said, over the rim of the red mug. "Ice from ICE, intrusion countermeasures electronics."' + quote;
            break;
        case 'botnetMouseOver':
            text = 'Cyberspace. A consensual hallucination experienced daily by billions of legitimate operators, in every nation, by children being taught mathematical concepts... A graphic representation of data abstracted from banks of every computer in the human system. Unthinkable complexity. Lines of light ranged in the nonspace of the mind, clusters and constellations of data. Like city lights, receding...' + quote;
            break;
        case 'neuralZombieMouseOver':
            text = "They damaged his nervous system with a wartime Russian mycotoxin. Strapped to a bed in a Memphis hotel, his talent burning out micron by micron, he hallucinated for thirty hours. The damage was minute, subtle, and utterly effective. For Case, who'd lived for the bodiless exultation of cyberspace, it was the Fall." + quote;
            break;
        case 'AIMouseOver':
            text = '"Wintermute is the recognition code for an AI. Ive got the Turing Registry numbers. Artificial intelligence."' + quote;
            break;
    }
    document.getElementById('output').innerHTML = text;
}

function stopText() {
    //Changes the text to ... when the mouse is not hovering over anything.
    //Can probably be the default case in showText.
    document.getElementById('output').innerHTML = '...';
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
            var sizes = [
            'Bytes',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB',
            'EB',
            'ZB',
            'YB'
            ];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        else {
            //bytes = parseFloat(parseFloat(bytes).toFixed(1));
            bytes = bytes.toExponential(2);
            //bytes = parseFloat(parseFloat(bytes).toFixed(1));
            bytes += ' Bytes';
            return bytes;

        }
    }
    //Main Loop

function jackIn(number) {
    //Adds a number of data based on argument.
    //Currently only used for debugging.
    dataHacked = dataHacked + number;
    HTMLEditor('dataHacked', formatBytes(dataHacked));
    totalDataHacked += number;
}

function updateGame(){
    //The main loop, it calls itself at the end.
    var now = (new Date).getTime(); //The current time.
    var deltaTime = now - lastTick; //The amount of time since the last time occurred.
    deltaTime = Math.floor(deltaTime / 100); //(deltaTime / 100) determines the game's tick rate.
    for (var i=0; i<deltaTime; i++) {
        lastTick = now; //Updates the time of the most recent tick.
        //Auto buy happens once per second, not once per tick.
        autoBuyCount++;
        if (autoBuyCount >= tickRate) {
            autoBuy();
            autoBuyCount = 0;
        }
        increment();
        checkForReveal(); 
    }
    autoSaveCount++;
    if (autoSaveCount >= 10){ //Once every X ticks.
        save();
        autoSaveCount = 0;
    }   

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
    //Increments all items.
    var incomePerSecondTotal = 0;
    incomePerSecondTotal += incrementItem(1, cyberdeckNumber, cyberdeckUpgradeCount, 'cyberdeckRate', 'cyberdeckRateTotal');
    incomePerSecondTotal += incrementItem(8, ICEPickNumber, ICEPickUpgradeCount, 'ICEPickRate', 'ICEPickRateTotal');
    incomePerSecondTotal += incrementItem(47, botnetNumber, botnetUpgradeCount, 'botnetRate', 'botnetRateTotal');
    incomePerSecondTotal += incrementItem(260, neuralZombieNumber, neuralZombieUpgradeCount, 'neuralZombieRate', 'neuralZombieRateTotal');
    incomePerSecondTotal += incrementItem(1400, AINumber, AIUpgradeCount, 'AIRate', 'AIRateTotal');
    //Updates UI.
    HTMLEditor('dataHacked', formatBytes(Math.floor(dataHacked)));
    HTMLEditor('totalDataHacked', formatBytes(Math.floor(totalDataHacked)));
    HTMLEditor('totalIncome', formatBytes(incomePerSecondTotal));
}

function incrementItem(baseRate, numberOfItems, itemUpgradeCount, itemRateDiv, itemRateTotalDiv) {
    //Generates income for specific item.
    var incomePerItem;
    var incomePerTick;
    var incomePerSecond;
    var incomePerSecondTotal;

    incomePerItem = calculateIncome(itemUpgradeCount, baseRate);
    incomePerSecond = incomePerItem * tickRate;
    incomePerSecondTotal = incomePerSecond * numberOfItems;
    incomePerTick = incomePerItem * numberOfItems;
    HTMLEditor(itemRateDiv, formatBytes(incomePerSecond));
    HTMLEditor(itemRateTotalDiv, formatBytes(incomePerSecondTotal));
    dataHacked += incomePerTick;
    totalDataHacked += incomePerTick;
    destroyFloats();
    return incomePerSecondTotal;
}

function calculateIncome(upgradeCount, baseRate) {
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

function autoBuy() {
    //Every 10 of an item will create 1 item of the tier below it.
    if (ICEPickUpgradeCount >= 4) {
        cyberdeckNumber += Math.floor(ICEPickNumber / 10);
        HTMLEditor('ICEPickCyberdeckCreationRate', Math.floor(ICEPickNumber / 10));
        HTMLEditor('cyberdeckNumber', cyberdeckNumber);
    }
    if (botnetUpgradeCount >= 4) {
        ICEPickNumber += Math.floor(botnetNumber / 10);
        HTMLEditor('botnetICEPickCreationRate', Math.floor(botnetNumber / 10));
        HTMLEditor('ICEPickNumber', ICEPickNumber);
    }
    if (neuralZombieUpgradeCount >= 4) {
        botnetNumber += Math.floor(neuralZombieNumber / 10); //Creates 1 botnet for every 2 zombies, * 10 so its per second.
        HTMLEditor('nerualZombieBotnetCreationRate', Math.floor(neuralZombieNumber / 10));
        HTMLEditor('botnetNumber', botnetNumber);
    }
    if (AIUpgradeCount >= 4) {
        neuralZombieNumber += Math.floor(AINumber / 10);
        HTMLEditor('AINeuralZombieCreationRate', Math.floor(AINumber / 10));
        HTMLEditor('neuralZombieNumber', neuralZombieNumber);
    }
}

function changeUpgradeText(input, offset) {
    //Changes the upgrade text when an upgrade or a load occurs.
    //Offset is used for loading so that it loads the current upgrade text, not the next upgrade text.
    var type;
    var cost = getUpgradeCost(input, 1);
    if (typeof offset === 'undefined'){
    	offset = 0
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
                    HTMLEditor('botnetUpgradeDesc', 'New Bot-Hunters pop up all the time, new firmware is required to overcome them.')
                    break;
            }
            break;
        case 'neuralZombie':
            switch (neuralZombieUpgradeCount + offset) {
                case 0:
                    HTMLEditor('neuralZombieUpgradeName', 'Pre-Setup Zombies');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'Before you assume control of a Zombie they will feel a strong compulsion to quit their jobs and leave their loved ones.')
                    break;
                case 1:
                    HTMLEditor('neuralZombieUpgradeName', 'Long-Life Zombies');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'You now have enough motor control of your Zombies to make them eat and drink.')
                    break;
                case 2:
                    HTMLEditor('neuralZombieUpgradeName', 'Software writing Zombies');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'Your Zombies can now create Botnets. For every 10 Neural Zombies, you will generate 1 Botnet each second.')
                    break;
                default:
                    HTMLEditor('neuralZombieUpgradeName', 'Fire adrenaline booster');
                    HTMLEditor('neuralZombieUpgradeCost', formatBytes(cost));
                    HTMLEditor('neuralZombieUpgradeDesc', 'Zombies LOVE going fast')
                    break;
            }
            break;
        case 'AI':
            switch (AIUpgradeCount + offset) {
                case 0:
                    HTMLEditor('AIUpgradeName', 'PLACEHOLDER0');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'PLACEHOLDER0')
                    break;
                case 1:
                    HTMLEditor('AIUpgradeName', 'PLACEHOLDER1');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'PLACEHOLDER1')
                    break;
                case 2:
                    HTMLEditor('AIUpgradeName', 'PLACEHOLDER2');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'PLACEHOLDER2')
                    break;
                default:
                    HTMLEditor('AIUpgradeName', 'PLACEHOLDERDEF');
                    HTMLEditor('AIUpgradeCost', formatBytes(cost));
                    HTMLEditor('AIUpgradeDesc', 'PLACEHOLDERDEF')
                    break;
            }
            break;
    }
}

function upgrade(input) {
    switch (input) {
        case 1:
            doUpgrade('cyberdeck');
            break;
        case 2:
            doUpgrade('ICEPick');
            break;
        case 3:
            doUpgrade('botnet');
            break;
        case 4:
            doUpgrade('neuralZombie');
            break;
        case 5:
            doUpgrade('AI');
            break;
    }
}

function doUpgrade(input) {
    //Upgrades an item.
    var costElement;
    var cost;
    var nextCost;
    //var upgradeCostArray;
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

function getUpgradeCost(input, indexModifier) {
    //Calculates how much an upgrade should cost.
    if (indexModifier === undefined) {
        indexModifier = 0;
    }
    var array;
    var index;
    var baseUpgrade;
    switch (input) {
        case 'cyberdeck':
            baseUpgrade = 1000;
            index = cyberdeckUpgradeCount;
            break;
        case 'ICEPick':
            baseUpgrade = 6000;
            index = ICEPickUpgradeCount;
            break;
        case 'botnet':
            baseUpgrade = 10000;
            index = botnetUpgradeCount;
            break;
        case 'neuralZombie':
            baseUpgrade = 60000;
            index = neuralZombieUpgradeCount;
            break;
        case 'AI':
            baseUpgrade = 100000;
            index = AIUpgradeCount;
            break;
    }
    //This array is inefficient, a better way is:
    //Upgrade cost = (numberOfUpgrades + indexMod) * (baseCost * 10).
    var costArray = [baseUpgrade];
    for (var i = 1; i < 30; i++) {
        var c = costArray[i - 1];
        c *= 10;
        costArray.push(c);
    }
    return costArray[index + indexModifier];
}

function buyItem(item, baseCost) {
    var itemNumberName = item + 'Number';
    var itemPurchasedName = item + 'Purchased';
    //Gets global vars.
    var itemNumberInt = window[itemNumberName];
    var itemPurchasedInt = window[itemPurchasedName];
    //Calculates cost of item.
    var cost = Math.floor(baseCost * Math.pow(1.15, itemPurchasedInt));
    if (dataHacked >= cost) { //Checks if user can afford item.
        dataHacked -= cost; //Subtracts cost of item.
        itemNumberInt += 1; //Adds an item.
        itemPurchasedInt += 1;
        //Updates UI.
        HTMLEditor(itemNumberName, itemNumberInt);
        HTMLEditor('dataHacked', formatBytes(dataHacked));
        var nextCost = Math.floor(baseCost * Math.pow(1.15, itemPurchasedInt));
        var itemCost = item + 'Cost';
        HTMLEditor(itemCost, formatBytes(nextCost));
        //Updates global vars.
        window[itemNumberName] = itemNumberInt;
        window[itemPurchasedName] = itemPurchasedInt;
    }
    else {
        //If the user cannot afford the upgrade, returns break.
        return 'break';
    }
}

function buyCyberdeck(input) {
    //Loops through buying the item until the input number is reached or the user cannot afford to buy any more.
    for (var i = 0; i < input; i++) {
        if (buyItem('cyberdeck', 10) == 'break'){
            break;
        }
    }
}

function buyICEPick(input) {
    for (var i = 0; i < input; i++) {
        if (buyItem('ICEPick', 110) == 'break'){
            break;
        }
    }
}

function buyBotnet(input) {
    for (var i = 0; i < input; i++) {
        if (buyItem('botnet', 1200) == 'break'){
            break;
        }
    }
}

function buyNeuralZombie(input) {
    for (var i = 0; i < input; i++) {
        if (buyItem('neuralZombie', 13000) == 'break'){
            break;
        }
    }
}

function buyAI(input) {
    for (var i = 0; i < input; i++) {
        if (buyItem('AI', 130000) == 'break'){
            break;
        }
    }
}