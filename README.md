# Jogo de Damas em Vue.js

Um jogo de damas totalmente funcional desenvolvido em Vue.js 3 com Vite.

## 🎮 Funcionalidades

- ✅ Tabuleiro 8x8 interativo
- ✅ Movimentos válidos destacados
- ✅ Capturas obrigatórias
- ✅ Capturas múltiplas em sequência
- ✅ Promoção a Dama
- ✅ Detecção de vitória
- ✅ Interface responsiva
- ✅ Placar em tempo real
- ✅ Reiniciar jogo

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

O jogo estará disponível em `http://localhost:5173`

## 📦 Deploy no Netlify

### Opção 1: Deploy via Git (Recomendado)

1. Crie um repositório no GitHub e faça push do código:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

2. Acesse [netlify.com](https://netlify.com) e faça login
3. Clique em "Add new site" → "Import an existing project"
4. Conecte seu repositório do GitHub
5. As configurações serão detectadas automaticamente do `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Clique em "Deploy site"

### Opção 2: Deploy Manual via Netlify CLI

```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Build do projeto
npm run build

# Deploy
netlify deploy --prod
```

### Opção 3: Arrastar e Soltar

1. Execute `npm run build` para gerar a pasta `dist`
2. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
3. Arraste a pasta `dist` para a área de upload

## 🎯 Regras do Jogo

1. O jogador vermelho começa
2. As peças se movem diagonalmente em quadrados escuros
3. Peças normais só podem mover para frente
4. Damas (♔) podem mover em qualquer direção diagonal
5. Capturas são obrigatórias quando disponíveis
6. Capture pulando sobre a peça do oponente
7. Capturas múltiplas devem ser realizadas na mesma jogada
8. Alcance o outro lado do tabuleiro para promover sua peça a Dama
9. Vença capturando todas as peças do oponente ou bloqueando todos os movimentos

## 🛠️ Tecnologias Utilizadas

- Vue.js 3
- Vite
- JavaScript ES6+
- CSS3
- Netlify

## 📝 Estrutura do Projeto

```
checkers/
├── src/
│   ├── components/
│   │   └── CheckersBoard.vue    # Componente do tabuleiro
│   ├── game/
│   │   └── CheckersGame.js      # Lógica do jogo
│   ├── App.vue                  # Componente principal
│   ├── main.js                  # Ponto de entrada
│   └── style.css                # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml                 # Configuração do Netlify
└── README.md
```

## 🎨 Personalização

Você pode personalizar as cores do jogo editando as variáveis CSS nos componentes Vue:
- Cores do tabuleiro em `CheckersBoard.vue`
- Cores das peças e interface em `App.vue`
- Estilos globais em `style.css`

## 📄 Licença

Projeto livre para uso pessoal e educacional.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ usando Vue.js
