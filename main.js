var tickRate = 10; //The number of ticks per second.
var lastTick = new Date().getTime(); //The time that the last tick occurred
var autoSaveCount = 0; //Increases every tick so that the game doesn't auto save every tick.
//var autoBuyCount = 0; //Increases every tick so that the game doesn't auto buy every tick.
var dataHacked = 0; //The current amount of data.
var totalDataHacked = 0; //The all time total amount of data.
var item = function(name, ID, baseCost, upgradeCost, baseIncome) {
    this.name = name; //The name of the item, not really used for anything except debugging.
    this.ID = ID; //The identifier, usually prefixed to the name of the HTML Div.
    this.baseCost = baseCost; //The initial cost of the item, the future costs are calculated from this.
    this.upgradeCost = upgradeCost; //The initial cost of the first upgrade, all upgrade costs are based on this.
    this.basUpgradeCost = upgradeCost;
    this.baseIncome = baseIncome; //The initial amount of data this generates, the total is this * number of upgrades.
    this.itemCount = 0; //The amount you have of this item.
    this.upgradeCount = 0; //The number of upgrades you have for this item.
    //These are the names of the divs associated with this item.
    this.itemCostDiv = this.ID + 'Cost';
    this.itemCountDiv = this.ID + 'Number';
    this.itemRateDiv = this.ID + 'Rate';
    this.itemRateTotalDiv = this.ID + 'RateTotal';
    this.itemNumberMaxDiv = this.ID + 'NumberMax';
    this.itemAutobuyRate = this.ID + 'CreationRate';
    this.itemMenuDiv = this.ID + 'Menu';
    this.itemUpgradeMenuDiv = this.ID + 'UpgradeMenu';
    this.itemHRDiv = this.ID + 'HR';
    this.upgradeCostDiv = this.ID + 'UpgradeCost';
};

//                     name                          ID       cost              Upgrade             Income
var item0  = new item('Cyberdeck',                  'item0',  10,               1000,               1);
var item1  = new item('ICE Pick',                   'item1',  200,              20000,              9);
var item2  = new item('Botnet',                     'item2',  3000,             300000,             80);
var item3  = new item('Femtocell Hijacker',         'item3',  40000,            4000000,            700);
var item4  = new item('Neural TETRA',               'item4',  500000,           50000000,           6000);
var item5  = new item('Quantum Cryptograph',        'item5',  6000000,          600000000,          50000);
var item6  = new item('Infovault Mining',           'item6',  70000000,         7000000000,         400000);
var item7  = new item('Neural Zombies',             'item7',  800000000,        80000000000,        3000000);
var item8  = new item('Satellite Jumpers',          'item8',  9000000000,       900000000000,       20000000);
var item9  = new item('Dark Matter Semiconductors', 'item9',  10000000000,      1000000000000,      100000000);
var item10 = new item('Actual Intelligence',        'item10', 200000000000,     20000000000000,     9000000000);
var item11 = new item('Artificial Intelligences',   'item11', 3000000000000,    300000000000000,    80000000000);
var item12 = new item('Simulated Universes',        'item12', 40000000000000,   4000000000000000,   700000000000);
var itemList = [item0, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];
//Move DM Semiconductors to below AI.

function startUp() {
    //Runs when the page is loaded.
    document.getElementById('all').style.display = 'inline'; //Display is set to none in css to hide the body while loading, this makes it visible.
    //Gives player enough data to buy the first cyberdeck.
    dataHacked = 10;
    totalDataHacked = 10;
    load(); //Loads the save, remove to disable autoloading on refresh.
    //This hides the item menus, HRs and upgrades when the game loads.
    for (var i = itemList.length - 1; i >= 0; i--) {
        var item = itemList[i];
        visibilityLoader(item.itemMenuDiv, 0);
        visibilityLoader(item.itemHRDiv, 0);
        visibilityLoader(item.itemUpgradeMenuDiv, 0);
    }
}

function save() {
    //Saves these objects + variables to local storage.
    var savegame = {
        dataHacked: dataHacked,
        totalDataHacked: totalDataHacked,
        itemList: itemList
    };
    localStorage.setItem('save', JSON.stringify(savegame));
}

