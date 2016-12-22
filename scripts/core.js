 /*
    ________  __    __________  __  ___   ____ __
   /  _/ __ \/ /   / ____/ __ \/ / / / | / / // _/
   / '/ / / /   / __/ / /_/ / / / /  |/ /   ,<   
 _/ '/_/ / /___/ /___/ ____/ /_/ / /|  / /| |  
/___/_____/_____/_____/_/    \____/_/ |_/_/ |_|  
*/

// Idlepunk by Asher is licensed under CC BY-NC-SA 4.0 - https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

/*jshint esversion: 6 */
/*jshint eqeqeq: true */
/*jshint supernew: true */
/*jshint multistr: true */

// Debug tools.
function debugTools() {
    window.debug = new function() {
        // For main game.
        this.addAllitems = function() {
            for (let i = itemList.length - 1; i >= 0; i--) {
                itemList[i].itemData.itemCount = 1e99;
            }
        };
        this.addAllUpgrades = function() {
            for (let i = itemList.length - 1; i >= 0; i--) {
                itemList[i].upgrade.upgradeCount = 100;
            }
        };
        this.addData = function(number = 1000) {
            gameData.dataHacked += number;
            gameData.totalDataHacked += number;
        };
        this.addItem = function(item, count) {
            itemList[item].itemData.itemCount += count;
        };
        this.printItems = function() {
            console.log(itemList);
        };
        this.showPrestige = function() {
            for (let i = 0; i < 700; i++) {
                // This is probably the laziest thing I've ever done.
                prestigePrint();
            }
        };
        // For network game.
        this.selectorLocation = function() {
            const x = grid.selector.x   ;
            const y = grid.selector.y;
            console.log("x: " + x, "y: " + y);
        };
        this.selectorICEStatus = function() {
            const x = grid.selector.x;
            const y = grid.selector.y;
            console.log("Has ICE: " + grid.cells[y][x].ICE.hasICE);
            console.log("Has ICE Connection: " + grid.cells[y][x].ICE.connection);
            console.log("ICE path Intact: " + grid.cells[y][x].ICE.pathIntact);
        };
        this.selectorCellStatus = function(){
            const x = grid.selector.x;
            const y = grid.selector.y;
            console.log(grid.cells[y][x]);   
        }
    }();
}

function gameDataConstructor() {
    // Misc game data that is not associated with specific items.
    window.gameData = {
        saveName: 'idlepunkSave 0.12', // The name used in local storage, change if an update will break using old saves.        
        tickRate: 10, // The number of ticks per second.
        lastTick: new Date().getTime(), // The time that the last tick occurred
        autoSaveTimer: 0, // Increases every tick so that the game doesn't auto save every tick.
        dataHacked: 0, // Data, less what has been spent.
        totalDataHacked: 0, // The total amount of data that has been hacked.
        maxAchievements: 20, // The max number of allowed achievements for each item.
        achievementTabSelected: false, // The ach tab won't flash if the player is already on it.
        flashAchTab: false, // Whether the ach tab is set to flash.
        BIC: 15, // Base item cost.
        BUC: 11, // Base upgrade cost.
        resetCount: 1
    };
}

// Color themes.
function themeConstructor() {
    function colorPreset(body, click, important) {
        this.bodyColor = body;
        this.clickColor = click;
        this.importantColor = important;
    }
    window.theme = {
        currentTheme: 0,
        colorTheme: [
            new colorPreset('#ffa500', '#FF0000', '#FFFF00'), // Orange.
            new colorPreset('#FF5733', '#C70039', '#CC7320'), // Burgandy.
            new colorPreset('#8E44AD', '#BB0E96', '#D2B4DE'), // Purple.
            new colorPreset('#27E700', '#0B8C0F', '#B1FFB3'), // Green.
            new colorPreset('#FDFEFE', '#85929E', '#ABEBC6') // White.
        ]
    };
    colorPreset.prototype.changePresetColors = function() {
        // Changes the UI color theme.
        // Gets an array of elements of a class.
        changeClassColor(document.getElementsByClassName('bodyAll'), theme.colorTheme[theme.currentTheme].bodyColor);
        changeClassColor(document.getElementsByClassName('clickable'), theme.colorTheme[theme.currentTheme].clickColor);
        changeClassColor(document.getElementsByClassName('important'), theme.colorTheme[theme.currentTheme].importantColor);
        changeClassColor(document.getElementsByClassName('dropbtn'), theme.colorTheme[theme.currentTheme].clickColor);
        changeClassColor(document.getElementsByClassName('hr'), theme.colorTheme[theme.currentTheme].bodyColor);
        document.getElementById('menuHR').style.color = theme.colorTheme[theme.currentTheme].importantColor;

        function changeClassColor(classes, color) {
            // Sets an array of elements to a given color.
            for (let i = classes.length - 1; i >= 0; i--) {
                classes[i].style.color = color;
            }
        }
    };
}

