// 8x8の盤面を表現する配列（0:空、1:黒、-1:白）
const board = Array(8).fill(null).map(() => Array(8).fill(0));

// 初期配置
board[3][3] = -1;
board[3][4] = 1;
board[4][3] = 1;
board[4][4] = -1;

let currentPlayer = 1;  // 黒が先手
let gameOver = false;

// ゲームボードを描画する関数
function drawBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';  // クリア
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] === 1) {
                cell.classList.add('black');
            } else if (board[i][j] === -1) {
                cell.classList.add('white');
            }
            cell.addEventListener('click', () => makeMove(i, j));
            boardElement.appendChild(cell);
        }
    }
}

// 指定の位置に石を置く関数
function makeMove(row, col) {
    if (gameOver || board[row][col] !== 0) return; // すでに置かれているかゲーム終了なら無視

    if (isValidMove(row, col, currentPlayer)) {
        board[row][col] = currentPlayer;  // 石を置く
        flipDiscs(row, col, currentPlayer);  // 相手の石を反転
        currentPlayer = -currentPlayer;  // プレイヤーを交代
        drawBoard();

        // 勝敗判定を行う
        if (isGameOver()) {
            declareWinner();
        } else if (!hasValidMove(currentPlayer)) {
            alert(currentPlayer === 1 ? "黒がパスします" : "白がパスします");
            currentPlayer = -currentPlayer;  // パスして相手のターン
        }

        // AI（白）のターン
        if (currentPlayer === -1 && !gameOver) {
            setTimeout(() => aiMove(), 1000);  // 1秒後にAIが動く
        }
    }
}

// 石を挟む有効な手かどうか確認する関数
function isValidMove(row, col, player) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];
    for (let [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let hasOpponentBetween = false;
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (board[x][y] === -player) {
                hasOpponentBetween = true;  // 相手の石がある場合
            } else if (board[x][y] === player && hasOpponentBetween) {
                return true;  // 挟んだ状態なら有効な手
            } else {
                break;
            }
            x += dx;
            y += dy;
        }
    }
    return false;
}

// 挟んだ石を反転させる関数
function flipDiscs(row, col, player) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];
    for (let [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let discsToFlip = [];
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (board[x][y] === -player) {
                discsToFlip.push([x, y]);  // 相手の石を記録
            } else if (board[x][y] === player) {
                discsToFlip.forEach(([flipX, flipY]) => {
                    board[flipX][flipY] = player;  // 石を反転
                });
                break;
            } else {
                break;
            }
            x += dx;
            y += dy;
        }
    }
}

// 有効な手があるか確認する関数
function hasValidMove(player) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 0 && isValidMove(i, j, player)) {
                return true;
            }
        }
    }
    return false;
}

// 勝敗判定を行う関数
function isGameOver() {
    return !hasValidMove(1) && !hasValidMove(-1);
}

// 勝者を表示する関数
function declareWinner() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 1) blackCount++;
            if (board[i][j] === -1) whiteCount++;
        }
    }
    if (blackCount > whiteCount) {
        alert("黒の勝ち！ 黒: " + blackCount + " 白: " + whiteCount);
    } else if (whiteCount > blackCount) {
        alert("白の勝ち！ 黒: " + blackCount + " 白: " + whiteCount);
    } else {
        alert("引き分け！ 黒: " + blackCount + " 白: " + whiteCount);
    }
    gameOver = true;
}

// AIのターン
function aiMove() {
    const validMoves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 0 && isValidMove(i, j, -1)) {
                validMoves.push([i, j]);
            }
        }
    }
    if (validMoves.length > 0) {
        const [row, col] = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(row, col);
    }
}

// 初期化してゲーム開始
drawBoard();
