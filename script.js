// ---変数宣言---
// HTML要素取得
const title = document.getElementById('title');
const easyButton = document.getElementById('easy-button');
const normalButton = document.getElementById('normal-button');
const hardButton = document.getElementById('hard-button');
const startResetButton = document.getElementById('start-reset-button');
const rotateLeftButton = document.getElementById('rotate-left-button');
const moveLeftButton = document.getElementById('move-left-button');
const moveRightButton = document.getElementById('move-right-button');
const rotateRightButton = document.getElementById('rotate-right-button');
const moveDownButton = document.getElementById('move-down-button');
const time = document.getElementById('time');
const score = document.getElementById('score');
const gameDisplay = document.getElementById('game-display');
const nextBlockDisplay = document.getElementById('next-block-display');
const gameOverText = document.getElementById('game-over');
const youWinText = document.getElementById('you-win');

const difficultyButtons = document.querySelectorAll('.difficulty-button');
const gameButtons = document.querySelectorAll('.game-button');
const buttons = document.querySelectorAll("button");

// js内変数
const blockArrayLnegth = 4;
const gameDisplayWidthLength = 10;
const gameDisplayHeightLength = 15;
const gameDisplayWidth = 200;
const gameDisplayHeight = gameDisplayWidth * gameDisplayHeightLength / gameDisplayWidthLength;
const nextBlockDisplayWidth = gameDisplayWidth * blockArrayLnegth / gameDisplayWidthLength;
const nextBlockDisplayHeight = nextBlockDisplayWidth;
const blockSize = gameDisplayWidth / gameDisplayWidthLength;
const difficultyPattern = [
    {
        difficulty: "easy",
        interval: 2
    },
    {
        difficulty: "normal",
        interval: 1
    },
    {
        difficulty: "hard",
        interval: 0.5
    }
];
let presentDifficulty;
let presentInterval;
let presentTimeSeconds;
let presentScore;
let isPlaying = true;
const defaultTopLeftNumInNextBlockDisplay = {top: 0, left: 0};
const blocksPattern = [
    // {
    //     shape: [
    //         [0, 1, 0, 0],
    //         [0, 1, 0, 0],
    //         [0, 1, 0, 0],
    //         [0, 1, 0, 0],
    //     ],
    //     color: "green",
    //     topLeftNum: defaultTopLeftNumInNextBlockDisplay
    // },
    {
        shape: [
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        color: "green",
        topLeftNum: defaultTopLeftNumInNextBlockDisplay
    },
    {
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        color: "red",
        topLeftNum: defaultTopLeftNumInNextBlockDisplay
    },
    {
        shape: [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        color: "orange",
        topLeftNum: defaultTopLeftNumInNextBlockDisplay
    },
    {
        shape: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        color: "blue",
        topLeftNum: defaultTopLeftNumInNextBlockDisplay
    },
    {
        shape: [
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        color: "cyan",
        topLeftNum: defaultTopLeftNumInNextBlockDisplay
    },
    {
        shape: [
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        color: "magenta",
        topLeftNum: defaultTopLeftNumInNextBlockDisplay
    }
];
let nextBlocksObject;
let fallingBlocksObject;
const defaultTopLeftNumInGameDisplay = {top: 0, left: 3};
let timeInterval;
let arrayOfblocksInGameDisplay = [];
const arrayRoomOfTop = 0;
const arrayRoomOfBottom = 4;
const arrayRoomofLeftAndRight = 3;
let fallenBlockObjects = [];
let numberOfFallenBlocks = 0;


// ---関数宣言---
const setDisplaySize = () => {
    gameDisplay.style.width = gameDisplayWidth.toString + "px";
    gameDisplay.style.height = gameDisplayHeight.toString + "px";
    nextBlockDisplay.style.width = nextBlockDisplayWidth.toString + "px";
    nextBlockDisplay.style.height = nextBlockDisplayHeight.toString + "px";
    return;
}

const updateDifficulty = (difficulty) => {
    presentDifficulty = difficulty;
    difficultyButtons.forEach(button => {
        if (button.getAttribute("id") === difficulty + "-button") {
            button.disabled = true;
            button.style.fontWeight = "bold";
            button.style.fontSize = "large";
            presentInterval = difficultyPattern.find(pattern => pattern.difficulty === difficulty).interval;
        } else {
            button.disabled = false;
            button.style.fontWeight = "normal";
            button.style.fontSize = "small";
        }
    });
}

const updateTimeText = () => {
    const minutes = Math.floor(presentTimeSeconds / 60);
    const seconds = Math.floor(presentTimeSeconds) % 60;
    const minutesText = minutes.toString().padStart(2, "0");
    const secondText = seconds.toString().padStart(2, "0");
    time.innerText = "Time: " + minutesText + ":" + secondText;
    return;
}

const updateScoreText = () => {
    const scoreText = presentScore.toString().padStart(3, "0");
    score.innerText = "Score:" + scoreText;
    return;
}

const updateGameInformationText = () => {
    updateTimeText();
    updateScoreText();
    return;
}

const resetGameInformation = () => {
    presentTimeSeconds = 0;
    presentScore = 0;
    updateGameInformationText();
    return;
}

const toggleDifficultyButtons = () => {
    if (isPlaying) {
        difficultyButtons.forEach(button => button.disabled = false);
    } else {
        difficultyButtons.forEach(button => button.disabled = true);
    }
    difficultyButtons.forEach(button => {
        const buttonId = button.getAttribute("id");
        if (buttonId === `${presentDifficulty}-button`) {
            button.disabled = true;
        } 
    });
    return;
}

const toggleGameButtons = () => {
    if (isPlaying) {
        startResetButton.innerText = "Start";
        gameButtons.forEach(button => button.disabled = true);
    } else {
        startResetButton.innerText = "Reset";
        gameButtons.forEach(button => button.disabled = false);
    }
    return;
}

const clearDisplay = () => {
    gameDisplay.innerHTML = "";
    nextBlockDisplay.innerHTML = "";
    return;
}

const resetArrayOfblocksInGameDisplay = () => {
    for (let i = 0; i < gameDisplayHeightLength + arrayRoomOfBottom; i++) {
        arrayOfblocksInGameDisplay[i] = [];
        for (let j = 0; j < gameDisplayWidthLength + arrayRoomofLeftAndRight * 2; j++) {
            arrayOfblocksInGameDisplay[i][j] = 0;
        }    
    }
    for (let i = 0; i < gameDisplayHeightLength; i++) {
        for (let j = 0; j < arrayRoomofLeftAndRight; j++) {
            arrayOfblocksInGameDisplay[i][j] = 1;
        }    
    }
    for (let i = 0; i < gameDisplayHeightLength; i++) {
        for (let j = gameDisplayWidthLength + arrayRoomofLeftAndRight
                ; j < gameDisplayWidthLength + arrayRoomofLeftAndRight * 2; j++) {
            arrayOfblocksInGameDisplay[i][j] = 1;
        }    
    }
    for (let i = gameDisplayHeightLength;
            i < gameDisplayHeightLength + arrayRoomOfBottom; i++) {
        for (let j = 0; j < gameDisplayWidthLength + arrayRoomofLeftAndRight * 2; j++) {
            arrayOfblocksInGameDisplay[i][j] = 1;
        }    
    }
    // let output;
    // for (let i = 0; i < gameDisplayHeightLength + arrayRoomOfBottom; i++) {
    //     output = "";
    //     for (let j = 0; j < gameDisplayWidthLength + arrayRoomofLeftAndRight * 2; j++) {
    //         output += arrayOfblocksInGameDisplay[i][j];
    //         output += ",";
    //     }
    //     console.log(output);    
    // }
    return;
}

const resetBlockObject = () => {
    nextBlocksObject = {};
    fallingBlocksObject = {};
    fallenBlockObjects.splice(0, fallenBlockObjects.length);
    return;
}

const resetGame = () => {
    clearInterval(timeInterval);
    gameOverText.style.visibility = "hidden";
    youWinText.style.visibility = "hidden";
    resetGameInformation();
    toggleDifficultyButtons();
    toggleGameButtons();
    clearDisplay();
    resetArrayOfblocksInGameDisplay();
    resetBlockObject();
    numberOfFallenBlocks = 0;
    return;
}

const addTOArrayOfblocksInGameDisplay = () => {
    const topNum = arrayRoomOfTop + fallingBlocksObject.topLeftNum.top;
    const leftNum = arrayRoomofLeftAndRight + fallingBlocksObject.topLeftNum.left;
    for (let i = 0; i < blockArrayLnegth; i++){
        for (let j = 0; j < blockArrayLnegth; j++){
            arrayOfblocksInGameDisplay[topNum + i][leftNum + j] 
                += fallingBlocksObject.shape[i][j];
        }
    }
    return;
}

const removeFromArrayOfblocksInGameDisplay = () => {
    const topNum = arrayRoomOfTop + fallingBlocksObject.topLeftNum.top;
    const leftNum = arrayRoomofLeftAndRight + fallingBlocksObject.topLeftNum.left;
    for (let i = 0; i < blockArrayLnegth; i++){
        for (let j = 0; j < blockArrayLnegth; j++){
            arrayOfblocksInGameDisplay[topNum + i][leftNum + j] 
            -= fallingBlocksObject.shape[i][j];
        }
    }
    return;
}

const topLeftCalculation = (topNum, leftNum, blocks, display) => {
    const topLeftPosition = {}; 
    if (display === nextBlockDisplay) {
        topLeftPosition.top = topNum * blockSize;
        topLeftPosition.left = leftNum * blockSize;
    } else {
        topLeftPosition.top = (topNum + blocks.topLeftNum.top) * blockSize;
        topLeftPosition.left = (leftNum + blocks.topLeftNum.left) * blockSize;
    }
    return topLeftPosition;
}

const putEachBlockOnDisplay = (topNum, leftNum, blocks, display) => {
    const topLeftPosition = topLeftCalculation(topNum, leftNum, blocks, display);
    // 対象のdisplayエレメントにblock要素を追加
    const displayType = display.getAttribute("id") === "next-block-display"
                        ? "next-block" : "falling-block";
    display.innerHTML += `<div class="block ${displayType}"></div>`;
    // 最後に追加されたblock要素のみを選択
    const blocks = document.querySelectorAll(`.${displayType}`);
    const eachBlock = blocks[blocks.length - 1];
    // blockのstyle設定
    eachBlock.style.width = blockSize.toString() + "px";
    eachBlock.style.height = blockSize.toString() + "px";
    eachBlock.style.top = topLeftPosition.top.toString() + "px";
    eachBlock.style.left = topLeftPosition.left.toString() + "px";
    eachBlock.style.backgroundColor = blocks.color;
    return;
}

const putBlocksOnDisplay = (blocks, display) => {
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (blocks.shape[i][j] === 1) {
                putEachBlockOnDisplay(i, j, blocks, display);
            }
        }    
    }
    return;
}

const generateNextBlocks = () => {
    nextBlockDisplay.innerHTML = "";
    nextBlocksObject = blocksPattern[Math.floor(Math.random() * blocksPattern.length)];
    putBlocksOnDisplay(nextBlocksObject, nextBlockDisplay);
    return;
}

const showGameOver = () => {
    const fallingBlocks = document.querySelectorAll(".falling-block");
    fallingBlocks.forEach(block => {
        block.style.zIndex = 1;
    });
    nextBlockDisplay.innerHTML = "";
    clearInterval(timeInterval);
    gameOverText.style.visibility = "visible";
    gameButtons.forEach(button => button.disabled = true);
    return;
}

const arrayHasTwo = () => {
    let hasTwo = false;
    for (let i = 0; i < gameDisplayHeightLength + arrayRoomOfBottom; i++) {
        for (let j = 0; j < gameDisplayWidthLength + arrayRoomofLeftAndRight * 2; j++) {
            if (arrayOfblocksInGameDisplay[i][j] == 2) {
                hasTwo = true;
            }
        }    
    }
    return hasTwo;
}

const convertNextBlocksToFallingBlocks = () => {
    fallingBlocksObject = nextBlocksObject;
    fallingBlocksObject.topLeftNum.top = defaultTopLeftNumInGameDisplay.top;
    fallingBlocksObject.topLeftNum.left = defaultTopLeftNumInGameDisplay.left;
    putBlocksOnDisplay(fallingBlocksObject, gameDisplay);
    addTOArrayOfblocksInGameDisplay();
    let isGameOver = arrayHasTwo();
    if (isGameOver) {
        showGameOver();
    }
    return isGameOver;
}

const updateArrayOfblocksInGameDisplayWithMoveDown = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlocksObject.topLeftNum.top += 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithMoveDown = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlocksObject.topLeftNum.top -= 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const updateArrayOfblocksInGameDisplayWithMoveLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlocksObject.topLeftNum.left -= 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithMoveLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlocksObject.topLeftNum.left += 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const updateArrayOfblocksInGameDisplayWithMoveRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlocksObject.topLeftNum.left += 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithMoveRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlocksObject.topLeftNum.left -= 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const rotateFallingBlocksShapeToLeft = () => {
    let tempShape = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (fallingBlocksObject.shape[i][j] === 1) {
                tempShape[3 - j][i] = 1;
            }
        }    
    }
    fallingBlocksObject.shape = tempShape;
    return;
}