function itemConstructor() {
    let item = function(name, ID, baseCost, baseUpgradeCost) {
        this.info = {
            name: name, // The name of the item, not really used for anything except debugging.
            ID: ID // The identifier, usually prefixed to the name of the HTML Div.
        };
        this.itemData = {
            itemCount: 0, // The amount you have of this item.
            baseCost: baseCost, // The initial cost of the item, the future costs are calculated from 
            baseIncome: baseCost / gameData.BIC, // The initial amount of data this generates.
            incomeRateSingle: 0,
            incomeRateTotal: 0,
            maxItems: 100 // Max number of this item, will change with upgrades.
        };
        this.upgrade = {
            baseUpgradeCost: baseUpgradeCost, // The cost of the first upgrade, does not change.
            nextUpgradeCost: baseUpgradeCost, //The cost of the next upgrade, changes with each upgrade.
            upgradeCount: 0, // The number of upgrades you have for this item.
        };
        this.achievement = {
            achCount: 0
        };
        this.autoBuy = {
            autoBuyAmount: 0 // The amount of work that has gone towards an autoBuy, further explanation in autoBuy().
        };
        // These are the names of the divs associated with this item in the DOM.
        this.div = {
            cost:           'item' + ID + 'Cost',
            itemCount:      'item' + ID + 'Number',
            itemRate:       'item' + ID + 'Rate',
            rateTotal:      'item' + ID + 'RateTotal',
            numberMax:      'item' + ID + 'NumberMax',
            autoBuyRate:    'item' + ID + 'CreationRate',
            itemMenu:       'item' + ID + 'Menu',
            upgradeMenu:    'item' + ID + 'UpgradeMenu',
            HR:             'item' + ID + 'HR',
            upgradeCost:    'item' + ID + 'UpgradeCost',
            upgradeName:    'item' + ID + 'UpgradeName',
            upgradeDesc:    'item' + ID + 'UpgradeDesc',
            itemFlex:       'item' + ID + 'Flex',
            upgradeDetails: 'item' + ID + 'UpgradeDetails',
            achOuter:       'item' + ID + 'achOuter',
            achDisplay:     'item' + ID + 'achDisplay',
            achName:        'item' + ID + 'achName'
        };
    };
    window.itemList = [
        new item('Cyberdeck',                   0, Math.pow(gameData.BIC, 1), Math.pow(gameData.BUC, 3)),
        new item('ICE Pick',                    1, Math.pow(gameData.BIC, 3), Math.pow(gameData.BUC, 5)),
        new item('Botnet',                      2, Math.pow(gameData.BIC, 5), Math.pow(gameData.BUC, 7)),
        new item('Femtocell Hijacker',          3, Math.pow(gameData.BIC, 4), Math.pow(gameData.BUC, 8)),
        new item('Neural TETRA',                4, Math.pow(gameData.BIC, 5), Math.pow(gameData.BUC, 9)),
        new item('Quantum Cryptograph',         5, Math.pow(gameData.BIC, 6), Math.pow(gameData.BUC, 10)),
        new item('Infovault Mining',            6, Math.pow(gameData.BIC, 7), Math.pow(gameData.BUC, 11)),
        new item('Neural Zombie',               7, Math.pow(gameData.BIC, 8), Math.pow(gameData.BUC, 12)),
        new item('Satellite Jumper',            8, Math.pow(gameData.BIC, 9), Math.pow(gameData.BUC, 13)),
        new item('Dark Matter Semiconductor',   9, Math.pow(gameData.BIC, 10), Math.pow(gameData.BUC, 14)),
        new item('Artificial Intelligence',     10, Math.pow(gameData.BIC, 11), Math.pow(gameData.BUC, 15)),
        new item('Actual Intelligence',         11, Math.pow(gameData.BIC, 12), Math.pow(gameData.BUC, 16)),
        new item('Simulated Universe',          12, Math.pow(gameData.BIC, 13), Math.pow(gameData.BUC, 17))
    ];

}

function runConstructors() {
    // Creates all global objects.
    gameDataConstructor();
    itemConstructor();
    themeConstructor();
    upgradeTextConstructor();
    prestigeConstructor();
    debugTools();
    netWorkInfiltrationConstructor();
}

function startUp() {
    // Runs when page is loaded.
    runConstructors();
    itemTemplates();
    addData(gameData.BIC); // Adds data equal to the cost of the first item.
    addData(10e99);
    //load();
    showGame();
    startHackGame();
    window.requestAnimationFrame(refreshGameTick); // Calls the first tick of the game.
}

function itemTemplates() {
    // Creates item HTML from a template located in index.
    for (var i = itemList.length - 1; i >= 0; i--) {
        const theTemplateScript = $("#itemTemplate").html(); // Gets the template from html.
        const theTemplate = Handlebars.compile(theTemplateScript); // Compiles template.
        const context = { // Creates data for template.
            "itemName": itemList[i].info.name,
            "itemID": "item" + itemList[i].info.ID,
            "itemListIndex": itemList[i].info.ID
        };
        const theCompiledHtml = theTemplate(context); // Adds data to template.
        $('.item' + itemList[i].info.ID + 'Insert').html(theCompiledHtml); // Inserts the template into HTML.
    }
}

function showGame() {
    // Displays the initial UI elements for the game.
    // Hides message for unsupported browsers.
    document.getElementById('unsupportedBrowser').style.display = 'none';
    // Display is set to none in css to hide the body while loading, this makes it visible.
    document.getElementById('bodyAll').style.display = 'inline';
    // This hides the item menus, HRs and upgrades when the game loads, checkForReveal() with show the relevant ones on the first tick.
    for (let i = itemList.length - 1; i >= 0; i--) {
        visibilityChange(itemList[i].div.itemMenu, false);
        visibilityChange(itemList[i].div.HR, false);
        visibilityChange(itemList[i].div.upgradeMenu, false);
        visibilityChange(itemList[i].div.achOuter, false);
        buyItemUI(itemList[i]);
        updateItemMax(itemList[i]);
    }
}

