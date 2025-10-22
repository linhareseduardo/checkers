// Lógica do jogo de damas
export class CheckersGame {
  constructor(ruleType = 'brazilian') {
    this.ruleType = ruleType; // 'american', 'brazilian', 'international'
    this.boardSize = ruleType === 'international' ? 10 : 8;
    this.board = this.initializeBoard();
    this.currentPlayer = 'red'; // red começa
    this.selectedPiece = null;
    this.validMoves = [];
    this.mandatoryCaptures = [];
  }

  initializeBoard() {
    const size = this.boardSize;
    const board = Array(size).fill(null).map(() => Array(size).fill(null));
    
    const setupRows = this.ruleType === 'international' ? 4 : 3;
    
    // Peças pretas (nas primeiras linhas)
    for (let row = 0; row < setupRows; row++) {
      for (let col = 0; col < size; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { color: 'black', isKing: false };
        }
      }
    }
    
    // Peças vermelhas (nas últimas linhas)
    for (let row = size - setupRows; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { color: 'red', isKing: false };
        }
      }
    }
    
    return board;
  }

  getPiece(row, col) {
    if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) return null;
    return this.board[row][col];
  }

  isValidSquare(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }

  getAllPossibleCaptures(color) {
    const captures = [];
    
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const piece = this.getPiece(row, col);
        if (piece && piece.color === color) {
          const pieceMoves = this.getValidMoves(row, col, true);
          if (pieceMoves.length > 0) {
            captures.push({ row, col, moves: pieceMoves });
          }
        }
      }
    }
    
    // Para regras brasileiras e internacionais, deve capturar o máximo de peças
    if (this.ruleType === 'brazilian' || this.ruleType === 'international') {
      return this.filterMaxCaptures(captures);
    }
    
    return captures;
  }

  filterMaxCaptures(captures) {
    if (captures.length === 0) return captures;
    
    // Encontra o número máximo de capturas possíveis
    let maxCaptures = 0;
    for (const capture of captures) {
      for (const move of capture.moves) {
        if (move.isCapture) {
          const captureCount = move.capturedPieces ? move.capturedPieces.length : 1;
          maxCaptures = Math.max(maxCaptures, captureCount);
        }
      }
    }
    
    // Filtra apenas as capturas que capturam o máximo de peças
    const filteredCaptures = [];
    for (const capture of captures) {
      const maxMoves = capture.moves.filter(move => {
        if (!move.isCapture) return false;
        const captureCount = move.capturedPieces ? move.capturedPieces.length : 1;
        return captureCount === maxCaptures;
      });
      
      if (maxMoves.length > 0) {
        filteredCaptures.push({ ...capture, moves: maxMoves });
      }
    }
    
    return filteredCaptures;
  }

  getValidMoves(row, col, onlyCaptures = false) {
    const piece = this.getPiece(row, col);
    if (!piece) return [];

    const moves = [];
    const isLongMove = (this.ruleType === 'brazilian' || this.ruleType === 'international') && piece.isKing;
    
    // Para capturas, peças normais podem capturar em todas direções (BR e INT)
    const directions = onlyCaptures ? this.getDirections(piece, true) : this.getDirections(piece, false);

    for (const [dRow, dCol] of directions) {
      if (isLongMove) {
        // Movimentos longos para damas (Brazilian e International)
        this.getLongMoves(row, col, dRow, dCol, piece, moves, onlyCaptures);
      } else {
        // Movimentos curtos (American ou peças normais)
        this.getShortMoves(row, col, dRow, dCol, piece, moves, onlyCaptures);
      }
    }

    return moves;
  }

  getShortMoves(row, col, dRow, dCol, piece, moves, onlyCaptures) {
    // Movimento simples
    if (!onlyCaptures) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (this.isValidSquare(newRow, newCol) && !this.getPiece(newRow, newCol)) {
        moves.push({ row: newRow, col: newCol, isCapture: false });
      }
    }

    // Captura curta
    const jumpRow = row + dRow * 2;
    const jumpCol = col + dCol * 2;
    const middleRow = row + dRow;
    const middleCol = col + dCol;
    
    const middlePiece = this.getPiece(middleRow, middleCol);
    
    if (this.isValidSquare(jumpRow, jumpCol) &&
        !this.getPiece(jumpRow, jumpCol) &&
        middlePiece &&
        middlePiece.color !== piece.color) {
      moves.push({
        row: jumpRow,
        col: jumpCol,
        isCapture: true,
        capturedRow: middleRow,
        capturedCol: middleCol,
        capturedPieces: [{ row: middleRow, col: middleCol }]
      });
    }
  }

  getLongMoves(row, col, dRow, dCol, piece, moves, onlyCaptures) {
    let distance = 1;
    let capturedPiece = null;
    let capturedPos = null;

    while (true) {
      const newRow = row + dRow * distance;
      const newCol = col + dCol * distance;

      if (!this.isValidSquare(newRow, newCol)) break;

      const targetPiece = this.getPiece(newRow, newCol);

      if (targetPiece) {
        // Encontrou uma peça
        if (targetPiece.color === piece.color) {
          // Peça da mesma cor, não pode pular
          break;
        } else if (!capturedPiece) {
          // Primeira peça inimiga encontrada
          capturedPiece = targetPiece;
          capturedPos = { row: newRow, col: newCol };
        } else {
          // Segunda peça encontrada, não pode capturar
          break;
        }
      } else {
        // Casa vazia
        if (capturedPiece) {
          // Pode capturar e continuar
          moves.push({
            row: newRow,
            col: newCol,
            isCapture: true,
            capturedRow: capturedPos.row,
            capturedCol: capturedPos.col,
            capturedPieces: [capturedPos]
          });
        } else if (!onlyCaptures) {
          // Movimento simples sem captura
          moves.push({
            row: newRow,
            col: newCol,
            isCapture: false
          });
        }
      }

      distance++;
    }
  }

  getDirections(piece, forCapture = false) {
    if (piece.isKing) {
      return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    }
    
    // Para regras brasileiras e internacionais, peças podem capturar para trás
    if (forCapture && (this.ruleType === 'brazilian' || this.ruleType === 'international')) {
      return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    }
    
    // Movimentos normais
    if (piece.color === 'red') {
      return [[-1, -1], [-1, 1]]; // vermelho move para cima
    } else {
      return [[1, -1], [1, 1]]; // preto move para baixo
    }
  }

  selectPiece(row, col) {
    const piece = this.getPiece(row, col);
    
    if (!piece || piece.color !== this.currentPlayer) {
      return false;
    }

    // Verifica se há capturas obrigatórias
    const allCaptures = this.getAllPossibleCaptures(this.currentPlayer);
    
    if (allCaptures.length > 0) {
      // Se há capturas obrigatórias, apenas permite selecionar peças que podem capturar
      const canCapture = allCaptures.some(c => c.row === row && c.col === col);
      if (!canCapture) {
        return false;
      }
      this.validMoves = this.getValidMoves(row, col, true);
    } else {
      this.validMoves = this.getValidMoves(row, col, false);
    }

    this.selectedPiece = { row, col };
    return true;
  }

  movePiece(toRow, toCol) {
    if (!this.selectedPiece) return false;

    const { row: fromRow, col: fromCol } = this.selectedPiece;
    const validMove = this.validMoves.find(m => m.row === toRow && m.col === toCol);

    if (!validMove) return false;

    // Move a peça
    const piece = this.getPiece(fromRow, fromCol);
    const wasKing = piece.isKing;
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Captura
    let captureOccurred = false;
    if (validMove.isCapture) {
      this.board[validMove.capturedRow][validMove.capturedCol] = null;
      captureOccurred = true;
    }

    // Promove a dama
    const lastRow = piece.color === 'red' ? 0 : this.boardSize - 1;
    if (toRow === lastRow && !wasKing) {
      piece.isKing = true;
      
      // Nas regras internacionais, se promover a dama durante captura, não pode continuar capturando
      if (this.ruleType === 'international' && captureOccurred) {
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        return { continueCapture: false };
      }
    }

    // Verifica capturas múltiplas
    if (captureOccurred) {
      const additionalCaptures = this.getValidMoves(toRow, toCol, true);
      if (additionalCaptures.length > 0) {
        this.selectedPiece = { row: toRow, col: toCol };
        this.validMoves = additionalCaptures;
        return { continueCapture: true };
      }
    }

    // Troca o jogador
    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    this.selectedPiece = null;
    this.validMoves = [];

    return { continueCapture: false };
  }

  checkWinner() {
    let redPieces = 0;
    let blackPieces = 0;
    let redMoves = 0;
    let blackMoves = 0;

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const piece = this.getPiece(row, col);
        if (piece) {
          if (piece.color === 'red') {
            redPieces++;
            redMoves += this.getValidMoves(row, col).length;
          } else {
            blackPieces++;
            blackMoves += this.getValidMoves(row, col).length;
          }
        }
      }
    }

    if (blackPieces === 0 || (this.currentPlayer === 'black' && blackMoves === 0)) {
      return 'red';
    }
    if (redPieces === 0 || (this.currentPlayer === 'red' && redMoves === 0)) {
      return 'black';
    }

    return null;
  }

  reset() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'red';
    this.selectedPiece = null;
    this.validMoves = [];
  }
}
