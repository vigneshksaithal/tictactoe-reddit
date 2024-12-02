import { type Context, Devvit } from "@devvit/public-api";
import { useState } from "@devvit/public-api";

type Square = string | null;

const calculateWinner = (squares: Square[]): Square => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return squares.every(Boolean) ? "Draw" : null;
};

const computerMove = (board: Square[]): number => {
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            const testBoard = [...board];
            testBoard[i] = "O";
            if (calculateWinner(testBoard) === "O") return i;
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            const testBoard = [...board];
            testBoard[i] = "X";
            if (calculateWinner(testBoard) === "X") return i;
        }
    }

    if (!board[4]) return 4;

    const emptySquares = board.reduce<number[]>(
        (acc, square, index) => {
            if (square === null) {
                acc.push(index);
            }
            return acc;
        },
        [],
    );

    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};

export const TicTacToe = (context: Context) => {
    const [board, setBoard] = useState<Square[]>(() =>
        Array(9).fill(null),
    );
    const [gameStatus, setGameStatus] = useState("Your turn");
    const [gameOver, setGameOver] = useState(false);

    const handleSquarePress = (index: number) => {
        if (gameOver || board[index] !== null) return;

        const newBoard = [...board];
        newBoard[index] = "X";
        setBoard(newBoard);

        const result = calculateWinner(newBoard);
        if (result === "X" || result === "Draw") {
            setGameStatus(result === "X" ? "You won!" : "Draw!");
            setGameOver(true);
            return;
        }

        const computerMoveIndex = computerMove(newBoard);
        newBoard[computerMoveIndex] = "O";
        setBoard(newBoard);

        const computerResult = calculateWinner(newBoard);
        if (computerResult === "O" || computerResult === "Draw") {
            setGameStatus(computerResult === "O" ? "You lost!" : "Draw!");
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setGameStatus("Your turn");
        setGameOver(false);
    };

    return (
        <blocks height="regular">
            <vstack padding="medium" alignment="middle center" gap="medium">
                <text size="large">{gameStatus}</text>
                {[0, 1, 2].map((row) => (
                    <hstack key={row.toString()} gap="large">
                        {[0, 1, 2].map((col) => {
                            const index = row * 3 + col;
                            return (
                                // biome-ignore lint/a11y/useButtonType: <explanation>
<button
                                    key={index.toString()}
                                    onPress={() => handleSquarePress(index)}
                                    disabled={board[index] !== null || gameOver}
                                    size="large"
                                    appearance="secondary"
                                >
                                    {board[index] || ""}
                                </button>
                            );
                        })}
                    </hstack>
                ))}
                {gameOver && (
                    // biome-ignore lint/a11y/useButtonType: <explanation>
<button appearance="primary" onPress={resetGame}>
                        Play Again
                    </button>
                )}
            </vstack>
        </blocks>
    );
};
