// ---変数宣言---
// HTML要素取得
const titleElement = document.getElementById('title');
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
const blockPattern = [
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
let nextBlock;
let fallingBlock;
const defaultTopLeftNumInGameDisplay = {top: 0, left: 3};
let timeInterval;
let arrayOfblocksInGameDisplay = [];
const arrayRoomOfTop = 0;
const arrayRoomOfBottom = 4;
const arrayRoomofLeftAndRight = 3;
let fallenBlocks = [];
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
    nextBlock = {};
    fallingBlock = {};
    fallenBlocks.splice(0, fallenBlocks.length);
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
    const topNum = arrayRoomOfTop + fallingBlock.topLeftNum.top;
    const leftNum = arrayRoomofLeftAndRight + fallingBlock.topLeftNum.left;
    for (let i = 0; i < blockArrayLnegth; i++){
        for (let j = 0; j < blockArrayLnegth; j++){
            arrayOfblocksInGameDisplay[topNum + i][leftNum + j] 
                += fallingBlock.shape[i][j];
        }
    }
    return;
}

const removeFromArrayOfblocksInGameDisplay = () => {
    const topNum = arrayRoomOfTop + fallingBlock.topLeftNum.top;
    const leftNum = arrayRoomofLeftAndRight + fallingBlock.topLeftNum.left;
    for (let i = 0; i < blockArrayLnegth; i++){
        for (let j = 0; j < blockArrayLnegth; j++){
            arrayOfblocksInGameDisplay[topNum + i][leftNum + j] 
            -= fallingBlock.shape[i][j];
        }
    }
    return;
}

const topLeftCalculation = (topNum, leftNum, block, display) => {
    const topLeftPosition = {}; 
    if (display === nextBlockDisplay) {
        topLeftPosition.top = topNum * blockSize;
        topLeftPosition.left = leftNum * blockSize;
    } else {
        topLeftPosition.top = (topNum + block.topLeftNum.top) * blockSize;
        topLeftPosition.left = (leftNum + block.topLeftNum.left) * blockSize;
    }
    return topLeftPosition;
}

const putEachBlockOnDisplay = (topNum, leftNum, block, display) => {
    const topLeftPosition = topLeftCalculation(topNum, leftNum, block, display);
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
    eachBlock.style.backgroundColor = block.color;
    return;
}

const putBlockOnDisplay = (block, display) => {
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (block.shape[i][j] === 1) {
                putEachBlockOnDisplay(i, j, block, display);
            }
        }    
    }
    return;
}

const generateNextBlock = () => {
    nextBlockDisplay.innerHTML = "";
    nextBlock = blockPattern[Math.floor(Math.random() * blockPattern.length)];
    putBlockOnDisplay(nextBlock, nextBlockDisplay);
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

const convertNextBlockToFallingBlock = () => {
    fallingBlock = nextBlock;
    fallingBlock.topLeftNum.top = defaultTopLeftNumInGameDisplay.top;
    fallingBlock.topLeftNum.left = defaultTopLeftNumInGameDisplay.left;
    putBlockOnDisplay(fallingBlock, gameDisplay);
    addTOArrayOfblocksInGameDisplay();
    let isGameOver = arrayHasTwo();
    if (isGameOver) {
        showGameOver();
    }
    return isGameOver;
}

const updateArrayOfblocksInGameDisplayWithMoveDown = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlock.topLeftNum.top += 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithMoveDown = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlock.topLeftNum.top -= 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const updateArrayOfblocksInGameDisplayWithMoveLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlock.topLeftNum.left -= 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithMoveLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlock.topLeftNum.left += 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const updateArrayOfblocksInGameDisplayWithMoveRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlock.topLeftNum.left += 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithMoveRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    fallingBlock.topLeftNum.left -= 1;
    addTOArrayOfblocksInGameDisplay();
    return;
}

const rotateFallingBlockShapeToLeft = () => {
    let tempShape = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (fallingBlock.shape[i][j] === 1) {
                tempShape[3 - j][i] = 1;
            }
        }    
    }
    fallingBlock.shape = tempShape;
    return;
}

const rotateFallingBlockShapeToRight = () => {
    let tempShape = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (fallingBlock.shape[i][j] === 1) {
                tempShape[j][3 - i] = 1;
            }
        }    
    }
    fallingBlock.shape = tempShape;
    return;
}

const updateArrayOfblocksInGameDisplayWithRotateLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlockShapeToLeft();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithRotateLeft = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlockShapeToRight();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const updateArrayOfblocksInGameDisplayWithRotateRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlockShapeToRight();
    addTOArrayOfblocksInGameDisplay();
    return;
}