function refreshGameTick() {
    // The main loop, it sends a request to the browser to be called as often as possible.
    // Because of this the refresh rate varies greatly.
    // The solution is to use a fixed tick rate and delta timing.
    const TTE = ticksToExecute(); // The number of ticks that should be executed.
    if (TTE === 1) {
        executeOneTick();
    } else if (TTE > 1) {
        executeManyTicks(TTE);
    }
    window.requestAnimationFrame(refreshGameTick); // Calls this function again.
}

function executeOneTick() {
    // This is what should normally happen, calculations and UI updates happen once per tick.
    gameData.lastTick = new Date().getTime();
    autoBuy();
    itemsIncome();
    achievementsUnlock();
    autoSave();
    UIRefresh();
    checkForVictory();
}

function executeManyTicks(TTE) {
    // If TTE is greater than 1 it means that the game has not been running.
    // Likely because the player is alt tabbed (or the game is running on a very slow computer and requestAnimationFrame is happening less than 10 times per second).
    // Therefore we want to quickly do all the things that would have happened if the game was running as normal.
    // We want to do all the calculations without having to update the UI, reveal elements, or save the game 
    // until all ticks have been executed and the game is all caught up.
    gameData.lastTick = new Date().getTime();
    for (let i = 0; i < TTE; i++) {
        autoBuy();
        itemsIncome();
        achievementsUnlock();
    }
    autoSave();
    UIRefresh();
    checkForVictory();
}

function UIRefresh() {
    // Displays UI elements that should be refreshed each tick.
    checkForReveal();
    HTMLEditor('dataHacked', formatBytes(Math.floor(gameData.dataHacked)));
    //HTMLEditor('prestigeCost', formatBytes(prestigeCost()));
    autoBuyUI();
    itemsUI();
    achievementsUI();
    refreshNetworkInfiltration();
}

function ticksToExecute() {
    const now = new Date().getTime(); // The current time.
    const deltaTime = now - gameData.lastTick; // The amount of time in ms since the last tick occurred.
    return Math.floor(deltaTime / (1000 / gameData.tickRate)); // The number of ticks that should have happened since the last tick occurred.
}

function autoSave() {
    // Saves the game after a number of ticks equal to the tickRate.
    gameData.autoSaveTimer++;
    if (gameData.autoSaveTimer >= gameData.tickRate) { // Once per second.
        save();
        gameData.autoSaveTimer = 0;
    }
}

function autoBuy() {
    for (let i = itemList.length - 1; i >= 0; i--) {
        // The first item cannot autoBuy the tier below as it is the first tier and there is nothing below it.
        if (i !== 0) {
            // autoBuying an item is unlocked when the buyerItem reaches the 4th upgrade.
            // The buyerItem autoBuys the boughtItem, which is always 1 tier below.
            // buyerItem = itemList[i]
            // boughtItem itemList[i - 1]
            // It may take multiple ticks for an item to be bought.
            // Each tick adds work towards buying the item.
            if (autoBuyEligible(itemList[i], itemList[i - 1])) {
                autoBuyItem(itemList[i], itemList[i - 1]);
            }
        }
    }
}

function autoBuyEligible(buyerItem, boughtItem) {
    // Checks if the player has the requisite upgrade for auto buying and has less than the max number of items.
    return (buyerItem.upgrade.upgradeCount >= 4 && boughtItem.itemData.itemCount < boughtItem.itemData.maxItems);
}

function autoBuyItem(buyerItem, boughtItem) {
    // When the amount of work is > 1 the floor of that number is the number of items bought.
    let autoBuyWork = autoBuyRate(buyerItem);
    boughtItem.autoBuy.autoBuyAmount += autoBuyWork;
    if (boughtItem.autoBuy.autoBuyAmount >= 1) {
        const itemsToBuy = Math.floor(boughtItem.autoBuy.autoBuyAmount);
        boughtItem.itemData.itemCount += itemsToBuy;
        boughtItem.autoBuy.autoBuyWork -= itemsToBuy;
    }
    if (boughtItem.itemData.itemCount > boughtItem.itemData.maxItems) {
        boughtItem.itemData.itemCount = boughtItem.itemData.maxItems;
    }
}

function autoBuyRate(buyerItem) {
    // Calculates the rate that item will autoBuy item-1
    return buyerItem.itemData.itemCount / (gameData.tickRate * 10);
}

function autoBuyUI() {
    // Updates autoBuyUI elements.
    for (let i = itemList.length - 1; i >= 0; i--) {
        // The first item cannot autoBuy the tier below as it is the first tier and there is nothing below it.
        if (i !== 0 && autoBuyEligible(itemList[i], itemList[i - 1])) {
            const buyerItem = itemList[i];
            const boughtItem = itemList[i - 1];
            const itemsPerSecond = buyerItem.itemData.itemCount / gameData.tickRate;
            if (itemsPerSecond === 0) {
                HTMLEditor(buyerItem.div.autoBuyRate, 0);
            }
            // Displays auto buys per second like 3.3
            else if (itemsPerSecond < 100) {
                HTMLEditor(buyerItem.div.autoBuyRate, itemsPerSecond.toFixed(1));
            }
            // Displays auto buys per second like 10 million.
            else {
                HTMLEditor(buyerItem.div.autoBuyRate, formatNumbers(itemsPerSecond));
            }
            // If items are not being auto bought, the rate is displayed as 0.
        }
    }
}

