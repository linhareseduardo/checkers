<template>
  <div class="app">
    <!-- Menu de Seleção de Regras -->
    <RulesMenu v-if="!selectedRules" @select-rules="handleRulesSelection" />

    <div v-else class="game-container">
      <h1 class="title">
        🎯 Jogo de Damas
        <span class="rule-badge">{{ getRuleName() }}</span>
      </h1>
      
      <div class="game-info">
        <div class="player-turn">
          <div class="turn-indicator" :class="{ 'red': game.currentPlayer === 'red', 'black': game.currentPlayer === 'black' }">
            <span class="player-piece" :class="game.currentPlayer"></span>
            <span>Vez do jogador {{ game.currentPlayer === 'red' ? 'Vermelho' : 'Preto' }}</span>
          </div>
        </div>

        <div class="score-board">
          <div class="score red">
            <span class="piece-icon red"></span>
            <span>{{ redPieces }} peças</span>
          </div>
          <div class="score black">
            <span class="piece-icon black"></span>
            <span>{{ blackPieces }} peças</span>
          </div>
        </div>
      </div>

      <CheckersBoard
        :key="forceUpdate"
        :board="game.board"
        :boardSize="game.boardSize"
        :selectedSquare="game.selectedPiece"
        :validMoves="game.validMoves"
        @square-click="handleSquareClick"
      />

      <div class="controls">
        <button @click="resetGame" class="btn btn-reset">
          🔄 Reiniciar Jogo
        </button>
        <button @click="changeRules" class="btn btn-change">
          ⚙️ Mudar Regras
        </button>
      </div>

      <div class="instructions">
        <h3>📜 Regras {{ getRuleName() }}:</h3>
        <ul>
          <li>Clique em uma peça para selecioná-la</li>
          <li>Clique em um quadrado verde para mover</li>
          <li>Capture as peças do oponente pulando sobre elas</li>
          <li v-if="selectedRules === 'american'">❌ Peças comuns não capturam para trás</li>
          <li v-if="selectedRules !== 'american'">✅ Peças comuns podem capturar para trás</li>
          <li v-if="selectedRules === 'american'">👑 Damas se movem apenas 1 casa</li>
          <li v-if="selectedRules !== 'american'">👑 Damas se movem múltiplas casas</li>
          <li v-if="selectedRules !== 'american'">🎯 Deve capturar o máximo de peças possível</li>
          <li v-else>🎯 Capturas são obrigatórias (escolha livre)</li>
          <li>Alcance o outro lado para se tornar uma Dama ♔</li>
          <li>Vença capturando todas as peças do oponente!</li>
        </ul>
      </div>
    </div>

    <!-- Modal de Vitória -->
    <div v-if="winner" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-content">
          <h2>🎉 Vitória!</h2>
          <p class="winner-announcement">
            O jogador <span :class="winner">{{ winner === 'red' ? 'Vermelho' : 'Preto' }}</span> venceu!
          </p>
          <div class="modal-buttons">
            <button @click="resetGame" class="btn btn-primary">
              Jogar Novamente
            </button>
            <button @click="closeModal" class="btn btn-secondary">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, triggerRef } from 'vue';
import CheckersBoard from './components/CheckersBoard.vue';
import RulesMenu from './components/RulesMenu.vue';
import { CheckersGame } from './game/CheckersGame.js';