const downgradeArrayOfblocksInGameDisplayWithRotateRight = () => {
    removeFromArrayOfblocksInGameDisplay();
    rotateFallingBlockShapeToLeft();
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

const removeFallingBlockFromDisplay = () => {
    const fallingBlocks = document.querySelectorAll(".falling-block");
    fallingBlocks.forEach(block => block.remove());
} 

const updateBlockOnDisplay = () => {
    removeFallingBlockFromDisplay();
    putBlockOnDisplay(fallingBlock, gameDisplay);
}

const moveDownFallingBlock = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterMoveDown();
    if (canMoveOrRotate) {
        updateBlockOnDisplay();
    }
    return canMoveOrRotate;
}

const convertEachFallingBlockTofallenBlock = (topNum, leftNum) => {
    // オブジェクト書き換え
    fallenBlocks.push({
        topNum: fallingBlock.topLeftNum.top + topNum,
        leftNum: fallingBlock.topLeftNum.left + leftNum,
        color: fallingBlock.color,
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

const convertFallingBlockTofallenBlock = () => {
    for (let i = 0; i < blockArrayLnegth; i++) {
        for (let j = 0; j < blockArrayLnegth; j++) {
            if (fallingBlock.shape[i][j] === 1) {
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
    const fallenBlocksId = fallenBlocks
                            .filter(block => block.topNum === rowNum)
                            .map(block => block.id);
    const fallenBlockElements = document.querySelectorAll(".fallen-block");
    const deleteTargetedElements = Array.from(fallenBlockElements)
        .filter(element => fallenBlocksId.includes(element.getAttribute("id")));
    deleteTargetedElements.forEach(element => element.remove());
    return;
}

const deleteRowFromObject = (rowNum) => {
    fallenBlocks = fallenBlocks.filter(block => block.topNum !== rowNum);
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
    fallenBlocks.filter(block => block.topNum < rowNum).forEach(block => {
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

const sumOfRow = (rowNum) => {
    return arrayOfblocksInGameDisplay[rowNum].reduce((acc, cur) => {
        return acc + cur;
    }, 0);
}

const deleteFallenBlocks = () => {
    let k = gameDisplayHeightLength - 1;
    while (sumOfRow(k) > arrayRoomofLeftAndRight * 2) {
    // while (k >= 0) {
        if (sumOfRow(k) === gameDisplayWidthLength + arrayRoomofLeftAndRight * 2) {
            deleteRowAndMoveFallenBlocksDown(k);
            k ++;
        }
        k --;
    }
}

const updateTimer = () => {
    const blockMovedDown = moveDownFallingBlock();
    if (!blockMovedDown) {
        convertFallingBlockTofallenBlock();
        deleteFallenBlocks();
        const canPutFallingBlock = !convertNextBlockToFallingBlock();
        if (canPutFallingBlock) {
            generateNextBlock();
        }
    }
    presentTimeSeconds += difficultyPattern.find(pattern => pattern.difficulty === presentDifficulty).interval;
    updateTimeText();
    return;
}

const startGame = () => {
    toggleDifficultyButtons();
    toggleGameButtons();
    generateNextBlock();
    convertNextBlockToFallingBlock();
    generateNextBlock();
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

const moveFallingBlockToLeft = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterMoveLeft();
    if (canMoveOrRotate) {
        updateBlockOnDisplay();
    }
    return;
}

const moveFallingBlockToRight = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterMoveRight();
    if (canMoveOrRotate) {
        updateBlockOnDisplay();
    }
    return;
}

const rotateFallingBlockToLeft = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterRotateLeft();
    if (canMoveOrRotate) {
        updateBlockOnDisplay();
    }
    return;
}

const rotateFallingBlockToRight = () => {
    const canMoveOrRotate = checkArrayOfblocksInGameDisplayAfterRotateRight();
    if (canMoveOrRotate) {
        updateBlockOnDisplay();
    }
    return;
}

const moveFallingBlockDownCompletely = () => {
    let blockMovedDown = true;
    while (blockMovedDown) {
        blockMovedDown = moveDownFallingBlock();
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

moveLeftButton.addEventListener("click", moveFallingBlockToLeft);
moveRightButton.addEventListener("click", moveFallingBlockToRight);
rotateLeftButton.addEventListener("click", rotateFallingBlockToLeft);
rotateRightButton.addEventListener("click", rotateFallingBlockToRight);
moveDownButton.addEventListener("click", moveFallingBlockDownCompletely);

// ---ロードイベント---
const observer = new MutationObserver(updateButtonCursors);

buttons.forEach(button => {
    observer.observe(button, { attributes: true, attributeFilter: ['disabled'] });
});


