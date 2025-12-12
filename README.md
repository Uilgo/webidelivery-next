# 🍕 WebiDelivery

**Sistema completo de cardápio digital para restaurantes e estabelecimentos de delivery**

Uma plataforma moderna que permite aos estabelecimentos criar seus cardápios digitais personalizados com URL única, gerenciar produtos, promoções e receber pedidos via WhatsApp.

---

## 🚀 Tecnologias Utilizadas

### **Stack Principal:**
- **Next.js 16** - Framework React com App Router e renderização híbrida
- **React 19** - Biblioteca de interface com Server Components
- **TypeScript** - Tipagem rigorosa (sem `any`)
- **Tailwind CSS v4** - Estilização utilitária (único CSS permitido)
- **Supabase** - Backend-as-a-Service (autenticação, banco de dados, storage)
- **Biome** - Linting e formatação ultrarrápida

### **Arquitetura:**
- **Server Components** por padrão (RSC)
- **Client Components** apenas quando necessário
- **Feature-Based Structure** - Organização modular por funcionalidade
- **App Router** - Sistema de rotas do Next.js 16
- **Supabase SSR** - Server-Side Rendering com autenticação persistente
- **Proxy.ts** - Middleware renomeado no Next.js 16

---

## 📂 Estrutura do Projeto

