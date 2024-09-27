// 8x8の盤面を表現する配列（0:空、1:黒、-1:白）
const board = Array(8).fill(null).map(() => Array(8).fill(0));

// 初期配置
board[3][3] = -1;  // 中央に白の石を配置
board[3][4] = 1;   // 中央に黒の石を配置
board[4][3] = 1;   // 中央に黒の石を配置
board[4][4] = -1;  // 中央に白の石を配置

let currentPlayer = 1;  // 黒が先手で開始
let gameOver = false;   // ゲームが終了していない状態

// ゲームボードを描画する関数
function drawBoard() {
    const boardElement = document.getElementById('board');  // HTML内の盤面要素を取得
    boardElement.innerHTML = '';  // 盤面をクリア
    for (let i = 0; i < 8; i++) {  // 8x8の盤面をループで描画
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');  // 1つのセル（マス）を作成
            cell.classList.add('cell');  // セルにクラスを付加
            if (board[i][j] === 1) {  // 黒の石の場合
                cell.classList.add('black');  // 黒の石をセルに描画
            } else if (board[i][j] === -1) {  // 白の石の場合
                cell.classList.add('white');  // 白の石をセルに描画
            }
            cell.addEventListener('click', () => makeMove(i, j));  // クリック時に石を置く処理
            boardElement.appendChild(cell);  // セルを盤面に追加
        }
    }
}

// 指定の位置に石を置く関数
function makeMove(row, col) {
    if (gameOver || board[row][col] !== 0) return; // すでに石が置かれているか、ゲーム終了なら何もしない

    if (isValidMove(row, col, currentPlayer)) {  // 有効な手かどうか確認
        board[row][col] = currentPlayer;  // 石を現在のプレイヤーの色で配置
        flipDiscs(row, col, currentPlayer);  // 挟んだ相手の石を反転
        currentPlayer = -currentPlayer;  // プレイヤー交代
        drawBoard();  // ボードを再描画

        // 勝敗判定を行う
        if (isGameOver()) {  // ゲームが終了しているか確認
            declareWinner();  // 勝者を表示
        } else if (!hasValidMove(currentPlayer)) {  // 次のプレイヤーに有効な手がない場合
            alert(currentPlayer === 1 ? "黒がパスします" : "白がパスします");  // パスの通知
            currentPlayer = -currentPlayer;  // パスして相手のターンへ
        }
    }
}

// 石を挟む有効な手かどうか確認する関数
function isValidMove(row, col, player) {
    const directions = [  // 8方向の確認に使用するベクトル
        [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];
    for (let [dx, dy] of directions) {  // 各方向を順に確認
        let x = row + dx;
        let y = col + dy;
        let hasOpponentBetween = false;  // 相手の石が間にあるかをチェック
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {  // 盤面外に出ない範囲でループ
            if (board[x][y] === -player) {  // 相手の石がある場合
                hasOpponentBetween = true;  // 相手の石が間にあることを確認
            } else if (board[x][y] === player && hasOpponentBetween) {  // 自分の石があり、相手の石を挟んだ場合
                return true;  // 有効な手と判定
            } else {
                break;  // 自分の石でも相手の石でもない場合は終了
            }
            x += dx;
            y += dy;
        }
    }
    return false;  // どの方向にも有効な手がない場合
}

// 挟んだ石を反転させる関数
function flipDiscs(row, col, player) {
    const directions = [  // 反転させる方向
        [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];
    for (let [dx, dy] of directions) {  // 各方向を順に確認
        let x = row + dx;
        let y = col + dy;
        let discsToFlip = [];  // 反転させる石を記録
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {  // 盤面内で確認
            if (board[x][y] === -player) {  // 相手の石がある場合
                discsToFlip.push([x, y]);  // 反転させる石として記録
            } else if (board[x][y] === player) {  // 自分の石があり、相手の石を挟んでいる場合
                discsToFlip.forEach(([flipX, flipY]) => {  // 記録された石を順に反転
                    board[flipX][flipY] = player;
                });
                break;  // 反転処理終了
            } else {
                break;  // 自分の石でも相手の石でもない場合は終了
            }
            x += dx;
            y += dy;
        }
    }
}

// 有効な手があるか確認する関数
function hasValidMove(player) {
    for (let i = 0; i < 8; i++) {  // 盤面の全セルを確認
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 0 && isValidMove(i, j, player)) {  // 空いているマスで有効な手があるか確認
                return true;  // 有効な手があればtrueを返す
            }
        }
    }
    return false;  // どこにも有効な手がない場合
}

// 勝敗判定を行う関数
function isGameOver() {
    return !hasValidMove(1) && !hasValidMove(-1);  // 黒と白どちらも有効な手がなければゲーム終了
}

// 勝者を表示する関数
function declareWinner() {
    let blackCount = 0;  // 黒の石の数をカウント
    let whiteCount = 0;  // 白の石の数をカウント
    for (let i = 0; i < 8; i++) {  // 盤面全体をループ
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 1) blackCount++;  // 黒の石を数える
            if (board[i][j] === -1) whiteCount++;  // 白の石を数える
        }
    }
    if (blackCount > whiteCount) {  // 黒が多ければ黒の勝ち
        alert("黒の勝ち！ 黒: " + blackCount + " 白: " + whiteCount);
    } else if (whiteCount > blackCount) {  // 白が多ければ白の勝ち
        alert("白の勝ち！ 黒: " + blackCount + " 白: " + whiteCount);
    } else {  // 石の数が同じ場合は引き分け
        alert("引き分け！ 黒: " + blackCount + " 白: " + whiteCount);
    }
    gameOver = true;  // ゲームを終了
}

// 初期化してゲーム開始
drawBoard();  // 初期状態でボードを描画
