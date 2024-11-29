// Learn more at developers.reddit.com/docs
import { Devvit } from "@devvit/public-api";

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
		(acc, square, index) => (square === null ? [...acc, index] : acc),
		[],
	);

	return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};

Devvit.addCustomPostType({
	name: "Tic Tac Toe",
	render: (context) => {
		const [board, setBoard] = context.useState<Square[]>(() =>
			Array(9).fill(null),
		);
		const [gameStatus, setGameStatus] = context.useState("Your turn");
		const [gameOver, setGameOver] = context.useState(false);

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
				<vstack padding="medium" gap="medium" alignment="middle center">
					<text size="large">{gameStatus}</text>
					{[0, 1, 2].map((row) => (
						<hstack key={row} gap="large">
							{[0, 1, 2].map((col) => {
								const index = row * 3 + col;
								return (
									<button
										key={index}
										onPress={() => handleSquarePress(index)}
										disabled={board[index] !== null || gameOver}
                    size="large"
										style={{
											backgroundColor: board[index] === "X" ? "#FF4136" : board[index] === "O" ? "#0074D9" : "#FFFFFF",
											color: board[index] ? "#FFFFFF" : "#000000",
											fontSize: "24px",
											fontWeight: "bold",
										}}
									>
										{board[index] || " "}
									</button>
								);
							})}
						</hstack>
					))}
					{gameOver && (
						<button appearance="primary" onPress={resetGame}>
							Play Again
						</button>
					)}
				</vstack>
			</blocks>
		);
	},
});

Devvit.configure({
	redditAPI: true,
});

Devvit.addMenuItem({
	label: "Add my post",
	location: "subreddit",
	forUserType: "moderator",
	onPress: async (_event, context) => {
		const { reddit, ui } = context;
		const subreddit = await reddit.getCurrentSubreddit();
		await reddit.submitPost({
			title: "Tic Tac Toe",
			subredditName: subreddit.name,
			preview: (
				<vstack height="100%" width="100%" alignment="middle center">
					<text size="large">Loading ...</text>
				</vstack>
			),
		});
		ui.showToast({ text: "Created post!" });
	},
});

export default Devvit;
