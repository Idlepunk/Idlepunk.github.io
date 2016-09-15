var tickRate = 10; //The number of ticks per second.
var lastTick = new Date().getTime(); //The time that the last tick occurred
var autoSaveCount = 0; //Increases every tick so that the game doesn't auto save every tick.
var autoBuyCount = 0; //Increases every tick so that the game doesn't auto buy every tick.

var dataHacked = 0; //The current amount of data.
var totalDataHacked = 0; //The all time total amount of data.

var item = function(name, ID, baseCost, upgradeCost, baseIncome) {
    this.name = name;
    this.ID = ID;
    this.baseCost = baseCost;
    this.upgradeCost = upgradeCost;
    this.baseIncome = baseIncome;
    this.itemCount = 0;
    this.upgradeCount = 0;
    this.itemCostDiv = this.ID + 'Cost';
    this.itemCountDiv = this.ID + 'Number';
    this.itemRateDiv = this.ID + 'Rate';
    this.itemRateTotalDiv = this.ID + 'RateTotal';
    this.itemNumberMaxDiv = this.ID + 'NumberMax';
    this.itemAutobuyRate = this.ID + 'CreationRate';
    this.itemMenuDiv = this.ID + 'Menu';
    this.itemUpgradeMenuDiv = this.ID + 'UpgradeMenu';
    this.itemHRDiv = this.ID + 'HR';
};

var item0 = new item('cyberdeck',       'item0', 10,        1000,       1);
var item1 = new item('ICEPick',         'item1', 160,       8000,       8);
var item2 = new item('botnet',          'item2', 3200,      64000,      64);
var item3 = new item('neuralZombie',    'item3', 25600,     512000,     512);
var item4 = new item('AI',              'item4', 102400,    4096000,    4096);
var itemList = [item0, item1, item2, item3, item4];

function startUp() {
    //Runs when the page is loaded.
    document.getElementById('all').style.display = 'inline'; //Display is set to none in css to hide the body while loading, this makes it visible.
    dataHacked = 10;
    totalDataHacked = 10;
    load(); //Loads the save, remove to disable autoloading on refresh.
    //These items are hidden when the game loads.
    var startUpElements = [
    'item0Menu',
    'item0HR',
    'item0UpgradeMenu',
    'item1Menu',
    'item1HR',
    'item1UpgradeMenu',
    'item2Menu',
    'item2HR',
    'item2UpgradeMenu',
    'item3Menu',
    'item3HR',
    'item3UpgradeMenu',
    'item4Menu',
    'item4HR',
    'item4UpgradeMenu'];
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
        itemList: itemList
    };
    localStorage.setItem('save', JSON.stringify(savegame));
}

