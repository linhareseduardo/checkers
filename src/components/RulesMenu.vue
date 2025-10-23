<template>
  <div class="rules-menu-overlay">
    <div class="rules-menu">
      <h1 class="menu-title">
        <span class="title-icon">🎯</span>
        {{ t('chooseRules') }}
        <div class="title-flags">
          <span 
            class="title-flag flag-br" 
            :class="{ 'active': currentLang === 'pt' }"
            @click="changeLang('pt')"
            title="Português"
          >PT</span>
          <span 
            class="title-flag flag-us" 
            :class="{ 'active': currentLang === 'en' }"
            @click="changeLang('en')"
            title="English"
          >EN</span>
          <span 
            class="title-flag flag-es" 
            :class="{ 'active': currentLang === 'es' }"
            @click="changeLang('es')"
            title="Español"
          >ES</span>
        </div>
      </h1>
      
      <!-- Modo de Jogo -->
      <div class="game-mode-section">
        <h2 class="section-title">{{ t('gameMode') }}</h2>
        <div class="mode-buttons">
          <button 
            class="mode-btn" 
            :class="{ 'active': gameMode === 'pvp' }"
            @click="gameMode = 'pvp'"
          >
            👥 {{ t('playerVsPlayer') }}
          </button>
          <button 
            class="mode-btn" 
            :class="{ 'active': gameMode === 'pvc' }"
            @click="gameMode = 'pvc'"
          >
            🤖 {{ t('playerVsComputer') }}
          </button>
        </div>

        <!-- Dificuldade da IA (apenas se modo PvC) -->
        <div v-if="gameMode === 'pvc'" class="ai-difficulty">
          <h3 class="difficulty-title">{{ t('aiDifficulty') }}</h3>
          <div class="difficulty-buttons">
            <button 
              class="diff-btn easy"
              :class="{ 'active': aiDifficulty === 'easy' }"
              @click="aiDifficulty = 'easy'"
            >
              😊 {{ t('easy') }}
            </button>
            <button 
              class="diff-btn medium"
              :class="{ 'active': aiDifficulty === 'medium' }"
              @click="aiDifficulty = 'medium'"
            >
              🤔 {{ t('medium') }}
            </button>
            <button 
              class="diff-btn hard"
              :class="{ 'active': aiDifficulty === 'hard' }"
              @click="aiDifficulty = 'hard'"
            >
              😈 {{ t('hard') }}
            </button>
            <button 
              class="diff-btn expert"
              :class="{ 'active': aiDifficulty === 'expert' }"
              @click="aiDifficulty = 'expert'"
            >
              🧠 {{ t('expert') }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="rules-grid">
        <!-- American Checkers -->
        <div class="rule-card american" @click="selectRules('american')">
          <div class="flag">🇺🇸</div>
          <h2>{{ t('americanCheckers') }}</h2>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="icon">📐</span>
              <span>{{ t('board') }} 8x8</span>
            </div>
            <div class="detail-item">
              <span class="icon">👑</span>
              <span>{{ t('shortMoves') }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">⭕</span>
              <span>{{ t('cannotCaptureBackwards') }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">🎯</span>
              <span>{{ t('captureFree') }}</span>
            </div>
          </div>
          
          <button class="choose-btn">{{ t('choose') }}</button>
        </div>

        <!-- Brazilian Draughts -->
        <div class="rule-card brazilian" @click="selectRules('brazilian')">
          <div class="flag">🇧🇷</div>
          <h2>{{ t('brazilianDraughts') }}</h2>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="icon">📐</span>
              <span>{{ t('board') }} 8x8</span>
            </div>
            <div class="detail-item">
              <span class="icon">👑</span>
              <span>{{ t('longMoves') }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">✅</span>
              <span>{{ t('canCaptureBackwards') }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">🎯</span>
              <span>{{ t('mustCaptureMax') }}</span>
            </div>
          </div>
          
          <button class="choose-btn">{{ t('choose') }}</button>
        </div>

        <!-- International Draughts -->
        <div class="rule-card international" @click="selectRules('international')">
          <div class="flag">🌍</div>
          <h2>{{ t('internationalDraughts') }}</h2>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="icon">📐</span>
              <span>{{ t('board') }} 10x10</span>
            </div>
            <div class="detail-item">
              <span class="icon">👑</span>
              <span>{{ t('longMoves') }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">✅</span>
              <span>{{ t('canCaptureBackwards') }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">🎯</span>
              <span>{{ t('mustCaptureMax') }}</span>
            </div>
          </div>
          
          <button class="choose-btn">{{ t('choose') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageSelector from './LanguageSelector.vue';
import { useTranslation } from '../i18n.js';

export default {
  name: 'RulesMenu',
  components: {
    LanguageSelector
  },
  props: {
    language: {
      type: String,
      default: 'pt'
    }
  },
  emits: ['select-rules', 'change-language'],
  data() {
    return {
      currentLang: this.language,
      gameMode: 'pvp', // 'pvp' ou 'pvc'
      aiDifficulty: 'medium', // 'easy', 'medium', 'hard'
      languages: [
        { code: 'pt', flag: '🇧🇷', name: 'Português' },
        { code: 'en', flag: '🇺🇸', name: 'English' },
        { code: 'es', flag: '🇪🇸', name: 'Español' }
      ]
    };
  },
  computed: {
    t() {
      const { t } = useTranslation(this.currentLang);
      return t;
    }
  },
  methods: {
    selectRules(ruleType) {
      this.$emit('select-rules', {
        ruleType,
        gameMode: this.gameMode,
        aiDifficulty: this.aiDifficulty
      });
    },
    changeLang(lang) {
      this.currentLang = lang;
      this.$emit('change-language', lang);
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
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.rules-menu {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.menu-title {
  text-align: center;
  color: white;
  font-size: 2.5em;
  margin-bottom: 30px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.title-icon {
  font-size: 1.2em;
}

.title-flags {
  display: flex;
  gap: 15px;
  font-size: 0.6em;
}

.title-flag {
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0.6;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2em;
  border: 2px solid transparent;
}

.title-flag.flag-br {
  background: linear-gradient(135deg, #009c3b 0%, #ffdf00 100%);
  color: #002776;
}

.title-flag.flag-us {
  background: linear-gradient(135deg, #b22234 0%, #3c3b6e 100%);
  color: white;
}

.title-flag.flag-es {
  background: linear-gradient(135deg, #c60b1e 0%, #ffc400 100%);
  color: #c60b1e;
}

.title-flag:hover {
  transform: scale(1.25);
  opacity: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.title-flag.active {
  opacity: 1;
  transform: scale(1.15);
  border-color: white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 4px 15px rgba(0, 0, 0, 0.3);
}

.game-mode-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.section-title {
  text-align: center;
  color: #4a3933;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.mode-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.mode-btn {
  flex: 1;
  max-width: 300px;
  padding: 15px 25px;
  font-size: 1.1em;
  font-weight: bold;
  border: 3px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #495057;
}

.mode-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.mode-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: scale(1.05);
}

.ai-difficulty {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.difficulty-title {
  text-align: center;
  color: #495057;
  font-size: 1.2em;
  margin-bottom: 15px;
}

.difficulty-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.diff-btn {
  padding: 12px 20px;
  font-size: 1em;
  font-weight: bold;
  border: 3px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  min-width: 120px;
}

.diff-btn.easy {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
}

.diff-btn.medium {
  background: linear-gradient(135deg, #f09819, #ff512f);
}

.diff-btn.hard {
  background: linear-gradient(135deg, #c31432, #240b36);
}

.diff-btn.expert {
  background: linear-gradient(135deg, #4a00e0, #8e2de2);
  border: 2px solid gold;
  animation: expertGlow 2s ease-in-out infinite;
}

@keyframes expertGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(138, 45, 226, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(138, 45, 226, 1);
  }
}

.diff-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.diff-btn.active {
  border-color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
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

  .title-flags {
    font-size: 0.5em;
    gap: 10px;
  }

  .title-flag {
    padding: 3px;
  }

  .mode-buttons {
    flex-direction: column;
  }

  .mode-btn {
    max-width: 100%;
  }

  .difficulty-buttons {
    flex-direction: column;
  }

  .diff-btn {
    width: 100%;
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