function itemsIncome() {
    // Calculates then adds income generated from items.
    gameData.incomePerSecond = 0; // The total income/sec of all items.
    for (let i = itemList.length - 1; i >= 0; i--) {
        const income = calculateIncome(itemList[i]);
        addData(income);
    }
}

function calculateIncome(item) {
    // Calculates how much income an item generates.
    let incomePerItemPerTick; // The amount that a single item will generate in 1 tick.
    let incomePerItemPerSecond; // The amount that a single item will generate in one second.
    let incomePerTypePerTick; // The amount that all items of a type will generate in a single tick.        
    let incomePerTypePerSecond; // The amount that all items of a type will generate in 1 second.

    // Using compound assignments with let is very inefficient.
    // e.g.
    // let foo = 5; foo = foo * 3;
    // Is much more cpu friendly than:
    // let foo = 5; foo *= 3;
    // I have not been able to find an explanation for this, only confirmation that it is true.  

    incomePerItemPerTick = item.itemData.baseIncome / gameData.tickRate; // Base rate.
    incomePerItemPerTick = incomePerItemPerTick * (Math.pow(2, item.upgrade.upgradeCount)); // With upgrades.
    incomePerItemPerTick = incomePerItemPerTick * (item.achievement.achCount + 1); // With achievements.

    incomePerItemPerSecond = incomePerItemPerTick * gameData.tickRate;
    incomePerTypePerTick = incomePerItemPerTick * item.itemData.itemCount;
    incomePerTypePerSecond = incomePerItemPerSecond * item.itemData.itemCount;

    item.itemData.incomeRateSingle = incomePerItemPerSecond;
    item.itemData.incomeRateTotal = incomePerTypePerSecond;

    gameData.incomePerSecond += incomePerTypePerSecond;

    return incomePerTypePerTick;
}

function itemsUI() {
    // Updates numbers for items.
    HTMLEditor('totalIncome', formatBytes(gameData.incomePerSecond));
    for (let i = itemList.length - 1; i >= 0; i--) {
        // Number of an item.
        HTMLEditor(itemList[i].div.itemCount, itemList[i].itemData.itemCount);
        // Income that one item generates.
        HTMLEditor(itemList[i].div.itemRate, formatBytes(itemList[i].itemData.incomeRateSingle));
        // Income that all items of a type generates.
        HTMLEditor(itemList[i].div.rateTotal, formatBytes(itemList[i].itemData.incomeRateTotal));
    }
}

function achievementsUnlock() {
    // Calculates what achievements are unlocked.
    for (let i = itemList.length - 1; i >= 0; i--) {
        // const originalAchCount = itemList[i].achievement.achCount;
        // Number of achievements = log10(itemCount)
        // 1st ach = 10
        // 2nd ach = 100
        // 3rd ach = 1000
        // etc.
        const itemCount = itemList[i].itemData.itemCount;
        // This is fast but gives some rounding errors after 53 bits.
        const digitLength = Math.ceil(Math.log(itemCount + 1) / Math.LN10); // Number of digits in the number of items.
        let achievementCount = 0;
        if (itemCount !== 0) {
            achievementCount = digitLength - 1;
        }
        if (achievementCount > gameData.maxAchievements) {
            achievementCount = gameData.maxAchievements;
        }
        checkForAchievementChange(achievementCount, itemList[i]);
        itemList[i].achievement.achCount = achievementCount;
    }
}

function checkForAchievementChange(achievementCount, item) {
    if (achievementCount !== item.achievement.achCount && !gameData.achievementTabSelected) {
        gameData.flashAchTab = true;
    }
}

function achievementsUI() {
    // Displays unlocked achievements.
    for (let i = itemList.length - 1; i >= 0; i--) {
        let achUnlockedCount = itemList[i].achievement.achCount; // The number of unlocked achievements.
        if (achUnlockedCount > gameData.maxAchievements) {
            achUnlockedCount = gameData.maxAchievements;
        }
        const achLockedCount = gameData.maxAchievements - achUnlockedCount; // The number of achievements yet to be unlocked.
        const achDisplay = makeAchDisplay(achUnlockedCount, achLockedCount);
        const achMultiDisplay = achUnlockedCount + 1; // How the m
        const achName = 'x' + achMultiDisplay + ' ' + itemList[i].info.name + 's';
        showAchievements(itemList[i], achDisplay, achName);
        // When the player unlocks all achievements for an item, the color of the symbols will change based on the theme. 
        if (achUnlockedCount === gameData.maxAchievements) {
            allItemAchUnlocked(itemList[i]);
        }
    }
    flashAchTab();
}

function makeAchDisplay(achUnlockedCount, achLockedCount) {
    const achUnlockedDisplay = '&Dagger;'.repeat(achUnlockedCount); // Creates a row of symbols to represent unlocked achievements.
    const achLockedDisplay = '_'.repeat(achLockedCount); // Creates a row of symbols to represent locked achievements.
    const achDisplay = achUnlockedDisplay + achLockedDisplay; // Will look like |||||----- changing based on unlock status.
    return achDisplay;
}

