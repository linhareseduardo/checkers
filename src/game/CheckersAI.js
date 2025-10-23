// IA para o jogo de damas
export class CheckersAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty; // 'easy', 'medium', 'hard'
  }

  // Método principal para obter a jogada da IA
  getBestMove(game, color) {
    const allMoves = this.getAllPossibleMoves(game, color);
    
    if (allMoves.length === 0) return null;

    switch (this.difficulty) {
      case 'easy':
        return this.getRandomMove(allMoves);
      case 'medium':
        return this.getMediumMove(game, allMoves, color);
      case 'hard':
        return this.getHardMove(game, allMoves, color);
      default:
        return this.getRandomMove(allMoves);
    }
  }

  // Obtém todos os movimentos possíveis para uma cor
  getAllPossibleMoves(game, color) {
    const moves = [];
    
    // Primeiro, verifica se há capturas obrigatórias
    const allCaptures = game.getAllPossibleCaptures(color);
    
    if (allCaptures.length > 0) {
      // Se há capturas obrigatórias, retorna apenas elas
      for (const capture of allCaptures) {
        const piece = game.getPiece(capture.row, capture.col);
        for (const move of capture.moves) {
          moves.push({
            from: { row: capture.row, col: capture.col },
            to: { row: move.row, col: move.col },
            isCapture: move.isCapture,
            capturedRow: move.capturedRow,
            capturedCol: move.capturedCol,
            capturedPieces: move.capturedPieces,
            piece: piece
          });
        }
      }
      return moves;
    }
    
    // Se não há capturas obrigatórias, retorna todos os movimentos possíveis
    for (let row = 0; row < game.boardSize; row++) {
      for (let col = 0; col < game.boardSize; col++) {
        const piece = game.getPiece(row, col);
        if (piece && piece.color === color) {
          const validMoves = game.getValidMoves(row, col, false);
          
          for (const move of validMoves) {
            moves.push({
              from: { row, col },
              to: { row: move.row, col: move.col },
              isCapture: move.isCapture,
              capturedRow: move.capturedRow,
              capturedCol: move.capturedCol,
              piece: piece
            });
          }
        }
      }
    }
    
    return moves;
  }

  // Nível Fácil: Movimento aleatório
  getRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Nível Médio: Prioriza capturas e peças importantes
  getMediumMove(game, moves, color) {
    // Prioriza capturas
    const captures = moves.filter(m => m.isCapture);
    if (captures.length > 0) {
      return this.getRandomMove(captures);
    }

    // Avalia movimentos baseado em heurísticas simples
    const scoredMoves = moves.map(move => ({
      move,
      score: this.evaluateMove(game, move, color)
    }));

    // Ordena por pontuação
    scoredMoves.sort((a, b) => b.score - a.score);

    // Pega um dos top 3 movimentos aleatoriamente (adiciona variação)
    const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
    return this.getRandomMove(topMoves.map(sm => sm.move));
  }

  // Nível Difícil: Minimax com alpha-beta pruning
  getHardMove(game, moves, color) {
    const depth = 4; // Profundidade de busca
    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of moves) {
      // Simula o movimento
      const gameCopy = this.cloneGame(game);
      this.applyMove(gameCopy, move);

      // Avalia usando minimax
      const score = this.minimax(gameCopy, depth - 1, -Infinity, Infinity, false, color);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove || this.getRandomMove(moves);
  }

  // Algoritmo Minimax com poda alpha-beta
  minimax(game, depth, alpha, beta, isMaximizing, aiColor) {
    if (depth === 0 || game.checkWinner()) {
      return this.evaluateBoard(game, aiColor);
    }

    const currentColor = isMaximizing ? aiColor : (aiColor === 'red' ? 'black' : 'red');
    const moves = this.getAllPossibleMoves(game, currentColor);

    if (moves.length === 0) {
      return isMaximizing ? -10000 : 10000;
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        const gameCopy = this.cloneGame(game);
        this.applyMove(gameCopy, move);
        const score = this.minimax(gameCopy, depth - 1, alpha, beta, false, aiColor);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Poda
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        const gameCopy = this.cloneGame(game);
        this.applyMove(gameCopy, move);
        const score = this.minimax(gameCopy, depth - 1, alpha, beta, true, aiColor);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Poda
      }
      return minScore;
    }
  }

  // Avalia o tabuleiro
  evaluateBoard(game, aiColor) {
    let score = 0;
    const opponentColor = aiColor === 'red' ? 'black' : 'red';

    for (let row = 0; row < game.boardSize; row++) {
      for (let col = 0; col < game.boardSize; col++) {
        const piece = game.getPiece(row, col);
        if (!piece) continue;

        const pieceValue = piece.isKing ? 5 : 3;
        const positionBonus = this.getPositionBonus(row, col, game.boardSize, piece);

        if (piece.color === aiColor) {
          score += pieceValue + positionBonus;
        } else {
          score -= pieceValue + positionBonus;
        }
      }
    }

    return score;
  }

  // Avalia um movimento individual (para nível médio)
  evaluateMove(game, move, color) {
    let score = 0;

    // Captura vale muito
    if (move.isCapture) {
      score += 10;
    }

    // Peças damas valem mais
    if (move.piece.isKing) {
      score += 2;
    }

    // Avançar no tabuleiro é bom
    const advanceScore = color === 'red' ? (game.boardSize - move.to.row) : move.to.row;
    score += advanceScore * 0.5;

    // Promover a dama é ótimo
    const lastRow = color === 'red' ? 0 : game.boardSize - 1;
    if (move.to.row === lastRow && !move.piece.isKing) {
      score += 15;
    }

    // Evitar bordas (exceto para damas)
    if (!move.piece.isKing) {
      if (move.to.col === 0 || move.to.col === game.boardSize - 1) {
        score -= 1;
      }
    }

    return score;
  }

  // Bônus de posição no tabuleiro
  getPositionBonus(row, col, boardSize, piece) {
    let bonus = 0;

    // Centro do tabuleiro vale mais
    const centerRow = boardSize / 2;
    const centerCol = boardSize / 2;
    const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
    bonus += (boardSize - distanceFromCenter) * 0.1;

    // Peças próximas à promoção valem mais
    if (!piece.isKing) {
      if (piece.color === 'red') {
        bonus += (boardSize - row) * 0.2;
      } else {
        bonus += row * 0.2;
      }
    }

    return bonus;
  }

  // Clona o jogo para simulação
  cloneGame(game) {
    const clone = Object.create(Object.getPrototypeOf(game));
    clone.ruleType = game.ruleType;
    clone.boardSize = game.boardSize;
    clone.currentPlayer = game.currentPlayer;
    clone.selectedPiece = game.selectedPiece ? { ...game.selectedPiece } : null;
    clone.validMoves = [...game.validMoves];
    
    // Clona o tabuleiro
    clone.board = game.board.map(row => 
      row.map(piece => piece ? { ...piece } : null)
    );

    // Copia os métodos
    Object.setPrototypeOf(clone, Object.getPrototypeOf(game));
    
    return clone;
  }

  // Aplica um movimento no jogo
  applyMove(game, move) {
    const piece = game.board[move.from.row][move.from.col];
    game.board[move.to.row][move.to.col] = piece;
    game.board[move.from.row][move.from.col] = null;

    // Captura
    if (move.isCapture) {
      game.board[move.capturedRow][move.capturedCol] = null;
    }

    // Promoção
    const lastRow = piece.color === 'red' ? 0 : game.boardSize - 1;
    if (move.to.row === lastRow) {
      piece.isKing = true;
    }

    // Troca o jogador
    game.currentPlayer = game.currentPlayer === 'red' ? 'black' : 'red';
  }
}
