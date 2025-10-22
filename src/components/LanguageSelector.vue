<template>
  <div class="language-selector">
    <button 
      v-for="lang in languages" 
      :key="lang.code"
      @click="$emit('change-language', lang.code)"
      :class="{ 'active': currentLanguage === lang.code }"
      class="lang-btn"
      :title="lang.name"
    >
      {{ lang.flag }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'LanguageSelector',
  props: {
    currentLanguage: {
      type: String,
      default: 'pt'
    }
  },
  emits: ['change-language'],
  data() {
    return {
      languages: [
        { code: 'pt', flag: '🇧🇷', name: 'Português' },
        { code: 'en', flag: '🇺🇸', name: 'English' },
        { code: 'es', flag: '🇪🇸', name: 'Español' }
      ]
    };
  }
}
</script>

<style scoped>
.language-selector {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lang-btn {
  width: 45px;
  height: 45px;
  font-size: 24px;
  border: 3px solid transparent;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.lang-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea15, #764ba215);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: scale(1.15);
}

@media (max-width: 768px) {
  .lang-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