const rotateFallingBlocksShapeToRight = () => {
    let tempShape = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (fallingBlocksObject.shape[i][j] === 1) {
                tempShape[j][3 - i] = 1;
            }
        }    
    }
    fallingBlocksObject.shape = tempShape;
    return;
}

const updateArrayOfblocksInGameDisplayWithRotateLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlocksShapeToLeft();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithRotateLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlocksShapeToRight();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const updateArrayOfblocksInGameDisplayWithRotateRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlocksShapeToRight();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithRotateRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlocksShapeToLeft();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const checkArrayOfblocksInGameDisplayAfterMoveDown = () => {
    updateArrayOfblocksInGameDisplayWithMoveDown();
    const hasTwo = arrayHasTwo();
    if (hasTwo) {
        downgradeArrayOfblocksInGameDisplayWithMoveDown();
    } 
    return !hasTwo;
}

const checkArrayOfblocksInGameDisplayAfterMoveLeft = () => {
    updateArrayOfblocksInGameDisplayWithMoveLeft();
    const hasTwo = arrayHasTwo();
    if (hasTwo) {
        downgradeArrayOfblocksInGameDisplayWithMoveLeft();
    } 
    return !hasTwo;
}

const checkArrayOfblocksInGameDisplayAfterMoveRight = () => {
    updateArrayOfblocksInGameDisplayWithMoveRight();
    const hasTwo = arrayHasTwo();
    if (hasTwo) {
        downgradeArrayOfblocksInGameDisplayWithMoveRight();
    } 
    return !hasTwo;
}

