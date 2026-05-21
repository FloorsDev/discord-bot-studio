# 🎮 Discord Bot Studio

> Um bot Discord profissional, completo e produção-pronto para servidores de empresas de desenvolvimento de jogos.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square)](https://nodejs.org)
[![Discord.js](https://img.shields.io/badge/Discord.js-14%2B-blue?style=flat-square)](https://discord.js.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)](https://github.com/FloorsDev/discord-bot-studio)

## 📋 Índice

- [Características](#características)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)
- [Deploy](#deploy)
- [Suporte](#suporte)

## ✨ Características

### 🛡️ Sistemas de Moderação
- Ban, Tempban, Kick, Mute, Timeout
- Sistema de avisos com histórico
- Softban, Limpeza de mensagens
- Lock/Unlock de canais
- Slowmode inteligente
- Logs detalhados
- Sistema de apelação

### 🎫 Sistema de Tickets
- Painel de tickets com botões
- Múltiplas categorias
- Claim de tickets
- Transcrições em HTML
- Estatísticas de tickets
- Auto-renomeação de canais
- Feedback integrado

### ✅ Verificação
- Verificação por botão
- Verificação por CAPTCHA
- Auto-role
- Anti-alt protection
- Verificação de idade da conta

### 👋 Sistema de Boas-vindas
- Embeds customizáveis
- Mensagens de despedida
- Cartões de boas-vindas
- Contador de membros
- Logs de entrada

### 📊 Sistema de Níveis
- Sistema de XP
- Rank cards customizáveis
- Leaderboard
- Recompensas
- XP em voz
- Anti-spam integrado

### 💰 Sistema de Economia
- Carteira e banco
- Recompensas diárias
- Shop integrado
- Inventário
- Transferência de dinheiro
- Leaderboard de economia

### 🤝 Recursos da Comunidade
- Sistema de sugestões
- Enquetes
- Giveaways
- Sistema de eventos
- Anúncios
- Reaction roles
- Starboard
- Estatísticas do servidor

### 🎮 Recursos de Studio de Jogos
- Sistema de bug reports
- Feedback do jogo
- Changelog
- Patch notes
- Gerenciamento de beta testers
- Aplicações de staff
- Aplicações de QA testers
- Painel de desenvolvedor

### 🤖 Auto Moderação
- Anti-spam
- Anti-flood
- Anti-links maliciosos
- Anti-invites
- Anti-raid
- Anti-ghost ping
- Filtro de palavras
- Detecção de toxicidade

### 🔐 Segurança
- Anti-nuke
- Proteção de roles
- Proteção de canais
- Proteção de webhooks
- Sistema de backup
- Sistema de restore
- Rastreamento de audit logs

### 🌐 Dashboard Web
- Interface moderna com Next.js
- Login com Discord OAuth2
- Painel de gerenciamento de servidor
- Painel de moderação
- Gerenciamento de tickets
- Dashboard de analytics
- Editor de configurações
- Gerenciamento de economia
- Perfis de usuários
- Estatísticas em tempo real

### 🧠 Recursos de IA
- Chatbot com IA
- Assistente de suporte
- Respostas automáticas de FAQ
- Sugestões inteligentes de moderação

## 📋 Pré-requisitos

- **Node.js**: v18.0.0 ou superior
- **npm** ou **yarn**: Gerenciador de pacotes
- **MongoDB**: Banco de dados
- **Token do Bot Discord**: Crie em [Discord Developer Portal](https://discord.com/developers/applications)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/FloorsDev/discord-bot-studio.git
cd discord-bot-studio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DISCORD_TOKEN=seu_token_do_bot
CLIENT_ID=seu_client_id
GUILD_ID=seu_guild_id
MONGODB_URI=sua_conexao_mongodb
```

### 4. Compile o TypeScript

```bash
npm run build
```

### 5. Inicie o bot

```bash
npm start
```

## ⚙️ Configuração

### Arquivo de Configuração Principal

Edite `src/config/bot.config.ts` para customizar:

```typescript
export const botConfig = {
  prefix: "!",
  language: "pt-BR",
  features: {
    leveling: true,
    economy: true,
    moderation: true,
    tickets: true,
  },
};
```

### Configurações de Banco de Dados

Todas as configurações estão em `src/config/database.config.ts`

### Configurações de API

API REST em `src/api/` com Express

## 📖 Uso

### Comandos Slash

```
/ban <usuário> [razão]
/kick <usuário> [razão]
/mute <usuário> [tempo]
/ticket criar
/economy balance
/rank
```

### Comandos com Prefixo

```
!ban @usuário razão
!kick @usuário razão
!mute @usuário tempo
!ticket
!balance
!rank
```

## 📁 Estrutura do Projeto

```
discord-bot-studio/
├── src/
│   ├── commands/              # Comandos do bot
│   │   ├── moderation/       # Comandos de moderação
│   │   ├── economy/          # Comandos de economia
│   │   ├── tickets/          # Comandos de tickets
│   │   ├── admin/            # Comandos admin
│   │   └── utility/          # Comandos utilitários
│   ├── events/               # Manipuladores de eventos
│   │   ├── client/
│   │   ├── guild/
│   │   ├── message/
│   │   └── interaction/
│   ├── handlers/             # Manipuladores
│   │   ├── commandHandler.ts
│   │   ├── eventHandler.ts
│   │   └── errorHandler.ts
│   ├── database/             # Schemas do MongoDB
│   │   ├── models/
│   │   ├── schemas/
│   │   └── connection.ts
│   ├── utils/                # Funções utilitárias
│   │   ├── logger/
│   │   ├── embedBuilder/
│   │   ├── permissions/
│   │   └── validators/
│   ├── config/               # Arquivos de configuração
│   │   ├── bot.config.ts
│   │   ├── database.config.ts
│   │   └── features.config.ts
│   ├── types/                # Tipos TypeScript
│   ├── api/                  # API REST
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── controllers/
│   └── index.ts              # Arquivo principal
├── dashboard/                # Aplicação Next.js
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── public/
├── logs/                     # Logs da aplicação
├── .env.example              # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── ecosystem.config.js       # Configuração PM2
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📚 Documentação

Para documentação detalhada, visite:

- [Documentação do Discord.js](https://discord.js.org)
- [Documentação do MongoDB](https://docs.mongodb.com)
- [Documentação do Next.js](https://nextjs.org/docs)

## 🚢 Deploy

### Com PM2

```bash
npm install -g pm2
npm run build
npm run start:pm2
```

### Com Docker

```bash
docker-compose up -d
```

### Em Produção

Veja [DEPLOYMENT.md](docs/DEPLOYMENT.md) para guia completo.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga o [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE)

## 💬 Suporte

Precisa de ajuda? Abra uma [issue](https://github.com/FloorsDev/discord-bot-studio/issues)

## 🙏 Agradecimentos

Obrigado por usar o Discord Bot Studio!

---

**Feito com ❤️ por [FloorsDev](https://github.com/FloorsDev)**
