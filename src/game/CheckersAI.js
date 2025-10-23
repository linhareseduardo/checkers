// IA para o jogo de damas com algoritmos avançados
export class CheckersAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty; // 'easy', 'medium', 'hard', 'expert'
    this.transpositionTable = new Map(); // Cache de posições já avaliadas
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
      case 'expert':
        return this.getExpertMove(game, allMoves, color);
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
    const depth = 6; // Profundidade aumentada
    return this.getBestMoveWithMinimax(game, moves, color, depth);
  }

  // Nível Expert: Minimax avançado com ordenação de movimentos e cache
  getExpertMove(game, moves, color) {
    const depth = 8; // Profundidade ainda maior
    this.transpositionTable.clear(); // Limpa cache
    
    // Ordena movimentos para melhorar poda alpha-beta
    const orderedMoves = this.orderMoves(game, moves, color);
    return this.getBestMoveWithMinimax(game, orderedMoves, color, depth);
  }

  // Busca Minimax melhorada
  getBestMoveWithMinimax(game, moves, color, depth) {
    let bestMove = null;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const move of moves) {
      const gameCopy = this.cloneGame(game);
      this.applyMove(gameCopy, move);

      const score = this.minimax(gameCopy, depth - 1, alpha, beta, false, color);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, score);
    }

    return bestMove || this.getRandomMove(moves);
  }

  // Algoritmo Minimax melhorado com cache e poda alpha-beta
  minimax(game, depth, alpha, beta, isMaximizing, aiColor) {
    // Verifica condições de parada
    const winner = game.checkWinner();
    if (winner) {
      return winner === aiColor ? 100000 : -100000;
    }
    
    if (depth === 0) {
      return this.evaluateBoard(game, aiColor);
    }

    // Gera hash da posição para cache
    const positionHash = this.getPositionHash(game);
    const cached = this.transpositionTable.get(positionHash);
    if (cached && cached.depth >= depth) {
      return cached.score;
    }

    const currentColor = isMaximizing ? aiColor : (aiColor === 'red' ? 'black' : 'red');
    const moves = this.getAllPossibleMoves(game, currentColor);

    if (moves.length === 0) {
      return isMaximizing ? -100000 : 100000;
    }

    // Ordena movimentos para melhorar poda
    const orderedMoves = this.orderMoves(game, moves, currentColor);

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of orderedMoves) {
        const gameCopy = this.cloneGame(game);
        this.applyMove(gameCopy, move);
        const score = this.minimax(gameCopy, depth - 1, alpha, beta, false, aiColor);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Poda alpha-beta
      }
      
      // Armazena no cache
      this.transpositionTable.set(positionHash, { score: maxScore, depth });
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of orderedMoves) {
        const gameCopy = this.cloneGame(game);
        this.applyMove(gameCopy, move);
        const score = this.minimax(gameCopy, depth - 1, alpha, beta, true, aiColor);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Poda alpha-beta
      }
      
      // Armazena no cache
      this.transpositionTable.set(positionHash, { score: minScore, depth });
      return minScore;
    }
  }

  // Ordena movimentos para melhorar eficiência da poda alpha-beta
  orderMoves(game, moves, color) {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Prioriza capturas
      if (a.isCapture) scoreA += 1000;
      if (b.isCapture) scoreB += 1000;

      // Prioriza capturas múltiplas
      if (a.capturedPieces && a.capturedPieces.length > 1) {
        scoreA += a.capturedPieces.length * 500;
      }
      if (b.capturedPieces && b.capturedPieces.length > 1) {
        scoreB += b.capturedPieces.length * 500;
      }

      // Prioriza movimentos de damas
      if (a.piece.isKing) scoreA += 100;
      if (b.piece.isKing) scoreB += 100;

      // Prioriza promoção a dama
      const lastRow = color === 'red' ? 0 : game.boardSize - 1;
      if (a.to.row === lastRow && !a.piece.isKing) scoreA += 800;
      if (b.to.row === lastRow && !b.piece.isKing) scoreB += 800;

      // Prioriza centro do tabuleiro
      const centerRow = game.boardSize / 2;
      const centerCol = game.boardSize / 2;
      scoreA -= Math.abs(a.to.row - centerRow) + Math.abs(a.to.col - centerCol);
      scoreB -= Math.abs(b.to.row - centerRow) + Math.abs(b.to.col - centerCol);

      return scoreB - scoreA;
    });
  }

  // Gera hash único para uma posição
  getPositionHash(game) {
    let hash = '';
    for (let row = 0; row < game.boardSize; row++) {
      for (let col = 0; col < game.boardSize; col++) {
        const piece = game.getPiece(row, col);
        if (piece) {
          hash += `${row}${col}${piece.color[0]}${piece.isKing ? 'K' : 'N'}`;
        }
      }
    }
    hash += game.currentPlayer;
    return hash;
  }

  // Avalia o tabuleiro com múltiplos critérios estratégicos
  evaluateBoard(game, aiColor) {
    let score = 0;
    const opponentColor = aiColor === 'red' ? 'black' : 'red';

    let aiPieces = 0;
    let aiKings = 0;
    let opponentPieces = 0;
    let opponentKings = 0;
    let aiBackRow = 0;
    let opponentBackRow = 0;
    let aiMobility = 0;
    let opponentMobility = 0;

    for (let row = 0; row < game.boardSize; row++) {
      for (let col = 0; col < game.boardSize; col++) {
        const piece = game.getPiece(row, col);
        if (!piece) continue;

        const isAI = piece.color === aiColor;
        const pieceValue = piece.isKing ? 10 : 3; // Damas valem muito mais
        const positionBonus = this.getPositionBonus(row, col, game.boardSize, piece);
        const advancementBonus = this.getAdvancementBonus(row, game.boardSize, piece);
        const safetyBonus = this.getSafetyBonus(game, row, col, piece);
        const centralBonus = this.getCentralControlBonus(row, col, game.boardSize);

        const totalValue = pieceValue + positionBonus + advancementBonus + safetyBonus + centralBonus;

        if (isAI) {
          score += totalValue;
          aiPieces++;
          if (piece.isKing) aiKings++;
          
          // Conta peças na linha de trás (defesa)
          const backRow = aiColor === 'red' ? game.boardSize - 1 : 0;
          if (row === backRow) aiBackRow++;
          
          // Mobilidade (quantas jogadas possíveis)
          const moves = game.getValidMoves(row, col, false);
          aiMobility += moves.length;
        } else {
          score -= totalValue;
          opponentPieces++;
          if (piece.isKing) opponentKings++;
          
          const backRow = opponentColor === 'red' ? game.boardSize - 1 : 0;
          if (row === backRow) opponentBackRow++;
          
          const moves = game.getValidMoves(row, col, false);
          opponentMobility += moves.length;
        }
      }
    }

    // Bônus estratégicos
    score += (aiPieces - opponentPieces) * 100; // Vantagem material
    score += (aiKings - opponentKings) * 150; // Vantagem de damas
    score += (aiBackRow - opponentBackRow) * 5; // Defesa da linha de trás
    score += (aiMobility - opponentMobility) * 2; // Mobilidade e flexibilidade
    
    // Bônus de dominação (muitas peças vs poucas)
    if (aiPieces > opponentPieces * 2) {
      score += 200; // Dominação total
    }
    
    // Penalidade por endgame mal posicionado
    if (aiPieces <= 3 && opponentKings > aiKings) {
      score -= 100; // Situação difícil no final
    }

    return score;
  }

  // Bônus de avanço no tabuleiro
  getAdvancementBonus(row, boardSize, piece) {
    if (piece.isKing) return 0; // Damas já estão avançadas
    
    const advancement = piece.color === 'red' 
      ? (boardSize - row - 1) 
      : row;
    
    return advancement * 2; // Quanto mais avançada, melhor
  }

  // Bônus de segurança (peça protegida)
  getSafetyBonus(game, row, col, piece) {
    let safety = 0;
    
    // Nas bordas é mais seguro
    if (col === 0 || col === game.boardSize - 1) {
      safety += 1;
    }
    
    // Verifica se tem peças amigas nas diagonais (proteção)
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (game.isValidSquare(newRow, newCol)) {
        const neighbor = game.getPiece(newRow, newCol);
        if (neighbor && neighbor.color === piece.color) {
          safety += 0.5;
        }
      }
    }
    
    return safety;
  }

  // Bônus de controle central
  getCentralControlBonus(row, col, boardSize) {
    const center = boardSize / 2;
    const distance = Math.abs(row - center) + Math.abs(col - center);
    return Math.max(0, 4 - distance); // Centro vale mais
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