const checkArrayOfblocksInGameDisplayAfterRotateLeft = () => {
    updateArrayOfblocksInGameDisplayWithRotateLeft();
    const hasTwo = arrayHasTwo();
    if (hasTwo) {
        downgradeArrayOfblocksInGameDisplayWithRotateLeft();
    } 
    return !hasTwo;
}

const checkArrayOfblocksInGameDisplayAfterRotateRight = () => {
    updateArrayOfblocksInGameDisplayWithRotateRight();
    const hasTwo = arrayHasTwo();
    if (hasTwo) {
        downgradeArrayOfblocksInGameDisplayWithRotateRight();
    } 
    return !hasTwo;
}

const removeFallingBlocksFromDisplay = () => {
    const fallingBlocks = document.querySelectorAll(".falling-block");
    fallingBlocks.forEach(block => block.remove());
} 

const updateBlocksOnDisplay = () => {
    removeFallingBlocksFromDisplay();
    putBlocksOnDisplay(fallingBlocksObject, gameDisplay);
}

const moveDownFallingBlocks = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterMoveDown();
    if (canMoveOrRotate) {
        updateBlocksOnDisplay();
    }
    return canMoveOrRotate;
}

const convertEachFallingBlockTofallenBlock = (topNum, leftNum) => {
    // オブジェクト書き換え
    fallenBlockObjects.push({
        topNum: fallingBlocksObject.topLeftNum.top + topNum,
        leftNum: fallingBlocksObject.topLeftNum.left + leftNum,
        color: fallingBlocksObject.color,
        id: `fallen-block-${numberOfFallenBlocks}`
    });
    // HTML書き換え
    const fallingBlocks = document.querySelectorAll(".falling-block");
    const targetedBlock = fallingBlocks[0];
    targetedBlock.setAttribute("id", `fallen-block-${numberOfFallenBlocks}`);
    targetedBlock.classList.remove("falling-block");
    targetedBlock.classList.add("fallen-block");
    return;
}