function showAchievements(item, achDisplay, achName) {
    HTMLEditor(item.div.achDisplay, achDisplay);
    HTMLEditor(item.div.achName, achName);
}

function allItemAchUnlocked(item) {
    document.getElementById(item.div.achDisplay).style.color = theme.colorTheme[theme.currentTheme].importantColor;
}

function flashAchTab() {
    if (gameData.flashAchTab === true && gameData.achievementTabSelected !== true) {
        document.getElementById('achTab').style.color = theme.colorTheme[theme.currentTheme].importantColor;
    }
}

function checkForReveal() {
    // Checks if any elements should be revealed.
    for (let i = itemList.length - 1; i >= 0; i--) {
        checkItemReveal(itemList[i]);
        checkUpgradeReveal(itemList[i]);
    }
}

function checkItemReveal(item) {
    // An Item is revealed when total data is greater than the cost of the item.
    if (gameData.totalDataHacked >= item.itemData.baseCost) {
        showItemTier(item);
    }


}

function showItemTier(item) {
    // Reveals the item, HR and achievement bar.
    visibilityChange(item.div.itemMenu, true);
    document.getElementById(item.div.itemFlex).style.display = 'flex';
    visibilityChange(item.div.HR, true);
    visibilityChange(item.div.achOuter, true);
}

function checkUpgradeReveal(item) {
    // An upgrade is revealed when total data is greater than the cost of the upgrade.
    gameData.totalDataHacked >= item.upgrade.nextUpgradeCost ? showUpgrade(item) : visibilityChange(item.div.upgradeMenu, false);

    function showUpgrade(item) {
        visibilityChange(item.div.upgradeMenu, true);
        changeUpgradeText(item);
    }
}

function checkForVictory() {
    let allAchievementsUnlocked = true;
    for (let i = itemList.length - 1; i >= 0; i--) {
        if (itemList[i].achievement.achCount !== gameData.maxAchievements) {
            allAchievementsUnlocked = false;
        }
    }
    if (allAchievementsUnlocked) {
        victory();
    }
}

function victory() {
    // Welcome to seizuretown.
    const allDOMElements = document.getElementsByTagName("*");
    for (let i = allDOMElements.length - 1; i >= 0; i--) {
        allDOMElements[i].style.color = randomColorBright();
    }
}

function randomColorBright() {
    // Returns a string with # and three letters from the letter array.
    // This will result in exclusively bright colors.
    const letters = ["A", "B", "C", "D", "E"];
    let color = '#';
    for (let i = 0; i < 3; i++) {
        // Due to the frequency in which this will be called, I am not using a compounding assignment.
        color = color + letters[Math.floor(Math.random() * letters.length)];
    }
        return color;
}

function save() {
    // Saves info to local storage.
    const savegame = obfuscateSave(makeSaveFile());
    saveToLocalStorage(savegame);
}

function makeSaveFile() {
    // Makes an object that we want to save.
    let savegame = {};
    savegame = saveMiscData(savegame);
    savegame = saveItemData(savegame);
    //savegame = savePrestige(savegame);
    return savegame;

    function saveMiscData(savegame) {
        // Saves data not part of itemList.
        savegame.dataHacked = gameData.dataHacked;
        savegame.totalDataHacked = gameData.totalDataHacked;
        savegame.currentTheme = theme.currentTheme;
        savegame.colorTheme = theme.colorTheme;
        return savegame;
    }
}

function saveItemData(savegame) {
    // Saves specific data from itemList.
    savegame.itemList = [];
    for (let i = itemList.length - 1; i >= 0; i--) {
        savegame.itemList[i] = {
            itemData: {
                itemCount: itemList[i].itemData.itemCount
            },
            upgrade: {
                nextUpgradeCost: itemList[i].upgrade.nextUpgradeCost,
                upgradeCount: itemList[i].upgrade.upgradeCount
            },
            achievement: {
                achCount: itemList[i].achievement.achCount
            },
            autoBuy: {
                autoBuyAmount: itemList[i].autoBuy.autoBuyAmount
            }
        };
    }
    return savegame;
}

function savePrestige(savegame) {
    savegame.prestige = {
        sentencesDisplayed: prestige.data.sentencesDisplayed
    };
    return savegame;
}

function obfuscateSave(savegame) {
    // Objects get weird if you save them as a local key, so it is converted to a string first.
    // Because there is a feature that imports/exports saves as string we want to have them unreadable to humans.
    const savegameString = JSON.stringify(savegame); // foo = JSON.stringify(foo) doesn't work, foo = JSON.stringify(bar) must be used instead.
    const obfuscatedSave = window.btoa(savegameString); // String is converted to base 64
    return obfuscatedSave;
}

function saveToLocalStorage(savegame) {
    localStorage.setItem(gameData.saveName, savegame); // Save is saved to local storage.
}

function load() {
    // Loads info from local storage.
    if (localStorage.getItem(gameData.saveName)) { // If save exists in local storage.
        const savegame = getSaveFromLocalStorage();
        loadDataFromSave(savegame);
        loadUIElements();
        applyColorTheme();
    }
}