```
├── src/
│   ├── app/                          # App Router do Next.js 16
│   │   ├── (auth)/                  # Route Group - páginas de autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # /login
│   │   │   ├── signup/
│   │   │   │   └── page.tsx         # /signup
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx         # /forgot-password
│   │   │   └── layout.tsx           # layout específico para auth
│   │   ├── (dashboard)/             # Route Group - área administrativa/privada
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # /dashboard
│   │   │   ├── cardapio/
│   │   │   │   └── page.tsx         # /cardapio
│   │   │   ├── marketing/
│   │   │   │   └── page.tsx         # /marketing
│   │   │   ├── configuracoes/
│   │   │   │   └── page.tsx         # /configuracoes
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx         # /perfil
│   │   │   └── layout.tsx           # layout do painel com sidebar/header
│   │   ├── (public)/                # Route Group - páginas públicas
│   │   │   ├── onboarding/
│   │   │   │   └── page.tsx         # /onboarding
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # /{slug} - cardápio público
│   │   ├── api/                     # API Routes (Backend/Database integration)
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   └── cardapio/
│   │   │       └── route.ts
│   │   ├── globals.css              # estilos globais + Tailwind
│   │   ├── layout.tsx               # root layout
│   │   ├── loading.tsx              # loading UI global
│   │   ├── error.tsx                # error UI global
│   │   ├── not-found.tsx            # 404 page
│   │   └── page.tsx                 # página inicial (/)
│   │
│   ├── components/                  # componentes React organizados
│   │   ├── ui/                     # componentes base reutilizáveis
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   └── mode-toggle.tsx
│   │   ├── layout/                 # componentes de layout
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── shared/                 # componentes compartilhados entre features
│   │   │   ├── data-table.tsx
│   │   │   ├── search-input.tsx
│   │   │   └── pagination.tsx
│   │   └── providers/              # providers de contexto
│   │       ├── theme-provider.tsx
│   │       └── supabase-provider.tsx
│   │
│   ├── features/                   # NÚCLEO - Arquitetura por Features
│   │   ├── auth/                  # feature de autenticação
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── signup-form.tsx
│   │   │   │   └── forgot-password-form.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-signup.ts
│   │   │   │   └── use-auth.ts
│   │   │   ├── stores/            # stores específicas da feature (Zustand)
│   │   │   │   └── auth-store.ts
│   │   │   ├── types/             # tipos específicos da feature
│   │   │   │   ├── auth.ts
│   │   │   │   └── forms.ts
│   │   │   └── services/          # serviços de API específicos
│   │   │       └── auth-service.ts
│   │   │
│   │   ├── onboarding/            # feature de onboarding
│   │   │   ├── components/
│   │   │   │   ├── company-form.tsx
│   │   │   │   └── slug-validator.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-onboarding.ts
│   │   │   └── types/
│   │   │       └── company.ts
│   │   │
│   │   ├── cardapio/              # feature de cardápio
│   │   │   ├── components/
│   │   │   │   ├── categoria-list.tsx
│   │   │   │   ├── produto-card.tsx
│   │   │   │   ├── produto-form.tsx
│   │   │   │   └── adicional-form.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-cardapio.ts
│   │   │   │   └── use-produtos.ts
│   │   │   └── types/
│   │   │       ├── categoria.ts
│   │   │       ├── produto.ts
│   │   │       └── adicional.ts
│   │   │
│   │   ├── marketing/             # feature de marketing
│   │   │   ├── components/
│   │   │   │   ├── cupom-list.tsx
│   │   │   │   ├── cupom-form.tsx
│   │   │   │   └── banner-upload.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-cupons.ts
│   │   │   │   └── use-banners.ts
│   │   │   └── types/
│   │   │       ├── cupom.ts
│   │   │       └── banner.ts
│   │   │
│   │   ├── configuracoes/         # feature de configurações
│   │   │   ├── components/
│   │   │   │   ├── dados-empresa.tsx
│   │   │   │   ├── horarios-funcionamento.tsx
│   │   │   │   ├── metodos-pagamento.tsx
│   │   │   │   ├── frete-entrega.tsx
│   │   │   │   ├── personalizar-cardapio.tsx
│   │   │   │   └── seguranca.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-configuracoes.ts
│   │   │   └── types/
│   │   │       └── configuracoes.ts
│   │   │
│   │   ├── perfil/                # feature de perfil
│   │   │   ├── components/
│   │   │   │   ├── dados-pessoais.tsx
│   │   │   │   └── alterar-senha.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-perfil.ts
│   │   │   └── types/
│   │   │       └── perfil.ts
│   │   │
│   │   └── cardapio-publico/      # feature do cardápio público
│   │       ├── components/
│   │       │   ├── header-publico.tsx
│   │       │   ├── carrossel-banners.tsx
│   │       │   ├── menu-categorias.tsx
│   │       │   ├── produto-modal.tsx
│   │       │   ├── carrinho-flutuante.tsx
│   │       │   └── checkout-form.tsx
│   │       ├── hooks/
│   │       │   ├── use-cardapio-publico.ts
│   │       │   └── use-carrinho.ts
│   │       └── types/
│   │           ├── carrinho.ts
│   │           └── checkout.ts
│   │
│   ├── hooks/                     # hooks React compartilhados
│   │   ├── core/                 # hooks fundamentais do sistema
│   │   │   ├── use-auth.ts       # autenticação global
│   │   │   └── use-api.ts        # cliente de API
│   │   ├── ui/                   # hooks para interface e interação
│   │   │   ├── use-modal.ts      # controle de modais
│   │   │   ├── use-toast.ts      # notificações toast
│   │   │   └── use-theme-cookie.ts # gerenciamento de tema
│   │   ├── data/                 # hooks para gerenciamento de dados
│   │   │   ├── use-query.ts      # busca de dados
│   │   │   └── use-mutation.ts   # mutações de dados
│   │   └── form/                 # hooks para formulários
│   │       ├── use-form.ts       # gerenciamento de formulários
│   │       └── use-validation.ts # validação de dados
│   │
│   ├── stores/                   # gerenciamento de estado global (Zustand)
│   │   ├── auth-store.ts         # estado de autenticação
│   │   ├── user-store.ts         # dados do usuário
│   │   └── ui-store.ts           # estado da interface
│   │
│   ├── lib/                     # biblioteca de utilitários organizados
│   │   ├── core/               # configurações e funcionalidades fundamentais
│   │   │   ├── api.ts          # configuração de API cliente
│   │   │   ├── constants.ts    # constantes do sistema
│   │   │   └── config.ts       # configurações gerais
│   │   ├── auth/               # utilitários de autenticação e segurança
│   │   │   ├── auth.ts         # helpers de autenticação
│   │   │   └── session.ts      # gerenciamento de sessão
│   │   ├── validation/         # validação e sanitização
│   │   │   ├── validators.ts   # validadores customizados
│   │   │   └── schemas.ts      # schemas de validação (Zod)
│   │   ├── formatters/         # formatadores de dados
│   │   │   ├── date.ts         # formatação de datas
│   │   │   ├── currency.ts     # formatação de moeda
│   │   │   └── text.ts         # formatação de texto
│   │   ├── theme-server.ts     # utilitários de tema server-side
│   │   └── utils.ts            # utilitários diversos
│   │
│   └── types/                  # tipos TypeScript globais
│       ├── entities/          # entidades principais do sistema
│       │   ├── user.ts
│       │   ├── empresa.ts
│       │   ├── produto.ts
│       │   └── categoria.ts
│       ├── api/               # tipos para APIs
│       │   ├── requests.ts
│       │   └── responses.ts
│       └── common/            # tipos comuns reutilizáveis
│           ├── enums.ts
│           └── utilities.ts
│
├── proxy.ts                     # ⚠️ NOVO: Renomeado de middleware.ts (Next.js 16)
├── public/                      # arquivos estáticos
│   ├── images/                 # imagens do projeto
│   └── favicon.ico
├── .vscode/                     # configurações do VS Code
├── tailwind.config.ts           # configuração do Tailwind CSS v4
├── next.config.ts               # configuração principal do Next.js
├── tsconfig.json                # configuração do TypeScript
├── biome.json                   # configuração do Biome
├── .env.local                   # variáveis de ambiente locais
├── .env.example                 # template de variáveis de ambiente
└── package.json
```

