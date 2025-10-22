<template>
  <div class="app">
    <!-- Menu de Seleção de Regras -->
    <RulesMenu 
      v-if="!selectedRules" 
      :language="currentLanguage"
      @select-rules="handleRulesSelection"
      @change-language="handleLanguageChange"
    />

    <div v-else class="game-container">
      <!-- Seletor de Idioma no Jogo -->
      <div class="game-header">
        <h1 class="title">
          <div class="title-main">
            <span class="title-icon">🎯</span>
            {{ t('checkersGame') }}
            <div class="header-flags">
              <span 
                class="header-flag flag-br" 
                :class="{ 'active': currentLanguage === 'pt' }"
                @click="handleLanguageChange('pt')"
                title="Português"
              >PT</span>
              <span 
                class="header-flag flag-us" 
                :class="{ 'active': currentLanguage === 'en' }"
                @click="handleLanguageChange('en')"
                title="English"
              >EN</span>
              <span 
                class="header-flag flag-es" 
                :class="{ 'active': currentLanguage === 'es' }"
                @click="handleLanguageChange('es')"
                title="Español"
              >ES</span>
            </div>
          </div>
          <span class="rule-badge">{{ getRuleName() }}</span>
        </h1>
      </div>
      
      <div class="game-info">
        <div class="player-turn">
          <div class="turn-indicator" :class="{ 'red': game.currentPlayer === 'red', 'black': game.currentPlayer === 'black' }">
            <span class="player-piece" :class="game.currentPlayer"></span>
            <span v-if="!isAITurn">{{ t('playerTurn') }} {{ game.currentPlayer === 'red' ? t('redPlayer') : t('blackPlayer') }}</span>
            <span v-else>{{ t('computerTurn') }} {{ t('thinking') }}</span>
          </div>
        </div>

        <div class="score-board">
          <div class="score red">
            <span class="piece-icon red"></span>
            <span>{{ redPieces }} {{ t('pieces') }}</span>
          </div>
          <div class="score black">
            <span class="piece-icon black"></span>
            <span>{{ blackPieces }} {{ t('pieces') }}</span>
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
          🔄 {{ t('resetGame') }}
        </button>
        <button @click="changeRules" class="btn btn-change">
          ⚙️ {{ t('changeRules') }}
        </button>
      </div>

      <div class="instructions">
        <h3>📜 {{ t('rules') }} {{ getRuleName() }}:</h3>
        <ul>
          <li>{{ t('instructions.clickPiece') }}</li>
          <li>{{ t('instructions.clickSquare') }}</li>
          <li>{{ t('instructions.capture') }}</li>
          <li v-if="selectedRules === 'american'">{{ t('instructions.noCaptureBackward') }}</li>
          <li v-if="selectedRules !== 'american'">{{ t('instructions.canCaptureBackward') }}</li>
          <li v-if="selectedRules === 'american'">{{ t('instructions.kingShortMove') }}</li>
          <li v-if="selectedRules !== 'american'">{{ t('instructions.kingLongMove') }}</li>
          <li v-if="selectedRules !== 'american'">{{ t('instructions.maxCapture') }}</li>
          <li v-else>{{ t('instructions.freeCapture') }}</li>
          <li>{{ t('instructions.becomeKing') }}</li>
          <li>{{ t('instructions.winCondition') }}</li>
        </ul>
      </div>
    </div>

    <!-- Modal de Vitória -->
    <div v-if="winner" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-content">
          <h2>🎉 {{ t('victory') }}</h2>
          <p class="winner-announcement">
            {{ winner === 'red' ? t('redPlayer') : t('blackPlayer') }} <span :class="winner">{{ t('won') }}</span>
          </p>
          <div class="modal-buttons">
            <button @click="resetGame" class="btn btn-primary">
              {{ t('playAgain') }}
            </button>
            <button @click="closeModal" class="btn btn-secondary">
              {{ t('close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue';
import CheckersBoard from './components/CheckersBoard.vue';
import RulesMenu from './components/RulesMenu.vue';
import { CheckersGame } from './game/CheckersGame.js';
import { CheckersAI } from './game/CheckersAI.js';
import { useTranslation } from './i18n.js';

export default {
  name: 'App',
  components: {
    CheckersBoard,
    RulesMenu
  },
  setup() {
    const currentLanguage = ref('pt');
    const selectedRules = ref(null);
    const gameMode = ref('pvp'); // 'pvp' ou 'pvc'
    const aiDifficulty = ref('medium');
    const game = ref(null);
    const ai = ref(null);
    const winner = ref(null);
    const forceUpdate = ref(0);
    const isAITurn = ref(false);

    // Sistema de tradução
    const t = computed(() => {
      const { t } = useTranslation(currentLanguage.value);
      return t;
    });

    const handleRulesSelection = (config) => {
      selectedRules.value = config.ruleType;
      gameMode.value = config.gameMode;
      aiDifficulty.value = config.aiDifficulty;
      game.value = new CheckersGame(config.ruleType);
      
      if (config.gameMode === 'pvc') {
        ai.value = new CheckersAI(config.aiDifficulty);
      }
      
      forceUpdate.value++;
    };

    const handleLanguageChange = (lang) => {
      currentLanguage.value = lang;
    };

    const getRuleName = () => {
      const names = {
        pt: {
          'american': 'American Checkers',
          'brazilian': 'Damas Brasileiras',
          'international': 'Damas Internacionais'
        },
        en: {
          'american': 'American Checkers',
          'brazilian': 'Brazilian Draughts',
          'international': 'International Draughts'
        },
        es: {
          'american': 'Damas Americanas',
          'brazilian': 'Damas Brasileñas',
          'international': 'Damas Internacionales'
        }
      };
      return names[currentLanguage.value]?.[selectedRules.value] || '';
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
      // Não permite jogadas se for o turno da IA
      if (isAITurn.value) return;
      
      const piece = game.value.getPiece(row, col);

      // Se há uma peça selecionada, tenta mover
      if (game.value.selectedPiece) {
        const result = game.value.movePiece(row, col);
        
        if (result) {
          // Força a reatividade
          forceUpdate.value++;
          
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
        }
      }
    };

    // Observa mudanças no turno do jogador para acionar a IA
    watch(() => game.value?.currentPlayer, async (newPlayer) => {
      if (!game.value || !ai.value || gameMode.value !== 'pvc') return;
      
      // Se for o turno do preto e o modo é PvC, a IA joga
      if (newPlayer === 'black' && !winner.value) {
        isAITurn.value = true;
        
        // Aguarda um pouco para parecer que está "pensando"
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await makeAIMove();
        
        isAITurn.value = false;
      }
    });

    const makeAIMove = async () => {
      if (!game.value || !ai.value) return;
      
      const aiMove = ai.value.getBestMove(game.value, 'black');
      
      if (!aiMove) {
        winner.value = 'red'; // IA não tem movimentos
        return;
      }

      // Seleciona a peça
      game.value.selectPiece(aiMove.from.row, aiMove.from.col);
      forceUpdate.value++;
      
      // Aguarda um pouco para mostrar a seleção
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Move a peça
      const result = game.value.movePiece(aiMove.to.row, aiMove.to.col);
      forceUpdate.value++;
      
      // Verifica se há capturas múltiplas
      if (result && result.continueCapture) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await makeAIMove(); // Continua capturando
      } else {
        // Verifica vencedor
        const gameWinner = game.value.checkWinner();
        if (gameWinner) {
          winner.value = gameWinner;
        }
      }
    };

    const resetGame = () => {
      game.value = new CheckersGame(selectedRules.value);
      winner.value = null;
      isAITurn.value = false;
      // Força a reatividade
      forceUpdate.value++;
    };

    const changeRules = () => {
      selectedRules.value = null;
      game.value = null;
      ai.value = null;
      winner.value = null;
      isAITurn.value = false;
      forceUpdate.value++;
    };

    const closeModal = () => {
      winner.value = null;
    };

    return {
      currentLanguage,
      selectedRules,
      gameMode,
      game,
      winner,
      forceUpdate,
      isAITurn,
      t,
      redPieces,
      blackPieces,
      handleRulesSelection,
      handleLanguageChange,
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
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;
}

.title {
  text-align: center;
  color: #4a3933;
  font-size: 2.5em;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.title-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.title-icon {
  font-size: 1em;
}

.header-flags {
  display: flex;
  gap: 8px;
  font-size: 0.5em;
  margin-left: 10px;
}

.header-flag {
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0.6;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.2em;
  border: 2px solid transparent;
}

.header-flag.flag-br {
  background: linear-gradient(135deg, #009c3b 0%, #ffdf00 100%);
  color: #002776;
}

.header-flag.flag-us {
  background: linear-gradient(135deg, #b22234 0%, #3c3b6e 100%);
  color: white;
}

.header-flag.flag-es {
  background: linear-gradient(135deg, #c60b1e 0%, #ffc400 100%);
  color: #c60b1e;
}

.header-flag:hover {
  transform: scale(1.15);
  opacity: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.header-flag.active {
  opacity: 1;
  transform: scale(1.2);
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3);
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

  .game-header {
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-size: 1.8em;
  }

  .title-main {
    flex-direction: column;
    gap: 8px;
  }

  .header-flags {
    font-size: 0.45em;
    gap: 6px;
    margin-left: 0;
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