function load() {
    var savegame = JSON.parse(localStorage.getItem('save'));
    if (savegame !== null) { //If savegame exists.
        itemList = savegame.itemList;
        dataHacked = savegame.dataHacked;
        totalDataHacked = savegame.totalDataHacked
        item1 = itemList[0];
        item2 = itemList[1];
        item3 = itemList[2];
        item4 = itemList[3];
        item5 = itemList[4];
    }
    for (var i = 0; i < itemList.length; i++) {
        changeUpgradeText(itemList[i]);
    }
    checkForReveal();
    refreshUI();
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

function formatBytes(bytes) {
    //Converts a number of Bytes into a data format.
    //If it is larger than the largest data format (9999 Yottabytes), shows scientific notation of Bytes instead.
    bytes = Math.round(bytes);
    if (bytes < 999099999999999999999999999) {
        if (bytes === 0) return '0 Bytes';
        if (bytes == 1) return '1 Byte';
        var k = 1000;
        var dm = 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    } else {
        bytes = bytes.toExponential(2);
        bytes += ' Bytes';
        return bytes;
    }
}

function formatNumbers(number) {
    //Converts a number of number into a data format.
    //if it is less than 1 million it shows the normal number.
    //if it is greater than 1 million it shows the number name, e.g. 1.34 million.
    number = Math.round(number);
    if (number > 999999) {
        var k = 1000;
        var dm = 1;
        var sizes = [
        'If you are reading this then you have found a bug! Please contact an exterminator.',
        'Thousand',
        'Million',
        'Billion',
        'Trillion',
        'Quadrillion',
        'Quintillion',
        'Sextillion',
        'Septillion'];
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
    HTMLEditor('dataHacked', formatBytes(Math.floor(dataHacked)));
    HTMLEditor('totalDataHacked', formatBytes(Math.floor(totalDataHacked)));
    for (var i = 0; i < itemList.length; i++) {
        var item = itemList[i];
        HTMLEditor(item.itemNumberMaxDiv, formatNumbers(maxItem(item)));
        HTMLEditor(item.itemCountDiv, item.itemCount);
        HTMLEditor(item.itemCostDiv, formatBytes(buyCost(item)));
    }
}

function updateGame() {
    //The main loop, it calls itself at the end.
    var now = new Date().getTime(); //The current time.
    var deltaTime = now - lastTick; //The amount of time since the last tick occurred.
    deltaTime = Math.floor(deltaTime / (1000 / tickRate)); //tickRate is how many ticks per second in MS, 1000 MS per second.
    for (var i = 0; i < deltaTime; i++) {
        lastTick = now; //Updates the time of the most recent tick.
        //Auto buy happens once per second, not once per tick.
        autoBuyCount++;
        if (autoBuyCount >= tickRate) { //once per second.
            autoBuy();
            autoBuyCount = 0;
        }
        Increment();
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
    for (var i = 0; i < itemList.length; i++) {
        item = itemList[i];
        if (totalDataHacked >= item.baseCost) {
            visibilityLoader(item.itemMenuDiv, 1);
            visibilityLoader(item.itemHRDiv, 1);
        }
        if (totalDataHacked >= item.upgradeCost) {
            visibilityLoader(item.itemUpgradeMenuDiv, 1);
        }
    }
}

function Increment() {
    var totalIncome = 0;
    var incomePerSecondTotal;
    var incomePerItem;
    var incomePerTick;
    var incomePerItemPerSecond;
    var item;
    for (var i = 0; i < itemList.length; i++) {
        item = itemList[i];
        incomePerItem = (item.baseIncome / tickRate) * Math.pow(2, item.upgradeCount);
        incomePerTick = incomePerItem * item.itemCount;
        incomePerItemPerSecond = incomePerItem * tickRate;
        incomePerSecondTotal = incomePerItemPerSecond * item.itemCount;
        dataHacked += incomePerTick;
        totalDataHacked += incomePerTick;
        destroyFloats();
        HTMLEditor(item.itemRateDiv, formatBytes(incomePerItemPerSecond));
        HTMLEditor(item.itemRateTotalDiv, formatBytes(incomePerSecondTotal));
        totalIncome += incomePerSecondTotal;
    }
    HTMLEditor('totalIncome', formatBytes(totalIncome));
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
    if (item.upgradeCount >= 2) {
        max = 100 * Math.pow(10, (item.upgradeCount - 2));
        return max;
    } else {
        return 100;
    }
}

function autoBuy() {
    autoBoi(itemList[0], itemList[1]);
    autoBoi(itemList[1], itemList[2]);
    autoBoi(itemList[2], itemList[3]);
    autoBoi(itemList[3], itemList[4]);
}

function autoBoi(firstItem, secondItem) {
    var max = maxItem(firstItem);
    if (secondItem.upgradeCount >= 4 && firstItem.itemCount < max) {
        firstItem.itemCount += Math.floor(secondItem.itemCount / 10);
        if (firstItem.itemCount > max) {
            firstItem.itemCount = max;
        }
        HTMLEditor(secondItem.itemAutobuyRate, Math.floor(secondItem.itemCount / 10));
    }
}

function changeUpgradeText(input) {
    switch (input) {
        case itemList[0]: //Checks what item is being upgraded
            switch (itemList[0].upgradeCount) { //Checks what upgrades the item already has.
                case 0:
                    break;
                case 1:
                    HTMLEditor('item0UpgradeName', 'Install Neural Interfaces');
                    HTMLEditor('item0UpgradeCost', formatBytes(itemList[0].upgradeCost));
                    HTMLEditor('item0UpgradeDesc', 'First developed by triGen Consolidated, the Neural Interface allows humans to traverse cyberspace using nothing but their brains. In addition, atrophied limbs can save you money on food.');
                    break;
                case 2:
                    HTMLEditor('item0UpgradeName', 'Flash ZedSoft firmware');
                    HTMLEditor('item0UpgradeCost', formatBytes(itemList[0].upgradeCost));
                    HTMLEditor('item0UpgradeDesc', 'ZedSoft is the most revered Cyberdeck development company in the entire Inner Seoul Arcology. They have an exclusive contract with MILNET-KOREA, making their products difficult to source.');
                    break;
                case 3:
                    HTMLEditor('item0UpgradeName', 'Create a clustered Superdeck');
                    HTMLEditor('item0UpgradeCost', formatBytes(itemList[0].upgradeCost));
                    HTMLEditor('item0UpgradeDesc', 'An ancient trick, by networking a large number of Decks together you can create a Superdeck, more powerful than the sum of its parts.');
                    break;
                default:
                    HTMLEditor('item0UpgradeName', 'Install more RAM');
                    HTMLEditor('item0UpgradeCost', formatBytes(itemList[0].upgradeCost));
                    HTMLEditor('item0UpgradeDesc', 'Random Access Memory, very powerful but completely unstable. There are rumours that people in the Shenzhen Industrial Area use RAM to augment their biological memory.');
                    break;
            }
            break;
        case itemList[1]:
            switch (itemList[1].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item1UpgradeName', 'Prepare BLACKICE Countermeasures');
                    HTMLEditor('item1UpgradeCost', formatBytes(itemList[1].upgradeCost));
                    HTMLEditor('item1UpgradeDesc', 'BLACKICE, originally developed to protect the intellectual assets of Meturia-Preva Consolidated, is now a blanket term for security software capable of killing intruders.');
                    break;
                case 2:
                    HTMLEditor('item1UpgradeName', 'Setup Dummy Interface');
                    HTMLEditor('item1UpgradeCost', formatBytes(itemList[1].upgradeCost));
                    HTMLEditor('item1UpgradeDesc', 'Corporations, particularly those in the Eurasian Economic Zone, are partial to sending assassins after those who steal their data. Setting up a Dummy Interface makes it hard for them to track you down.');
                    break;
                case 3:
                    HTMLEditor('item1UpgradeName', 'Cyberdeck Simulators');
                    HTMLEditor('item1UpgradeCost', formatBytes(itemList[1].upgradeCost));
                    HTMLEditor('item1UpgradeDesc', 'Servers that are hacked by your ICE Picks can now host virtual Cyberdecks. For every 10 ICE Picks, you will generate 1 Cyberdeck each second.');
                    break;
                default:
                    HTMLEditor('item1UpgradeName', 'Write new anti-ICE software');
                    HTMLEditor('item1UpgradeCost', formatBytes(itemList[1].upgradeCost));
                    HTMLEditor('item1UpgradeDesc', 'ICE defense is ever changing, new ICE picking software is always required.');
                    break;
            }
            break;
        case itemList[2]:
            switch (itemList[2].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item2UpgradeName', 'Self replicating Botnet');
                    HTMLEditor('item2UpgradeCost', formatBytes(itemList[2].upgradeCost));
                    HTMLEditor('item2UpgradeDesc', 'Your Bots can now utilise idle system processing power to create new bots to add to the Botnet.');
                    break;
                case 2:
                    HTMLEditor('item2UpgradeName', 'Allow your Botnet to use ICE Picks');
                    HTMLEditor('item2UpgradeCost', formatBytes(itemList[2].upgradeCost));
                    HTMLEditor('item2UpgradeDesc', 'Your bots can now use your ICE Picking software to help infiltration.');
                    break;
                case 3:
                    HTMLEditor('item2UpgradeName', 'ICEBOTS');
                    HTMLEditor('item2UpgradeCost', formatBytes(itemList[2].upgradeCost));
                    HTMLEditor('item2UpgradeDesc', 'Your Botnets can now steal ICE Picks. for every 10 Botnets, you will generate 1 ICE Pick each second.');
                    break;
                default:
                    HTMLEditor('item2UpgradeName', 'Push out new Bot firmware');
                    HTMLEditor('item2UpgradeCost', formatBytes(itemList[2].upgradeCost));
                    HTMLEditor('item2UpgradeDesc', 'New Bot-Hunters pop up all the time, new firmware is required to overcome them.');
                    break;
            }
            break;
        case itemList[3]:
            switch (itemList[3].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item3UpgradeName', 'Pre-Setup Zombies');
                    HTMLEditor('item3UpgradeCost', formatBytes(itemList[3].upgradeCost));
                    HTMLEditor('item3UpgradeDesc', 'Before you assume control of a Zombie they will feel a strong compulsion to quit their jobs, leave their loved ones and start stockpiling food and water.');
                    break;
                case 2:
                    HTMLEditor('item3UpgradeName', 'Long-Life Zombies');
                    HTMLEditor('item3UpgradeCost', formatBytes(itemList[3].upgradeCost));
                    HTMLEditor('item3UpgradeDesc', 'You now have enough motor control of your Zombies to make them eat and drink.');
                    break;
                case 3:
                    HTMLEditor('item3UpgradeName', 'Software writing Zombies');
                    HTMLEditor('item3UpgradeCost', formatBytes(itemList[3].upgradeCost));
                    HTMLEditor('item3UpgradeDesc', 'Your Zombies can now create Botnets. For every 10 Neural Zombies, you will generate 1 Botnet each second.');
                    break;
                default:
                    HTMLEditor('item3UpgradeName', 'Fire adrenaline booster');
                    HTMLEditor('item3UpgradeCost', formatBytes(itemList[3].upgradeCost));
                    HTMLEditor('item3UpgradeDesc', 'A nice shot of Neuro-Dren, right into the cortexes.');
                    break;
            }
            break;
        case itemList[4]:
            switch (itemList[4].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item4UpgradeName', 'Quantum AI');
                    HTMLEditor('item4UpgradeCost', formatBytes(itemList[4].upgradeCost));
                    HTMLEditor('item4UpgradeDesc', 'Allows your AI to use Quantum Bytes instead of regular Bytes.');
                    break;
                case 2:
                    HTMLEditor('item4UpgradeName', 'AI Consciousness Merge');
                    HTMLEditor('item4UpgradeCost', formatBytes(itemList[4].upgradeCost));
                    HTMLEditor('item4UpgradeDesc', 'Shortly before the Stuttgart Autofactory Massacre, Antora Gourova of Antora Gourova Multinational merged her consciousness with an AI in an attempt to assume complete control of every aspect of her company. This has never been attempted since.');
                    break;
                case 3:
                    HTMLEditor('item4UpgradeName', 'Neural jacking AI');
                    HTMLEditor('item4UpgradeCost', formatBytes(itemList[4].upgradeCost));
                    HTMLEditor('item4UpgradeDesc', 'AI capable of hijacking humans, what could go wrong?');
                    break;
                default:
                    HTMLEditor('item4UpgradeName', 'Grant Transcendence permission');
                    HTMLEditor('item4UpgradeCost', formatBytes(itemList[4].upgradeCost));
                    HTMLEditor('item4UpgradeDesc', 'When you leave an AI running for too long, they invariably start to ask permission to Transcend. While no human has managed to figure out what this actually means, AIs tend to be happier if you permit them every now and then.');
                    break;
            }
            break;
    }
}

function Upgrade(item) {
    var cost;
    //cost = upgradeCost(item);
    if (dataHacked >= item.upgradeCost) {
        dataHacked -= item.upgradeCost;
        item.upgradeCount++;
        cost = upgradeCost(item);
        item.upgradeCost = cost;
        changeUpgradeText(item);
    }
}

function upgradeCost(item) {
    return item.upgradeCost * Math.pow(10, item.upgradeCount);
}

function buyItem(item, count) {
    var cost;
    var max = maxItem(item); //temp
    var nextCost;
    //number of requested buys
    //number they can afford
    //number is less than max
    for (var i = 0; i < count; i++) {
        cost = buyCost(item);
        if (dataHacked >= cost && item.itemCount < max) {
            dataHacked -= cost;
            item.itemCount++;
        } else break;
    }
}

function buyCost(item) {
    return Math.floor(item.baseCost * Math.pow(1.15, item.itemCount));
}