---

## ✨ Funcionalidades Principais - MVP

### 🔐 **Sistema de Autenticação**
- Login e cadastro com validação rigorosa de senha (8+ chars, letra, número e caractere especial)
- Recuperação de senha via e-mail
- Navegação por rotas semânticas: `/login`, `/signup`, `/forgot-password`
- Validação de e-mail único (case-insensitive)
- Redirecionamentos automáticos baseados no status do usuário
- Server Actions para autenticação segura

### 🏢 **Onboarding de Empresa (Obrigatório)**
- Wizard obrigatório após cadastro (antes de acessar o painel)
- Cadastro completo dos dados da empresa
- Upload de logotipo (opcional)
- Endereço completo (CEP opcional)
- Validação de slug personalizado em tempo real
- Conversão automática de espaços para hífens na URL
- Validação de telefone WhatsApp brasileiro

### 📋 **Gerenciamento de Cardápio**

**4 Tabs principais:**

#### 🏷️ **Categorias**
- Cards expandíveis com prévia de produtos
- Grid responsivo de produtos dentro de cada categoria
- Botão "+ Adicionar Produto" integrado
- Drag & drop para reordenação
- Status ativo/inativo por categoria
- Contador de produtos
- Busca em tempo real

#### 🍔 **Produtos**
- Cadastro completo (nome, preço, descrição, imagem, status)
- Gestão de variações (tamanhos, sabores)
- Controle de disponibilidade
- Produtos em destaque
- Filtro por categoria

#### ➕ **Adicionais**
- Grupos de adicionais (queijo extra, molho, etc.)
- Preços individuais por adicional
- Associação com produtos

#### 📦 **Combos**
- Criação de combos promocionais
- Preço especial do combo
- Seleção de produtos inclusos

**Fluxo Integrado:**
- Navegação fluida entre tabs
- Contexto mantido entre seções
- Criação rápida de produtos a partir de categorias

### 🎯 **Marketing (MVP)**

**2 Tabs essenciais:**

#### 🎫 **Cupons**
- Criação de cupons de desconto
- Tipos: valor fixo ou percentual
- Regras básicas de uso
- Período de validade
- Contador de utilização

#### 🖼️ **Banners**
- Upload de banners promocionais
- Configuração de destinos/links
- Ordenação no carrossel
- Preview em tempo real

### ⚙️ **Configurações Completas**

**6 Tabs de configuração:**

#### 📝 **Configurações Gerais**
- Dados da empresa
- Logotipo e descrição
- WhatsApp e contatos
- Endereço completo

#### 🕐 **Horários de Funcionamento**
- Horários por dia da semana
- Horários especiais
- Feriados e eventos
- Status automático (aberto/fechado)

#### 💳 **Métodos de Pagamento**
- PIX, Dinheiro, Cartões
- Configurações personalizadas
- Ativar/desativar métodos

#### 🚚 **Frete e Entrega**
- Taxa única, por distância ou por bairro
- Cadastro de bairros/regiões
- Tempo mínimo/máximo de entrega
- Opção de retirada no local
- Frete grátis condicional