export default {
  name: 'App',
  components: {
    CheckersBoard,
    RulesMenu
  },
  setup() {
    const selectedRules = ref(null);
    const game = ref(null);
    const winner = ref(null);
    const forceUpdate = ref(0);

    const handleRulesSelection = (ruleType) => {
      selectedRules.value = ruleType;
      game.value = new CheckersGame(ruleType);
      forceUpdate.value++;
    };

    const getRuleName = () => {
      const names = {
        'american': 'American Checkers',
        'brazilian': 'Damas Brasileiras',
        'international': 'Damas Internacionais'
      };
      return names[selectedRules.value] || '';
    };

    const redPieces = computed(() => {
      if (!game.value) return 0;
      forceUpdate.value; // Depende do forceUpdate
      let count = 0;
      for (let row = 0; row < game.value.boardSize; row++) {
        for (let col = 0; col < game.value.boardSize; col++) {
          const piece = game.value.getPiece(row, col);
          if (piece && piece.color === 'red') count++;
        }
      }
      return count;
    });

    const blackPieces = computed(() => {
      if (!game.value) return 0;
      forceUpdate.value; // Depende do forceUpdate
      let count = 0;
      for (let row = 0; row < game.value.boardSize; row++) {
        for (let col = 0; col < game.value.boardSize; col++) {
          const piece = game.value.getPiece(row, col);
          if (piece && piece.color === 'black') count++;
        }
      }
      return count;
    });

    const handleSquareClick = ({ row, col }) => {
      const piece = game.value.getPiece(row, col);

      // Se há uma peça selecionada, tenta mover
      if (game.value.selectedPiece) {
        const result = game.value.movePiece(row, col);
        
        if (result) {
          // Força a reatividade
          forceUpdate.value++;
          triggerRef(game);
          
          // Verifica vencedor
          const gameWinner = game.value.checkWinner();
          if (gameWinner) {
            winner.value = gameWinner;
          }
          return;
        }
      }

      // Tenta selecionar uma peça
      if (piece && piece.color === game.value.currentPlayer) {
        const selected = game.value.selectPiece(row, col);
        if (selected) {
          // Força a reatividade
          forceUpdate.value++;
          triggerRef(game);
        }
      }
    };

    const resetGame = () => {
      game.value = new CheckersGame(selectedRules.value);
      winner.value = null;
      // Força a reatividade
      forceUpdate.value++;
      triggerRef(game);
    };

    const changeRules = () => {
      selectedRules.value = null;
      game.value = null;
      winner.value = null;
      forceUpdate.value++;
    };

    const closeModal = () => {
      winner.value = null;
    };

    return {
      selectedRules,
      game,
      winner,
      forceUpdate,
      redPieces,
      blackPieces,
      handleRulesSelection,
      getRuleName,
      handleSquareClick,
      resetGame,
      changeRules,
      closeModal
    };
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 20px;
}

.game-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  text-align: center;
  color: #4a3933;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.rule-badge {
  font-size: 0.4em;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: normal;
}

.game-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.player-turn {
  flex: 1;
  min-width: 200px;
}

.turn-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.turn-indicator.red {
  background: linear-gradient(135deg, #ff6b6b, #ff8787);
  color: white;
}

.turn-indicator.black {
  background: linear-gradient(135deg, #495057, #6c757d);
  color: white;
}

.player-piece {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.player-piece.red {
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
}

.player-piece.black {
  background: radial-gradient(circle at 30% 30%, #495057, #212529);
}

.score-board {
  display: flex;
  gap: 15px;
}

.score {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-weight: bold;
}

.piece-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: inline-block;
}

.piece-icon.red {
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
}

.piece-icon.black {
  background: radial-gradient(circle at 30% 30%, #495057, #212529);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 30px;
  font-size: 1.1em;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-reset {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-change {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
  color: white;
  margin-right: 10px;
}

.btn-secondary {
  background: linear-gradient(135deg, #bdc3c7, #95a5a6);
  color: white;
}

.instructions {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.instructions h3 {
  color: #4a3933;
  margin-bottom: 15px;
}

.instructions ul {
  list-style-position: inside;
  color: #495057;
  line-height: 1.8;
}

.instructions li {
  margin-bottom: 8px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  text-align: center;
  max-width: 500px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #4a3933;
}

.winner-announcement {
  font-size: 1.5em;
  margin-bottom: 30px;
  color: #495057;
}

.winner-announcement .red {
  color: #c92a2a;
  font-weight: bold;
}

.winner-announcement .black {
  color: #212529;
  font-weight: bold;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

@media (max-width: 768px) {
  .game-container {
    padding: 15px;
  }

  .title {
    font-size: 1.8em;
  }

  .game-info {
    flex-direction: column;
  }

  .turn-indicator {
    justify-content: center;
  }

  .score-board {
    width: 100%;
    justify-content: center;
  }

  .instructions {
    font-size: 0.9em;
  }

  .modal {
    margin: 20px;
    padding: 25px;
  }

  .modal h2 {
    font-size: 2em;
  }

  .winner-announcement {
    font-size: 1.2em;
  }
}
</style>