const convertFallingBlocksTofallenBlocks = () => {
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (fallingBlocksObject.shape[i][j] === 1) {
                numberOfFallenBlocks += 1;
                convertEachFallingBlockTofallenBlock(i, j);
            }
        }    
    }
}

const delteteRowFromArray = (rowNum) => {
    for (let i = arrayRoomofLeftAndRight;
             i < arrayRoomofLeftAndRight + gameDisplayWidthLength; i++) {
        arrayOfblocksInGameDisplay[rowNum][i] = 0;
    }
    return;
}

const deleteRowFromDisplay = (rowNum) => {
    const fallenBlocksId = fallenBlockObjects
                            .filter(block => block.topNum === rowNum)
                            .map(block => block.id);
    const fallenBlockElements = document.querySelectorAll(".fallen-block");
    const deleteTargetedElements = Array.from(fallenBlockElements)
        .filter(element => fallenBlocksId.includes(element.getAttribute("id")));
    deleteTargetedElements.forEach(element => element.remove());
    return;
}

const deleteRowFromObject = (rowNum) => {
    fallenBlockObjects = fallenBlockObjects.filter(block => block.topNum !== rowNum);
    return;
}

const deleteRow = (rowNum) => {
    delteteRowFromArray(rowNum);
    deleteRowFromDisplay(rowNum);
    deleteRowFromObject(rowNum);
    return;
}