function getSaveFromLocalStorage() {
    let savegame = localStorage.getItem(gameData.saveName);
    savegame = window.atob(savegame); // Deobfusaces save to string.
    savegame = JSON.parse(savegame); // Converts string to object.
    return savegame;
}

function loadDataFromSave(savegame) {
    loadMiscData(savegame);
    loadItemData(savegame);
    //loadPrestige(savegame);
}

function loadMiscData(savegame) {
    // Loads data not associated with itemList
    gameData.dataHacked = savegame.dataHacked;
    gameData.totalDataHacked = savegame.totalDataHacked;
    theme.currentTheme = savegame.currentTheme;
    theme.colorTheme = savegame.colorTheme;
}

function loadItemData(savegame) {
    //loads data into itemList
    for (let i = savegame.itemList.length - 1; i >= 0; i--) {
        itemList[i].itemData.itemCount = savegame.itemList[i].itemData.itemCount;
        itemList[i].upgrade.nextUpgradeCost = savegame.itemList[i].upgrade.nextUpgradeCost;
        itemList[i].upgrade.upgradeCount = savegame.itemList[i].upgrade.upgradeCount;
        itemList[i].achievement.achCount = savegame.itemList[i].achievement.achCount;
        itemList[i].autoBuy.autoBuyAmount = savegame.itemList[i].autoBuy.autoBuyAmount;
    }
}

function loadPrestige(savegame) {
    const sentences = savegame.prestige.sentencesDisplayed;
    for (let i = 0; i < sentences; i++) {
        displayCurrentSentence();
        prestige.data.sentencesDisplayed++;
    }
}

function loadUIElements() {
    for (let i = itemList.length - 1; i >= 0; i--) {
        changeUpgradeText(itemList[i]);
        updateItemMax(itemList[i]);
    }
}

function addData(number) {
    gameData.dataHacked += number;
    gameData.totalDataHacked += number;
}

function subtractData(number) {
    gameData.dataHacked -= number;
}

function HTMLEditor(elementID, input) {
    // changes the inner HTML of an element.
    // Mostly used to change text but can also insert other HTML stuff.
    document.getElementById(elementID).innerHTML = input;
}

function HTMLColorChange(elementID, color) {
    document.getElementById(elementID).style.color = color;
}

function visibilityChange(elementID, visibility = false) {
    // Either hides or shows an element depending on arguments.
    visibility = visibility ? 'visible' : 'hidden';
    document.getElementById(elementID).style.visibility = visibility;
}

function destroyFloats() {
    // Sets dataHacked to 1 decimal place.
    // Used to avoid float rounding errors.
    // Should be called whenever decimal changes are made to data.
    gameData.dataHacked = parseFloat(parseFloat(gameData.dataHacked).toFixed(1));
    gameData.totalDataHacked = parseFloat(parseFloat(gameData.totalDataHacked).toFixed(1));
}

function formatBytes(bytes) {
    // Converts a number of Bytes into a data format. E.g. 3000 bytes -> 3KB.
    bytes = Math.round(bytes);
    let dp = 2;
    if (bytes <= 999999999999999999999999999) { // 1000 YB = 1*10^27 Bytes, this is 1 less than that.
        if (bytes < 1000) {
            dp = 0;
        }
        if (bytes === 0) {
            return '0 Bytes';
        }
        if (bytes === 1) {
            return '1 Byte';
        }
        const dataSizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1000));
        let num = parseFloat((bytes / Math.pow(1000, i)).toFixed(dp));
        return num.toFixed(dp) + ' ' + dataSizes[i];
        //num = num + ' ' + dataSizes[i]; 
    } 
    else if (bytes === Infinity) {
        return "Max";
    }
    else {
        // If it is larger than the largest data format (9999 Yottabytes), shows scientific notation of Bytes instead.
        bytes = bytes.toExponential(0);
        bytes += ' Bytes';
        return bytes;
    }
}

function formatNumbers(number, dp = 0) {
        // Converts a number of number into a data format.
        // if it is less than 10000 it shows the normal number.
        // if it is greater than 10000 it shows the number name, e.g. 1.34 million.
        number = Math.round(number);
        if (number > 9999) {
            // One of these is spelled incorrectly, i'll give you a prize if you work out which one.
            const numberSizes = [
        'If you are reading this then you have found a bug! Please contact an exterminator.',
        'thousand',
        'million',
        'billion',
        'trillion',
        'quadrillion',
        'quintillion',
        'sextillion',
        'septillion',
        'octillion',
        'nonillion',
        'decillion',
        'undecillion',
        'duodecillion',
        'tredecillion',
        'quattuordecillion',
        'quindecillion',
        'sexdecillion',
        'septendecillion',
        'octodecillion',
        'novemdecillion',
        'vigintillion',
        'unvigintillion',
        'duovigintillion',
        'trevigintillion',
        'quattuorvigintillion',
        'quinvigintillion',
        'sexvigintillion',
        'septenvigintillion',
        'octovigintillion',
        'novemvigintillion',
        'trigintillion',
        'untrigintillion',
        'duotrigintillion',
        'tretrigintillion',
        'quattuortrigintillion',
        'quintrigintillion',
        'sextrigintillion',
        'septentrigintillion',
        'octotrigintillion',
        'novemtrigintillion',
        'quadragintillion',
        'unquadragintillion',
        'novemtrigintillion',
        'quadragintillion',
        'unquadragintillion',
        'duoquadragintillion',
        'trequadragintillion',
        'quattuorquadragintillion',
        'quinquadragintillion',
        'sexquadragintillion',
        'septenquadragintillion',
        'octoquadragintillion',
        'novemquadragintillion', // Now that is a sweet name for a number.
        'If you are reading this then you need to tell me to add more number sizes.'];
            const i = Math.floor(Math.log(number) / Math.log(1000));
            let num = parseFloat((number / Math.pow(1000, i)).toFixed(0));
            num = num.toFixed(dp);
            return num + ' ' + numberSizes[i];
        } else {
            return number; // If the number is smaller than 100k, it just displays it normally.
        }
    }
    /* DOM interactions */
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function colorDropDown() {
    // Changes UI colors based on selection from color picker.
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById('bodyColorPicker').jscolor.fromString(theme.colorTheme[theme.currentTheme].bodyColor);
    document.getElementById('clickColorPicker').jscolor.fromString(theme.colorTheme[theme.currentTheme].clickColor);
    document.getElementById('numberColorPicker').jscolor.fromString(theme.colorTheme[theme.currentTheme].importantColor);
}

