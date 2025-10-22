<template>
  <div class="rules-menu-overlay">
    <div class="rules-menu">
      <h1 class="menu-title">🎯 Escolha as Regras do Jogo</h1>
      
      <div class="rules-grid">
        <!-- American Checkers -->
        <div class="rule-card american" @click="selectRules('american')">
          <div class="flag">🇺🇸</div>
          <h2>American Checkers</h2>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="icon">📐</span>
              <span>Tabuleiro 8x8</span>
            </div>
            <div class="detail-item">
              <span class="icon">👑</span>
              <span>Movimentos curtos</span>
            </div>
            <div class="detail-item">
              <span class="icon">⭕</span>
              <span>Não captura para trás</span>
            </div>
            <div class="detail-item">
              <span class="icon">🎯</span>
              <span>Captura livre</span>
            </div>
          </div>
          
          <button class="choose-btn">Escolher</button>
        </div>

        <!-- Brazilian Draughts -->
        <div class="rule-card brazilian" @click="selectRules('brazilian')">
          <div class="flag">🇧🇷</div>
          <h2>Damas Brasileiras</h2>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="icon">📐</span>
              <span>Tabuleiro 8x8</span>
            </div>
            <div class="detail-item">
              <span class="icon">👑</span>
              <span>Movimentos longos</span>
            </div>
            <div class="detail-item">
              <span class="icon">✅</span>
              <span>Captura para trás</span>
            </div>
            <div class="detail-item">
              <span class="icon">🎯</span>
              <span>Captura máxima obrigatória</span>
            </div>
          </div>
          
          <button class="choose-btn">Escolher</button>
        </div>

        <!-- International Draughts -->
        <div class="rule-card international" @click="selectRules('international')">
          <div class="flag">🌍</div>
          <h2>Damas Internacionais</h2>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="icon">📐</span>
              <span>Tabuleiro 10x10</span>
            </div>
            <div class="detail-item">
              <span class="icon">👑</span>
              <span>Movimentos longos</span>
            </div>
            <div class="detail-item">
              <span class="icon">✅</span>
              <span>Captura para trás</span>
            </div>
            <div class="detail-item">
              <span class="icon">🎯</span>
              <span>Captura máxima obrigatória</span>
            </div>
          </div>
          
          <button class="choose-btn">Escolher</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RulesMenu',
  emits: ['select-rules'],
  methods: {
    selectRules(ruleType) {
      this.$emit('select-rules', ruleType);
    }
  }
}
</script>

<style scoped>
.rules-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.rules-menu {
  max-width: 1200px;
  width: 100%;
}

.menu-title {
  text-align: center;
  color: white;
  font-size: 2.5em;
  margin-bottom: 40px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
}

.rule-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.rule-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  transition: all 0.3s ease;
}

.rule-card.american::before {
  background: linear-gradient(90deg, #B22234, #3C3B6E);
}

.rule-card.brazilian::before {
  background: linear-gradient(90deg, #009739, #FEDD00);
}

.rule-card.international::before {
  background: linear-gradient(90deg, #4169E1, #1E90FF);
}

.rule-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.rule-card:hover::before {
  height: 8px;
}

.flag {
  font-size: 4em;
  text-align: center;
  margin-bottom: 15px;
}

.rule-card h2 {
  text-align: center;
  color: #4a3933;
  font-size: 1.8em;
  margin-bottom: 25px;
}

.rule-details {
  margin-bottom: 25px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 1.05em;
  color: #495057;
}

.detail-item .icon {
  font-size: 1.5em;
  min-width: 30px;
  text-align: center;
}

.choose-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.3em;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.american .choose-btn {
  background: linear-gradient(135deg, #B22234, #3C3B6E);
}

.brazilian .choose-btn {
  background: linear-gradient(135deg, #009739, #FEDD00);
  color: #333;
}

.international .choose-btn {
  background: linear-gradient(135deg, #4169E1, #1E90FF);
}

.choose-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .menu-title {
    font-size: 1.8em;
  }

  .rules-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }

  .rule-card {
    padding: 20px;
  }

  .rule-card h2 {
    font-size: 1.5em;
  }

  .flag {
    font-size: 3em;
  }

  .detail-item {
    font-size: 0.95em;
  }
}
</style>