const moveFallenBlocksDownInArray = (rowNum) => {
    let k = rowNum;
    let sumOfRowKMinusOne = arrayOfblocksInGameDisplay[k - 1].reduce((acc, cur) => {
        return acc + cur;
    }, 0);
    while (sumOfRowKMinusOne > arrayRoomofLeftAndRight * 2) {
        for (let i = arrayRoomofLeftAndRight;
            i < arrayRoomofLeftAndRight + gameDisplayWidthLength; i++) {
                arrayOfblocksInGameDisplay[k][i] = arrayOfblocksInGameDisplay[k - 1][i]
                arrayOfblocksInGameDisplay[k - 1][i] = 0;
        }
        k --;
        sumOfRowKMinusOne = arrayOfblocksInGameDisplay[k - 1].reduce((acc, cur) => {
            return acc + cur;
        }, 0);
    }
    return;
}

const moveFallenBlocksDownInDisplay = (ids) => {
    const fallenBlockElements = document.querySelectorAll(".fallen-block");
    Array.from(fallenBlockElements)
        .filter(element => ids.includes(element.getAttribute("id")))
        .forEach(element => {
            const currentTop = window.getComputedStyle(element).top;
            const currentTopValue = parseInt(currentTop, 10);
            const newTopValue = currentTopValue + blockSize;
            element.style.top = newTopValue + "px";
            return;
        });
    return;
}

const moveFallenBlocksDownInObject = (rowNum) => {
    const ids = [];
    fallenBlockObjects.filter(block => block.topNum < rowNum).forEach(block => {
        block.topNum += 1;
        ids.push(block.id);
        return;
    });
    return ids;
}

const moveFallenBlocksDown = (rowNum) => {
    moveFallenBlocksDownInArray(rowNum);
    const idsOfMoveDownTargetedBlocks = moveFallenBlocksDownInObject(rowNum);
    moveFallenBlocksDownInDisplay(idsOfMoveDownTargetedBlocks);
    return;
}

const showYouWin = () => {
    nextBlockDisplay.innerHTML = "";
    clearInterval(timeInterval);
    youWinText.style.visibility = "visible";
    gameButtons.forEach(button => button.disabled = true);
    return;
}