function buyPrestige() {
    // Not currently in use.
    const cost = prestigeCost();
    if (gameData.dataHacked >= cost && sentencesRemain() && prestige.data.sentencesDisplayed < gameData.resetCount){
        gameData.dataHacked -= cost;
        displayCurrentSentence();
        prestige.data.sentencesDisplayed++;
    }
    else if (prestige.data.sentencesDisplayed >= gameData.resetCount) {
        showPrestigeTranscendence();
    }

    function sentencesRemain() {
        // If there are sentences left to display.
        return (prestige.data.sentencesDisplayed < prestige.display.message.length);
    }
}

function prestigeCost() {
    // Just me doing a bunch of random stuff to make big numbers.
    const sentence = prestige.data.sentencesDisplayed;
    const baseCost = itemList[10].itemData.baseCost;
    let cost = baseCost * Math.pow(100, sentence);
    cost *= Math.LN10; // Without Euler the numbers will be nice an neat.
    return Math.floor(cost);
}

function displayCurrentSentence() {
    // Not currently in use.
    prestige.data.rowsDisplayed = 0;
    const lastRowInSentence = prestige.display.message[prestige.data.sentencesDisplayed].length;
    for (let i = 0; i < lastRowInSentence; i++) {
        insertRow();
        insertBR();
        prestige.data.rowsDisplayed++;
    }

    function insertRow() {
        document.getElementById("prestigeArt").innerHTML += prestige.display.message[prestige.data.sentencesDisplayed][prestige.data.rowsDisplayed];
    }

    function insertBR() {
        document.getElementById("prestigeArt").innerHTML += "<br />";
    }
}

function showPrestigeTranscendence() {
    // Not currently in use.
    document.getElementById("prestigeRequirements").style.display = "block";
}

function exportSave() {
    // Puts the save in a prompt box
    save();
    let savegame = localStorage.getItem(gameData.saveName);
    window.prompt('Your save: ', savegame);
}

function importSave() {
    // Puts the given string in local storage.
    let save = prompt('Paste save here');
    localStorage.setItem(gameData.saveName, save);
    load();
    location.reload();
}

function newGame() {
    // Deletes the save then reloads the game.
    if (confirm('Are you sure you want to start a new game?')) { // Nobody likes misclicks.
        localStorage.removeItem(gameData.saveName);
        location.reload(false); // reload(true) forces reload from server, ignores cache, this is probably not necessary.
    }
}

function resetGame() {
    // Not currently in use.
    // Does a soft reset of stuff.
    resetProgress();
    resetVisibility();

    function resetProgress() {
        gameData.dataHacked = gameData.BIC;
        gameData.totalDataHacked = gameData.BIC;
        gameData.flashAchTab = false;
        gameData.resetCount ++;

        for (let i = itemList.length - 1; i >= 0; i--) {
            itemList[i].itemData.itemCount = 0;
            itemList[i].upgrade.nextUpgradeCost = itemList[i].upgrade.baseUpgradeCost;
            itemList[i].upgrade.upgradeCount = 0;
            itemList[i].achievement.achCount = 0;
            itemList[i].autoBuy.autoBuyAmount = 0;
        }
    }

    function resetVisibility() {
        document.getElementById('bodyAll').style.display = "none";
        document.getElementById("prestigeRequirements").style.display = "none";
        document.getElementById("achTab").style.color = theme.colorTheme[theme.currentTheme].clickColor;
        changeTab("itemTab");
        showGame();
    }
}

function changeTab(tabName) {
    // Get all elements with class="tabContent" and hide them.
    let tabContent;
    tabContent = document.getElementsByClassName("tabContent");
    for (let i = tabContent.length - 1; i >= 0; i--) {
        tabContent[i].style.display = "none";
    }
    // Show the current tab.
    document.getElementById(tabName).style.display = "block";
    if (tabName === "achievementTab") {
        document.getElementById("achTab").style.color = theme.colorTheme[theme.currentTheme].clickColor;
        gameData.achievementTabSelected = true;
        gameData.flashAchTab = false;
    } else {
        gameData.achievementTabSelected = false;
    }
}