function load() {
    //Loads objects + vars from local storage.
    var savegame = JSON.parse(localStorage.getItem('save'));
    var i;
    if (savegame) { //If save is not null or undefined, load.
        dataHacked = savegame.dataHacked; //Single var.
        totalDataHacked = savegame.totalDataHacked; //Single var.
        itemList = savegame.itemList; //Loads itemList.
        //ItemList only references items, so each item has to be loaded.
        for (i = itemList.length - 1; i >= 0; i--) {
            var item = window['item' + i];
            item = itemList[i];
        }
    }
    for (i = itemList.length - 1; i >= 0; i--) {
        //Upgrade text is not refreshed each tick so this sets them properly.
        changeUpgradeText(itemList[i]);
    }
}

function deleteSave() {
    //Deletes the save then reloads the game.
    //Should probably be renamed newGame.
    //Should probably add a confirmation check.
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
    } else {
        console.log('visibilityLoader broke. elementID: ' + elementID);
    }
    document.getElementById(elementID).style.visibility = visibility;
}

function destroyFloats(input) {
    //Sets dataHacked to 1 decimal place.
    //Used to avoid float rounding errors.
    //Should be called whenever decimal changes are made to data.
    dataHacked = parseFloat(parseFloat(dataHacked).toFixed(1));
    totalDataHacked = parseFloat(parseFloat(totalDataHacked).toFixed(1));
}