const deleteRowAndMoveFallenBlocksDown = (rowNum) => {
    deleteRow(rowNum); 
    moveFallenBlocksDown(rowNum);
    presentScore += 1;
    if (presentScore === 1000) {
        showYouWin();
    } else {
        updateScoreText();   
    }
    return;
}

const deleteFallenBlocks = () => {
    let k = gameDisplayHeightLength - 1;
    let sumOfRowK = arrayOfblocksInGameDisplay[k].reduce((acc, cur) => {
        return acc + cur;
    }, 0);
    while (sumOfRowK > arrayRoomofLeftAndRight * 2) {
        if (sumOfRowK === gameDisplayWidthLength + arrayRoomofLeftAndRight * 2) {
            deleteRowAndMoveFallenBlocksDown(k);
            k ++;
        }
        k --;
        sumOfRowK = arrayOfblocksInGameDisplay[k].reduce((acc, cur) => {
            return acc + cur;
        }, 0);
    }
}

const updateTimer = () => {
    const blockMovedDown = moveDownFallingBlocks();
    if (!blockMovedDown) {
        convertFallingBlocksTofallenBlocks();
        deleteFallenBlocks();
        const canPutFallingBlock = !convertNextBlocksToFallingBlocks();
        if (canPutFallingBlock) {
            generateNextBlocks();
        }
    }
    presentTimeSeconds += difficultyPattern.find(pattern => pattern.difficulty === presentDifficulty).interval;
    updateTimeText();
    return;
}

const startGame = () => {
    toggleDifficultyButtons();
    toggleGameButtons();
    generateNextBlocks();
    convertNextBlocksToFallingBlocks();
    generateNextBlocks();
    timeInterval = setInterval(updateTimer, presentInterval * 1000);
    return;
}

const startOrResetGame = () => {
    if (isPlaying) {
        resetGame();
    } else {
        startGame();
    }
    isPlaying = !isPlaying;
    return;
}

const updateButtonCursors = () => {
    buttons.forEach(button => {
        if (button.disabled) {
            button.style.cursor = 'arrow';
        } else {
            button.style.cursor = 'pointer';
        }
    });
    return;
}

const moveFallingBlocksToLeft = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterMoveLeft();
    if (canMoveOrRotate) {
        updateBlocksOnDisplay();
    }
    return;
}

const moveFallingBlocksToRight = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterMoveRight();
    if (canMoveOrRotate) {
        updateBlocksOnDisplay();
    }
    return;
}

const rotateFallingBlocksToLeft = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterRotateLeft();
    if (canMoveOrRotate) {
        updateBlocksOnDisplay();
    }
    return;
}

const rotateFallingBlocksToRight = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterRotateRight();
    if (canMoveOrRotate) {
        updateBlocksOnDisplay();
    }
    return;
}

const moveFallingBlocksDownCompletely = () => {
    let blockMovedDown = true;
    while (blockMovedDown) {
        blockMovedDown = moveDownFallingBlocks();
    }
}

// ---ロード時処理---
document.addEventListener("DOMContentLoaded", () => {
    setDisplaySize();
    updateDifficulty("normal");
    resetGame();
    updateButtonCursors();
    isPlaying = !isPlaying;
    return;
});

// ---ボタンイベント---
startResetButton.addEventListener("click", startOrResetGame);

easyButton.addEventListener("click", () => updateDifficulty("easy"));
normalButton.addEventListener("click", () => updateDifficulty("normal"));
hardButton.addEventListener("click", () => updateDifficulty("hard"));

moveLeftButton.addEventListener("click", moveFallingBlocksToLeft);
moveRightButton.addEventListener("click", moveFallingBlocksToRight);
rotateLeftButton.addEventListener("click", rotateFallingBlocksToLeft);
rotateRightButton.addEventListener("click", rotateFallingBlocksToRight);
moveDownButton.addEventListener("click", moveFallingBlocksDownCompletely);

// ---ロードイベント---
const observer = new MutationObserver(updateButtonCursors);

buttons.forEach(button => {
    observer.observe(button, { attributes: true, attributeFilter: ['disabled'] });
});


