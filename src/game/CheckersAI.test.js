import { CheckersGame } from './CheckersGame';
import { CheckersAI } from './CheckersAI';

describe('CheckersAI', () => {
  it('should prioritize multi-capture moves', () => {
    const game = new CheckersGame('brazilian');
    game.board = Array(8).fill(null).map(() => Array(8).fill(null));
    game.board[1][1] = { color: 'black', isKing: false };
    game.board[2][2] = { color: 'red', isKing: false };
    game.board[4][4] = { color: 'red', isKing: false };

    // Add a single capture move for another black piece
    game.board[5][1] = { color: 'black', isKing: false };
    game.board[4][2] = { color: 'red', isKing: false };


    game.currentPlayer = 'black';

    const ai = new CheckersAI('hard');
    const bestMove = ai.getBestMove(game, 'black');

    // The best move should be the start of the multi-capture sequence
    expect(bestMove.from.row).toBe(1);
    expect(bestMove.from.col).toBe(1);
    expect(bestMove.to.row).toBe(3);
    expect(bestMove.to.col).toBe(3);
  });
});
