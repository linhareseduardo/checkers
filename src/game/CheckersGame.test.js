import { CheckersGame } from './CheckersGame';

describe('CheckersGame', () => {
  it('should enforce mandatory multi-capture', () => {
    const game = new CheckersGame('brazilian');
    game.board = Array(8).fill(null).map(() => Array(8).fill(null));
    game.board[2][2] = { color: 'red', isKing: false };
    game.board[3][3] = { color: 'black', isKing: false };
    game.board[5][5] = { color: 'black', isKing: false };
    game.currentPlayer = 'red';

    game.selectPiece(2, 2);
    const result = game.movePiece(4, 4);

    expect(result.continueCapture).toBe(true);
    expect(game.selectedPiece.row).toBe(4);
    expect(game.selectedPiece.col).toBe(4);
    expect(game.validMoves.length).toBe(1);
    expect(game.validMoves[0].row).toBe(6);
  });
});
