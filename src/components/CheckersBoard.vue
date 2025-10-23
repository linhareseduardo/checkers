<template>
  <div class="board-container">
    <div class="board" :class="'board-' + boardSize">
      <div
        v-for="row in boardSize"
        :key="row"
        class="board-row"
      >
        <div
          v-for="col in boardSize"
          :key="col"
          class="square"
          :class="{
            'dark': isDarkSquare(row - 1, col - 1),
            'light': !isDarkSquare(row - 1, col - 1),
            'highlighted': isHighlighted(row - 1, col - 1),
            'selected': isSelected(row - 1, col - 1),
            'valid-move': isValidMove(row - 1, col - 1)
          }"
          @click="handleSquareClick(row - 1, col - 1)"
        >
          <div
            v-if="getPiece(row - 1, col - 1)"
            class="piece"
            :class="{
              'red': getPiece(row - 1, col - 1).color === 'red',
              'black': getPiece(row - 1, col - 1).color === 'black',
              'king': getPiece(row - 1, col - 1).isKing,
              'must-capture': isMustCapture(row - 1, col - 1)
            }"
          >
            <span v-if="getPiece(row - 1, col - 1).isKing" class="crown">♔</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckersBoard',
  props: {
    board: {
      type: Array,
      required: true
    },
    boardSize: {
      type: Number,
      default: 8
    },
    selectedSquare: {
      type: Object,
      default: null
    },
    validMoves: {
      type: Array,
      default: () => []
    },
    mustCapturePieces: {
      type: Array,
      default: () => []
    }
  },
  emits: ['square-click'],
  methods: {
    isDarkSquare(row, col) {
      return (row + col) % 2 === 1;
    },
    getPiece(row, col) {
      return this.board[row][col];
    },
    isSelected(row, col) {
      return this.selectedSquare && 
             this.selectedSquare.row === row && 
             this.selectedSquare.col === col;
    },
    isValidMove(row, col) {
      return this.validMoves.some(move => move.row === row && move.col === col);
    },
    isHighlighted(row, col) {
      return this.isSelected(row, col) || this.isValidMove(row, col);
    },
    isMustCapture(row, col) {
      return this.mustCapturePieces.some(piece => piece.row === row && piece.col === col);
    },
    handleSquareClick(row, col) {
      this.$emit('square-click', { row, col });
    }
  }
}
</script>

<style scoped>
.board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.board {
  display: flex;
  flex-direction: column;
  border: 8px solid #4a3933;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  background: #4a3933;
}

.board-row {
  display: flex;
}

.board-8 .square {
  width: 70px;
  height: 70px;
}

.board-10 .square {
  width: 56px;
  height: 56px;
}

.square {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.square.light {
  background-color: #f0d9b5;
}

.square.dark {
  background-color: #b58863;
}

.square.selected {
  background-color: #ffd700 !important;
  box-shadow: inset 0 0 15px rgba(255, 215, 0, 0.6);
}

.square.valid-move {
  background-color: #90ee90 !important;
  cursor: pointer;
}

.square.valid-move::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 128, 0, 0.5);
  border-radius: 50%;
}

.square:hover {
  opacity: 0.9;
}

.board-8 .piece {
  width: 55px;
  height: 55px;
}

.board-10 .piece {
  width: 44px;
  height: 44px;
}

.piece {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 3px solid rgba(0, 0, 0, 0.2);
}

.piece:hover {
  transform: scale(1.1);
}

.piece.red {
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
}

.piece.black {
  background: radial-gradient(circle at 30% 30%, #495057, #212529);
}

.piece.king {
  border: 3px solid gold;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.piece.must-capture {
  animation: pulse 1.5s ease-in-out infinite;
  border: 3px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 255, 0, 1);
    transform: scale(1.05);
  }
}

.board-8 .crown {
  font-size: 32px;
}

.board-10 .crown {
  font-size: 26px;
}

.crown {
  color: gold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .board-8 .square {
    width: 45px;
    height: 45px;
  }

  .board-10 .square {
    width: 36px;
    height: 36px;
  }
  
  .board-8 .piece {
    width: 35px;
    height: 35px;
  }

  .board-10 .piece {
    width: 28px;
    height: 28px;
  }
  
  .board-8 .crown {
    font-size: 20px;
  }

  .board-10 .crown {
    font-size: 16px;
  }
}
</style>