function applyColorTheme() {
    theme.colorTheme[theme.currentTheme].changePresetColors();
}

function changeThemePreset() {
    // Cycles through themes.
    if (theme.currentTheme < theme.colorTheme.length - 1) {
        theme.currentTheme++;
    } else {
        theme.currentTheme = 0;
    }
    applyColorTheme();
}

function customTheme(color, elementType) {
    // Allows players to enter custom themes.
    // if (!colorTheme[5]) colorTheme[5] = JSON.parse(JSON.stringify(colorTheme[theme.currentTheme]));
    if (elementType === 0) {
        theme.colorTheme[theme.currentTheme].bodyColor = color.toHEXString();
    }
    if (elementType === 1) {
        theme.colorTheme[theme.currentTheme].clickColor = color.toHEXString();
    }
    if (elementType === 2) {
        theme.colorTheme[theme.currentTheme].importantColor = color.toHEXString();
    }
    // theme.currentTheme = 5; // Changes the selected theme to the custom one.
    applyColorTheme();
}

function buyItem(item, count) {
    // Attempts to buy a number of items.
    for (let i = 0; i < count; i++) { // Tries to by this many items.
        const cost = buyCost(item); // Calculates cost of item.
        // Player must be able to afford the item and have less than the max allowed items.
        if (gameData.dataHacked >= cost && item.itemData.itemCount < item.itemData.maxItems) {
            subtractData(cost); //Subtracts cost of item.
            item.itemData.itemCount++; // Increments item.
            buyItemUI(item);
        } else {
            //buyItemUI(item);
            break; // If the player cannot afford or has the max number of items, stop trying to buy items.
        }
    }
}

function buyItemUI(item) {
    // Updates the buy cost for an item in the UI.
    HTMLEditor(item.div.cost, formatBytes(buyCost(item)));
}

function buyCost(item) {
    // Calculates cost of an item based on the base cost of the item and the number of items.
    // Cost has an exponent of 1.15 (thanks CC).
    return Math.floor(item.itemData.baseCost * Math.pow(1.15, item.itemData.itemCount));
}

function buyUpgrade(item) {
    // Upgrades an item.
    if (gameData.dataHacked >= item.upgrade.nextUpgradeCost) { // Checks if player can afford upgrade.
        subtractData(item.upgrade.nextUpgradeCost); // Subtracts cost of upgrade.
        item.upgrade.upgradeCount++; // Increments upgrade counter.
        // Recalculates cost of next upgrade.
        item.upgrade.nextUpgradeCost = upgradeCost(item);
        changeUpgradeText(item);
        visibilityChange(item.div.upgradeMenu, false);
        checkForReveal();
        updateItemMax(item);
    }
}

function upgradeCost(item) {
    // Calculates cost of next upgrade.
    return Math.floor(item.upgrade.baseUpgradeCost * Math.pow(10, item.upgrade.upgradeCount));
}

function changeUpgradeText(item) {
    // Changes what is displayed as the upgrade name, description and upgraded cost.
    // item.upgradeText[item.let.upgradeCount][0=name | 1=Desc]
    let upgradeCount = item.upgrade.upgradeCount;
    if (upgradeCount > 4) {
        upgradeCount = 4; // The 4th upgrade is the default one that will appear over and over again.
    }
    showBaseText(item, upgradeCount);
    showDetailText(item, upgradeCount);
}

function showBaseText(item, upgradeCount) {
    const upgradeName = item.upgradeText[upgradeCount][0];
    const upgradeDesc = item.upgradeText[upgradeCount][1];
    HTMLEditor(item.div.upgradeCost, formatBytes(item.upgrade.nextUpgradeCost)); // Updates cost.
    HTMLEditor(item.div.upgradeName, upgradeName); // Updates name.
    HTMLEditor(item.div.upgradeDesc, upgradeDesc); // Updates desc.
}

function showDetailText(item, upgradeCount) {
    const doublingText = 'Doubles the income of each ' + item.info.name + '.'; // Every upgrade will display this.
    if (item !== itemList[0] && upgradeCount === 3) {
        const autoBuyingText = 'For every ' + item.info.name + ' you will generate 0.1 ' + itemList[item.info.ID - 1].info.name + 's.';
        HTMLEditor(item.div.upgradeDetails, doublingText + '<br>' + autoBuyingText);
    }
    else {
        HTMLEditor(item.div.upgradeDetails, doublingText);
    }
}

function updateItemMax(item) {
    // Calculates the maximum number of items based on upgrades
    // Number of upgrades = maximum items
    // 0 = 100
    // 1 = 100
    // 2 = 100
    // 3 = 1000
    // 4 = 10000
    // 5 = 100000
    // etc
    // How max items are calculated:     
    // n = the number of upgrades.
    // u = the upgrade where you want maxItem changes to kick in.           
    // max items = 100 * 10^(n-u)
    if (item.upgrade.upgradeCount >= 2) {
        item.itemData.maxItems = 100 * Math.pow(10, (item.upgrade.upgradeCount - 2));
    } else {
        item.itemData.maxItems = 100; // 100 is the default number of max items.
    }
    HTMLEditor(item.div.numberMax, item.itemData.maxItems);
}

//window.requestAnimationFrame(refreshGameTick); // Starts the first tick.