#### 🎨 **Personalizar Cardápio**
- Cores e temas visuais
- Layout do cardápio público
- Alteração de slug (com validações)

#### 🔒 **Segurança**
- Alteração de senha
- Configurações de acesso
- Logs básicos

### 👤 **Perfil do Usuário**
- Dados pessoais (nome, sobrenome, e-mail)
- Alteração de senha com validação
- Preferências de interface (dark/light mode)

### 🌐 **Cardápio Público (/{slug})**

#### **Estrutura:**
- **Header:** Logo, nome, status (aberto/fechado), "Ver Mais" (modal com detalhes)
- **Carrossel:** Banners promocionais clicáveis
- **Menu de Categorias:** Scroll horizontal, ancoragem suave
- **Filtros e Busca:** Busca por nome/descrição, ordenação, filtro por disponibilidade
- **Produtos:** Cards com foto, nome, descrição, preço
- **Modal de Produto:** Detalhes completos, variações, adicionais, quantidade
- **Carrinho Flutuante:** Resumo do pedido, aplicação de cupons
- **Checkout:** Dados do cliente, método de pagamento, envio via WhatsApp

**Totalmente responsivo (desktop, tablet e mobile)**

---

## 🛠️ Configuração e Desenvolvimento

### **Pré-requisitos:**
- Node.js 20.9.0+ (LTS)
- pnpm (gerenciador de pacotes recomendado)
- Conta no [Supabase](https://supabase.com) (gratuita)

### **Instalação:**

```bash
# Clone o repositório
git clone https://github.com/igorelias/webidelivery.git
cd webidelivery

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas credenciais do Supabase

# Execute o servidor de desenvolvimento
pnpm dev
```

### **Configuração do Supabase:**
1. Crie um projeto no [Supabase Dashboard](https://app.supabase.com)
2. Copie a URL e a chave pública do projeto
3. Configure as variáveis de ambiente no `.env`
4. Configure URLs de redirect: `http://localhost:3000/auth/confirm`
5. Execute as migrações do banco de dados (se aplicável)

### **Scripts Disponíveis:**

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Linting com Biome
pnpm format       # Formatação com Biome
```

---

## 🗺️ Mapa de Rotas

### **Rotas Públicas:**
- `/` - Redireciona para `/dashboard` (autenticado) ou `/login` (não autenticado)
- `/login` - Página de login
- `/signup` - Página de cadastro
- `/forgot-password` - Recuperação de senha
- `/{slug}` - Cardápio público do estabelecimento

### **Rotas Protegidas:**
- `/onboarding` - Wizard obrigatório de cadastro de empresa
- `/dashboard` - Dashboard principal (página inicial do painel)
- `/cardapio` - Gerenciamento do cardápio
- `/marketing` - Gestão de cupons e banners
- `/configuracoes` - Configurações completas do sistema
- `/perfil` - Dados pessoais e configurações de acesso

### **Regras de Redirecionamento:**
- Usuário não autenticado → `/login`
- Após login com `onboarding=false` → `/onboarding`
- Após completar onboarding → `/dashboard`
- E-mail já cadastrado → mensagem informativa com opções

---

## 📱 Design System

### **Breakpoints Responsivos:**
- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px
- **Mobile:** 320px - 767px

### **Layout do Painel:**
- **Menu Lateral:** Fixo 100svh, sem scroll, 4 itens principais
- **Cabeçalho:** Logo + nome, dropdown do usuário
- **Topbar:** Título dinâmico, dark/light mode, botão "Acessar Cardápio"
- **Área de Conteúdo:** Scrollável, com tabs quando aplicável

### **Tipografia:**
- **Font:** Inter (Google Fonts)
- **Tamanhos:** text-xs até text-4xl (Tailwind)

---

## 🎯 Padrões de Desenvolvimento

### **Regras Obrigatórias:**
- ✅ **TypeScript rigoroso** - Zero `any`, preferir `unknown` com type guards
- ✅ **Tailwind CSS v4 apenas** - Proibido Sass, SCSS, CSS modules
- ✅ **Server Components por padrão** - Client Components apenas quando necessário
- ✅ **Comentários em Português** - Documentação clara e objetiva
- ✅ **Princípio DRY** - Reutilização de componentes e hooks
- ✅ **Design Responsivo** - Mobile-first, depois adaptar para desktop
- ✅ **Validações rigorosas** - Server-side e client-side
- ✅ **Next.js 16 Proxy** - Usar `proxy.ts` ao invés de `middleware.ts`

---

## 🔒 Variáveis de Ambiente

```bash
# Configuração Supabase
# Obtenha suas credenciais em: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_chave_publica_anon_key_aqui

# Opcional: Service Role Key (apenas para operações server-side)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

---

## ✅ Validações do Sistema

### **Autenticação:**
- **E-mail:** Formato RFC, único, case-insensitive
- **Senha:** Mínimo 8 caracteres, 1 letra, 1 número, 1 caractere especial
- **Confirmar Senha:** Deve coincidir exatamente

### **Empresa/Onboarding:**
- **Slug:** Único, a-z, 0-9, hífen, 3-40 chars, espaço → hífen automático
- **WhatsApp:** Formato brasileiro com DDD
- **CEP:** Formato brasileiro (opcional)

### **Cardápio:**
- **Preços:** Numéricos, 2 decimais, não negativos
- **Imagens:** Limites de tamanho (5MB)
- **Horários:** Formato HH:MM, início < fim

### **Entrega:**
- **Taxas:** Valores não negativos
- **Configuração:** Por região/bairro
- **Tempos:** Mínimo e máximo válidos

---

## 📋 Status do MVP

### ✅ **Funcionalidades Implementadas:**
- [x] Sistema de autenticação completo com Server Actions
- [x] Onboarding obrigatório de empresa
- [x] Painel administrativo com menu lateral fixo (4 seções)
- [x] Gerenciamento completo de cardápio (4 tabs)
- [x] Sistema de marketing básico (cupons e banners)
- [x] Configurações completas (6 tabs)
- [x] Perfil do usuário
- [x] Cardápio público responsivo com checkout WhatsApp
- [x] Dark/light mode com persistência via cookies
- [x] Proxy.ts implementado (Next.js 16)

### 🎯 **Critérios de Aceitação:**
- [x] Proteção de rotas e redirecionamentos funcionando
- [x] Validações client-side e server-side
- [x] Slug único com validação em tempo real
- [x] Integração entre tabs do cardápio
- [x] Estados de loading, vazio e erro
- [x] Dark/light mode persistente via cookies
- [x] Design responsivo (desktop, tablet e mobile)
- [x] Server Components + Client Components otimizados

### 🎯 **Metas de Performance:**
- [x] Lighthouse Score > 90
- [x] LCP < 2.5s
- [x] Next.js Image otimizado
- [x] Server Components implementados
- [x] Lazy loading configurado

---

## 🔧 Tecnologias Específicas

### **Next.js 16 Features:**
- **App Router** com Route Groups
- **Server Components** por padrão
- **Server Actions** para mutações
- **Proxy.ts** (renomeado de middleware.ts)
- **React 19** com novos hooks
- **Async Request APIs** (cookies, headers, params)

### **Tailwind CSS v4:**
- **CSS-in-JS** nativo
- **Configuração simplificada**
- **Performance otimizada**
- **Compatibilidade com Biome**

### **Biome:**
- **Linting ultrarrápido** (substitui ESLint)
- **Formatação** (substitui Prettier)
- **Configuração unificada**
- **Performance superior**

---

## 📄 Licença e Copyright

**Copyright © 2025 Igor Elias**

Este código é disponibilizado exclusivamente para fins de **portfólio** e **demonstração profissional**.

### 🚫 **Restrições de Uso**
- É **expressamente proibido** copiar, usar, modificar, distribuir ou vender este código sem autorização
- O acesso público tem apenas objetivo de **visualização do trabalho** por recrutadores
- **Nenhum direito de uso** é concedido além da visualização
- Este projeto é **protegido por direitos autorais**

### 📞 **Contato**

**Desenvolvedor:** Igor Elias  
**LinkedIn:** https://www.linkedin.com/in/igor-elias-de-lima/  
**Domínio:** www.webidelivery.com.br

### ⚖️ **Aviso Legal**

O uso não autorizado deste código pode resultar em ações legais. Este projeto serve como **demonstração de habilidades técnicas** e implementação completa de um MVP profissional usando as mais modernas tecnologias React/Next.js.