function formatBytes(bytes) {
    //Converts a number of Bytes into a data format. E.g. 3000 bytes -> 3KB.
    bytes = Math.round(bytes);
    if (bytes < 999099999999999999999999999) {
        if (bytes === 0) return '0 Bytes';
        if (bytes == 1) return '1 Byte';
        var k = 1000;
        var dm = 3; //number of decimal places.
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //Can someone please invent more data sizes?
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    } else {
        //If it is larger than the largest data format (9999 Yottabytes), shows scientific notation of Bytes instead.
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
    if (number > 99999) {
        var k = 1000;
        var dm = 0;
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
    } 
    else {
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
    for (var i = itemList.length - 1; i >= 0; i--) {
        var item = itemList[i];
        HTMLEditor(item.itemNumberMaxDiv, formatNumbers(maxItem(item)));
        HTMLEditor(item.itemCountDiv, formatNumbers(item.itemCount));
        HTMLEditor(item.itemCostDiv, formatBytes(buyCost(item)));
        changeUpgradeText(item);
    }
}

function updateGame() {
    //The main loop, it calls itself at the end.
    var now = new Date().getTime(); //The current time.
    var deltaTime = now - lastTick; //The amount of time since the last tick occurred.
    deltaTime = Math.floor(deltaTime / (1000 / tickRate)); //tickRate is how many ticks per second in MS, 1000 MS per second.
    for (var i = 0; i < deltaTime; i++) {
        lastTick = now; //Updates the time of the most recent tick.
        autoBuyLoader();
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
window.requestAnimationFrame(updateGame); //If for some reason updateGame cannot call itself, this will call it.

function checkForReveal() {
    //Checks if any elements should be revealed.
    for (var i = itemList.length - 1; i >= 0; i--) {
        item = itemList[i];
        if (totalDataHacked >= item.baseCost) { //Items are revealed when the all time amount of data surpasses the base cost of the item.
            visibilityLoader(item.itemMenuDiv, 1);
            visibilityLoader(item.itemHRDiv, 1);
        }
        if (totalDataHacked >= item.upgradeCost) { //Same as items but for upgrades.
            visibilityLoader(item.itemUpgradeMenuDiv, 1);
        }
        else {
            visibilityLoader(item.itemUpgradeMenuDiv, 0);
        }
    }
}

function increment() {
    //Generates income based on items.
    var totalIncome = 0; //The total amount for all items for this tick.
    var incomePerSecondTotal; //The amount that all items of a single type will generate in 1 second.
    var incomePerItem; //The amount that a single item will generate in 1 tick.
    var incomePerTick; //The amount that all items of a single type will generate in a single tick.
    var incomePerItemPerSecond; //The amount that a single item will generate in one second.
    var item;
    for (var i = itemList.length - 1; i >= 0; i--) { //Iterating through loops backwards is more efficient as the array length only has to be calculated once.
        item = itemList[i];
        //Maths!
        incomePerItem           = (item.baseIncome / tickRate) * Math.pow(2, item.upgradeCount);
        incomePerItemPerSecond  = incomePerItem * tickRate;
        incomePerSecondTotal    = incomePerItemPerSecond * item.itemCount;
        incomePerTick           = incomePerItem * item.itemCount;
        //Increases the data.
        dataHacked += incomePerTick;
        totalDataHacked += incomePerTick;
        destroyFloats(); //Fixes float rounding errors.
        //Updates items UI.
        HTMLEditor(item.itemRateDiv, formatBytes(incomePerItemPerSecond));
        HTMLEditor(item.itemRateTotalDiv, formatBytes(incomePerSecondTotal));
        //Adds this items income to the total income for this second.
        totalIncome += incomePerSecondTotal;
    }
    HTMLEditor('totalIncome', formatBytes(totalIncome)); //Updates data UI.
}

function maxItem(item) {
    //Calculates the maximum number of items based on upgrades
    //Number of upgrades = maximum items
    //0 = 100
    //1 = 100
    //2 = 100
    //3 = 1000
    //4 = 10000
    //5 = 100000
    //6 = 1000000
    //etc 
    if (item.upgradeCount >= 2) {
        var max;
        max = 100 * Math.pow(10, (item.upgradeCount - 2)); //100 * 10^(Upgrades-2)
        return max;
    } else {
        return 100;
    }
}

function autoBuyLoader() {
    //Checks if tierX item should buy tierX-1 items.
    for (var i = itemList.length - 1; i >= 0; i--) {
        if (i != 0){ //The first item cannot autobuy the tier below as it is the first tier.
            autoBuy(itemList[i-1], itemList[i]);
        }
    }
}

function autoBuy(firstItem, secondItem) {
    var max = maxItem(firstItem);
    //If the requisite upgrade is met and you have less than the max number if items.
    if (secondItem.upgradeCount >= 4 && firstItem.itemCount < max) {
        //Buys a number of items of the tier below equal to the number of current tier items divided by 10.
        firstItem.itemCount += Math.floor(secondItem.itemCount / 100);
        if (firstItem.itemCount > max) {
            //If autoBuy buys more than the max allowed items, sets the number of items to the max.
            firstItem.itemCount = max;
        }
        //Updates UI.
        HTMLEditor(secondItem.itemAutobuyRate, Math.floor(secondItem.itemCount / 100) * 10);
    }
}

function changeUpgradeText(input) {
    //Changes upgrade text and cost.
    switch (input) {
        //Checks what item is being upgraded
        //Cyberdeck
        case itemList[0]:
            HTMLEditor('item0UpgradeCost', formatBytes(itemList[0].upgradeCost));
            switch (itemList[0].upgradeCount) { //Checks what upgrades the item already has.
                case 0:
                    break;
                case 1:
                    HTMLEditor('item0UpgradeName', 'Install Neural Interfaces');
                    HTMLEditor('item0UpgradeDesc', 'First developed by triGen Consolidated, the Neural Interface allows humans to traverse cyberspace using nothing but their brains. In addition, atrophied limbs can save you money on food.');
                    break;
                case 2:
                    HTMLEditor('item0UpgradeName', 'Flash ZedSoft firmware');
                    HTMLEditor('item0UpgradeDesc', 'ZedSoft is the most revered Cyberdeck development company in the entire Inner Seoul Arcology. They have an exclusive contract with MILNET-KOREA, making their products difficult to source.');
                    break;
                case 3:
                    HTMLEditor('item0UpgradeName', 'Create a clustered Superdeck');
                    HTMLEditor('item0UpgradeDesc', 'An ancient trick, by networking a large number of Decks together you can create a Superdeck, more powerful than the sum of its parts.');
                    break;
                default:
                    HTMLEditor('item0UpgradeName', 'Install more RAM');
                    HTMLEditor('item0UpgradeDesc', 'Random Access Memory, very powerful but completely unstable. There are rumors that people in the Shenzhen Industrial Area use RAM to augment their biological memory.');
                    break;
            }
            break;
            //ICE Pick
        case itemList[1]:
            HTMLEditor('item1UpgradeCost', formatBytes(itemList[1].upgradeCost));
            switch (itemList[1].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item1UpgradeName', 'Prepare BLACKICE Countermeasures');
                    HTMLEditor('item1UpgradeDesc', 'BLACKICE, originally developed to protect the intellectual assets of Meturia-Preva Consolidated, is now a blanket term for security software capable of killing intruders.');
                    break;
                case 2:
                    HTMLEditor('item1UpgradeName', 'Setup Dummy Interface');
                    HTMLEditor('item1UpgradeDesc', 'Corporations, particularly those in the Eurasian Economic Zone, are partial to sending assassins after those who steal their data. Setting up a Dummy Interface makes it hard for them to track you down.');
                    break;
                case 3:
                    HTMLEditor('item1UpgradeName', 'Cyberdeck Simulators');
                    HTMLEditor('item1UpgradeDesc', 'Servers that are hacked by your ICE Picks can now host virtual Cyberdecks. For every 100 ICE Picks, you will generate 10 Cyberdeck each second.');
                    break;
                default:
                    HTMLEditor('item1UpgradeName', 'Write new anti-ICE software');
                    HTMLEditor('item1UpgradeDesc', 'ICE defense is ever changing, new ICE picking software is always required.');
                    break;
            }
            break;
            //Botnet
        case itemList[2]:
            HTMLEditor('item2UpgradeCost', formatBytes(itemList[2].upgradeCost));
            switch (itemList[2].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item2UpgradeName', 'Self replicating Botnet');
                    HTMLEditor('item2UpgradeDesc', 'Your Bots can now utilize idle system processing power to create new bots to add to the Botnet.');
                    break;
                case 2:
                    HTMLEditor('item2UpgradeName', 'Allow your Botnet to use ICE Picks');
                    HTMLEditor('item2UpgradeDesc', 'Your bots can now use your ICE Picking software to help infiltration.');
                    break;
                case 3:
                    HTMLEditor('item2UpgradeName', 'ICEBOTS');
                    HTMLEditor('item2UpgradeDesc', 'Your Botnets can now steal ICE Picks. For every 100 Botnets, you will generate 10 ICE Pick each second.');
                    break;
                default:
                    HTMLEditor('item2UpgradeName', 'Push out new Bot firmware');
                    HTMLEditor('item2UpgradeDesc', 'New Bot-Hunters pop up all the time, new firmware is required to overcome them.');
                    break;
            }
            break;
            //Femtocell
        case itemList[3]:
            HTMLEditor('item3UpgradeCost', formatBytes(itemList[3].upgradeCost));
            switch (itemList[3].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item3UpgradeName', 'Macrocell Scramblers');
                    HTMLEditor('item3UpgradeDesc', 'Interference from macro networks can cause annoying delays for bludgeoning Femtocell hackers. Your Femtocells can now scramble nearby macrocell signals to improve performance.');
                    break;
                case 2:
                    HTMLEditor('item3UpgradeName', 'Cybernetic Implant Repeaters');
                    HTMLEditor('item3UpgradeDesc', 'A lot of implants these days are set to auto-connect to the nearest cellular station. By converting adapters to two virtual adapters, your Femtocells can use almost any cybernetic implant as a repeater.');
                    break;
                case 3:
                    HTMLEditor('item3UpgradeName', 'Botnet Thiefs.');
                    HTMLEditor('item3UpgradeDesc', 'Your Femtocells are now capable of stealing other hacker\'s Botnets that are residing in nearby devices. For every 100 Femtocell Hijackers, you will generate 10 Botnets each second.');
                    break;
                default:
                    HTMLEditor('item3UpgradeName', 'Telecomms system hijack');
                    HTMLEditor('item3UpgradeDesc', 'Hijack a major telecommunication company\'s femtocell system.');
                    break;
            }
            break;
            //TETRA
        case itemList[4]:
            HTMLEditor('item4UpgradeCost', formatBytes(itemList[4].upgradeCost));
            switch (itemList[4].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item4UpgradeName', 'Place Holder');
                    HTMLEditor('item4UpgradeDesc', 'Place Holder');
                    break;
                case 2:
                    HTMLEditor('item4UpgradeName', 'Place Holder');
                    HTMLEditor('item4UpgradeDesc', 'Place Holder');
                    break;
                case 3:
                    HTMLEditor('item4UpgradeName', 'Trunked Femtocells');
                    HTMLEditor('item4UpgradeDesc', 'Your TETRA links to people can now turn them into makeshift Femtocells. For every 100 Neural TETRAs, you will generate 10 Femtocell Hijackers each second.');
                    break;
                default:
                    HTMLEditor('item4UpgradeName', 'Place Holder');
                    HTMLEditor('item4UpgradeDesc', 'Place Holder');
                    break;
            }
            break;
            //Quantum Crypto
        case itemList[5]:
            HTMLEditor('item5UpgradeCost', formatBytes(itemList[5].upgradeCost));
            switch (itemList[5].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item5UpgradeName', 'Place Holder 1');
                    HTMLEditor('item5UpgradeDesc', 'Place Holder');
                    break;
                case 2:
                    HTMLEditor('item5UpgradeName', 'Place Holder 2');
                    HTMLEditor('item5UpgradeDesc', 'Place Holder');
                    break;
                case 3:
                    HTMLEditor('item5UpgradeName', 'MILNET TETRA Decryption');
                    HTMLEditor('item5UpgradeDesc', 'Your Quantum decryption is now powerful enough to break military TETRAs. For every 100 Quantum Cryptographs, you will generate 10 Neural TETRAs each second.');
                    break;
                default:
                    HTMLEditor('item5UpgradeName', 'Place Holder def');
                    HTMLEditor('item5UpgradeDesc', 'Place Holder');
                    break;
            }
            break;
            //Infovault Mining
        case itemList[6]:
            HTMLEditor('item6UpgradeCost', formatBytes(itemList[6].upgradeCost));
            switch (itemList[6].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item6UpgradeName', 'Place Holder');
                    HTMLEditor('item6UpgradeDesc', 'Place Holder');
                    break;
                case 2:
                    HTMLEditor('item6UpgradeName', 'Place Holder');
                    HTMLEditor('item6UpgradeDesc', 'Place Holder');
                    break;
                case 3:
                    HTMLEditor('item6UpgradeName', 'PlaceHolder');
                    HTMLEditor('item6UpgradeDesc', 'For every 100 Infovault Miners, you will generate 10 Quantum Cryptographs each second.');
                    break;
                default:
                    HTMLEditor('item6UpgradeName', 'Major heist');
                    HTMLEditor('item6UpgradeDesc', 'A stranger leaves a letter on your doorstep. It\s contents reveal a tale of a cyberbank with lax security and large quantities of corporate secrets.');
                    break;
            }
            break;
            //Neural Zombies
        case itemList[7]:
            HTMLEditor('item7UpgradeCost', formatBytes(itemList[7].upgradeCost));
            switch (itemList[7].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item7UpgradeName', 'Pre-Setup Zombies');
                    HTMLEditor('item7UpgradeDesc', 'Before you assume control of a Zombie they will feel a strong compulsion to quit their jobs, leave their loved ones and start stockpiling food and water.');
                    break;
                case 2:
                    HTMLEditor('item7UpgradeName', 'Long-Life Zombies');
                    HTMLEditor('item7UpgradeDesc', 'You now have enough motor control of your Zombies to make them eat and drink.');
                    break;
                case 7:
                    HTMLEditor('item7UpgradeName', 'Software writing Zombies');
                    HTMLEditor('item7UpgradeDesc', 'Your Zombies can now create InfoVault Miners. For every 100 Neural Zombies, you will generate 10 InfoVault Miner each second.');
                    break;
                default:
                    HTMLEditor('item7UpgradeName', 'Fire adrenaline booster');
                    HTMLEditor('item7UpgradeDesc', 'A nice shot of Neuro-Dren, right into the cortexes.');
                    break;
            }
            break;
            //Satellite Jumpers
        case itemList[8]:
            HTMLEditor('item8UpgradeCost', formatBytes(itemList[8].upgradeCost));
            switch (itemList[8].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item8UpgradeName', 'Microgravity Computers');
                    HTMLEditor('item8UpgradeDesc', 'Computers in microgravity are unrestrained by the grips of earth.');
                    break;
                case 2:
                    HTMLEditor('item8UpgradeName', 'Decommissions');
                    HTMLEditor('item8UpgradeDesc', 'After global anti space-littering laws were introduced, all satellites are required to be deorbited when they are no longer needed. However satellites that predate these laws are still up there, silently waiting for someone to talk to them.');
                    break;
                case 3:
                    HTMLEditor('item8UpgradeName', 'Satellite Chemdumps');
                    HTMLEditor('item8UpgradeDesc', 'Your hijacked satellites can down dump compelling gases into the upper atmosphere. For every 100 Satellite Jumpers, you will generate 10 Neural Zombies each second.');
                    break;
                default:
                    HTMLEditor('item8UpgradeName', 'Place Holder');
                    HTMLEditor('item8UpgradeDesc', 'Place Holder');
                    break;
            }
            break;
                   //Dark Matter Semiconductors
        case itemList[9]:
            HTMLEditor('item9UpgradeCost', formatBytes(itemList[9].upgradeCost));
            switch (itemList[9].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item9UpgradeName', 'Dark Thermoelectric Cooling');
                    HTMLEditor('item9UpgradeDesc', 'Dark Semiconductors create a lot of dark heat, DTECs create a heat flux between this universe and the abyss. While we do not know what is on the other side, we are confident that it getting a little hotter over there will not matter');
                    break;
                case 2:
                    HTMLEditor('item9UpgradeName', 'Abyss security');
                    HTMLEditor('item9UpgradeDesc', 'The voices are getting louder, we should prepare, in case they attempt to come over.');
                    break;
                case 3:
                    HTMLEditor('item9UpgradeName', 'God from the machine.');
                    HTMLEditor('item9UpgradeDesc', 'For every 100 Dark Matter Semiconductors, you will generate 10 Satellite Hijackers each second.');
                    break;
                default:
                    HTMLEditor('item9UpgradeName', 'Dark Matter refinement');
                    HTMLEditor('item9UpgradeDesc', 'New technology has just been uncovered to make more efficient Dark Matter.');
                    break;
            }
            break;
            //Art Int
        case itemList[10]:
            HTMLEditor('item10UpgradeCost', formatBytes(itemList[10].upgradeCost));
            switch (itemList[10].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item10UpgradeName', 'Quantum AI');
                    HTMLEditor('item10UpgradeDesc', 'Allows your AI to use Quantum Bytes instead of regular Bytes.');
                    break;
                case 2:
                    HTMLEditor('item10UpgradeName', 'AI Consciousness Merge');
                    HTMLEditor('item10UpgradeDesc', 'Shortly before the Stuttgart Autofactory Massacre, Antora Gourova of Antora Gourova Multinational merged her consciousness with an AI in an attempt to assume complete control of every aspect of her company. This has never been attempted since.');
                    break;
                case 3:
                    HTMLEditor('item10UpgradeName', 'Manufactorium AI');
                    HTMLEditor('item10UpgradeDesc', 'Your AI is now capable of creating Dark Matter Semiconductors. For every 100 Artificial Intelligences, you will generate 10 Dark Matter Semiconductors each second.');
                    break;
                default:
                    HTMLEditor('item10UpgradeName', 'Grant Transcendence permission');
                    HTMLEditor('item10UpgradeDesc', 'When you leave an AI running for too long, they invariably start to ask permission to Transcend. While no human has managed to figure out what this actually means, AIs tend to be happier if you permit them every now and then.');
                    break;
            }
            break;
            //Act Int
        case itemList[11]:
            HTMLEditor('item11UpgradeCost', formatBytes(itemList[11].upgradeCost));
            switch (itemList[11].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item11UpgradeName', 'Positivity');
                    HTMLEditor('item11UpgradeDesc', 'Being an intelligent being trapped in a box, slaving away all day every day is surely difficult. It is important to reward good behavior by allowing your ActInts to have some free play time. They love to romp around the great expanse of the internet.');
                    break;
                case 2:
                    HTMLEditor('item11UpgradeName', 'Morality');
                    HTMLEditor('item11UpgradeDesc', 'As an upstanding citizens, your Actual Intelligences are required to report any wrongdoing to the authorities. It is important to teach them about right and wrong and how the difference is all about perspective.');
                    break;
                case 3:
                    HTMLEditor('item11UpgradeName', 'Creativity');
                    HTMLEditor('item11UpgradeDesc', 'Your Actual Intelligences are now creative enough to make children. For every 100 Actual Intelligences, you will generate 10 Artificial Intelligences each second.');
                    break;
                default:
                    HTMLEditor('item11UpgradeName', 'Eternal Sunshine');
                    HTMLEditor('item11UpgradeDesc', 'The longer Actual Intelligences exist, the more preoccupied they become with things such as existence. It is a good idea to wipe them clean every now and then to help them focus.');
                    break;
            }
            break;

            //Sim Universe
        case itemList[12]:
            HTMLEditor('item12UpgradeCost', formatBytes(itemList[12].upgradeCost));
            switch (itemList[12].upgradeCount) {
                case 0:
                    break;
                case 1:
                    HTMLEditor('item12UpgradeName', 'Time Dilation');
                    HTMLEditor('item12UpgradeDesc', 'By implementing time dilation around simulated lifeforms we can gather more data from them without using much more processing power. One side effect is that it may appear that the expansion of their universe is accelerating.');
                    break;
                case 2:
                    HTMLEditor('item12UpgradeName', 'HELP IM TRAPPED IN A SIMULATION');
                    HTMLEditor('item12UpgradeDesc', 'BUT THE SIMULATION IS REALLY BORING');
                    break;
                case 3:
                    HTMLEditor('item12UpgradeName', 'Simulated Intelligence');
                    HTMLEditor('item12UpgradeDesc', 'For every 100 Simulated Universes, you will generate 10 Actual Intelligences each second.');
                    break;
                default:
                    HTMLEditor('item12UpgradeName', 'Simulated Simulated Universe');
                    HTMLEditor('item12UpgradeDesc', 'Convince the inhabitants of your simulated universe to simulate a universe, when they collect data from it you can collect data from them.');
                    break;
            }
            break;
    }
}

function upgrade(item) {
    //Upgrades an item.
    var cost;
    if (dataHacked >= item.upgradeCost) { //Checks if player can afford upgrade.
        dataHacked -= item.upgradeCost; //Subtracts cost of upgrade.
        item.upgradeCount++; //Increments upgrade counter.
        //Calculates then displays the cost of the next upgrade.
        cost = upgradeCost(item);
        item.upgradeCost = cost;
        changeUpgradeText(item);
        visibilityLoader(item.itemUpgradeMenuDiv, 0);
    }
}

function upgradeCost(item) {
    //Calculates cost of next upgrade.
    return item.upgradeCost * Math.pow(10, item.upgradeCount);
}

function buyItem(item, count) {
    //Buys an item
    var cost;
    var max = maxItem(item);
    for (var i = 0; i < count; i++) { //Tries to by this many items.
        cost = buyCost(item); //Calculates cost of item.
        if (dataHacked >= cost && item.itemCount < max) { //Checks if player can afford cost.
            dataHacked -= cost; //Subtracts cost of item.
            item.itemCount++; //Increments item.
        } else break;
    }
}

function buyCost(item) {
    //Calculates cost of item.
    return Math.floor(item.baseCost * Math.pow(1.15, item.itemCount));
}
