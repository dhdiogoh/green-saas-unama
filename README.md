# Green SaaS - Unama

## Visão Geral do Projeto

O Green SaaS é uma plataforma inovadora que incentiva a reciclagem entre turmas universitárias da Unama, transformando a sustentabilidade em uma competição saudável. Através de um sistema de pontuação baseado na quantidade e tipo de material reciclado, as turmas competem entre si para alcançar o topo do ranking e contribuir para um planeta mais sustentável.

## Acesso ao Sistema

Você pode acessar o sistema diretamente pela URL:
**[https://green-saas-mvp.vercel.app/](https://green-saas-mvp.vercel.app/)**

Alternativamente, você pode clonar este repositório e executá-lo localmente seguindo as instruções de instalação abaixo.

## Credenciais de Acesso

⚠️ **IMPORTANTE**: Ao fazer login, sempre selecione a instituição **"Unama Alcindo Cacela"**, pois os usuários das outras unidades ainda serão criados.

### Conta de Instituição/Admin
- **Email**: adminalcindo@gmail.com
- **Senha**: 12345678
- **Tipo de Usuário**: Instituição
- **Instituição**: Unama Alcindo Cacela

### Conta de Aluno
- **Email**: cienciaalcindob@gmail.com
- **Senha**: 12345678
- **Tipo de Usuário**: Aluno
- **Instituição**: Unama Alcindo Cacela
- **Curso**: Ciência da Computação
- **Turma**: Turma B

## Funcionalidades

O Green SaaS oferece diferentes funcionalidades dependendo do tipo de usuário:

### Para Administradores/Instituições

1. **Dashboard Analítico**: Visualização gráfica do desempenho de reciclagem por turma, curso e unidade
2. **Registro de Entregas**: Interface para registrar novas entregas de materiais recicláveis
3. **Ranking de Turmas**: Acompanhamento do desempenho das turmas no ranking de pontuação
4. **Gerenciamento de Usuários**: Controle de usuários e permissões (em desenvolvimento)
5. **Documentação da API**: Acesso à documentação completa da API para integrações (disponível apenas para administradores)

### Para Alunos

1. **Dashboard Personalizado**: Visualização do desempenho da própria turma
2. **Ranking Geral**: Visualização da posição da turma no ranking geral
3. **Pontos de Coleta**: Mapa e informações sobre os pontos de coleta de materiais recicláveis
4. **Central de Ajuda**: Informações sobre o sistema de pontuação e funcionamento da plataforma

## Sistema de Pontuação

Cada tipo de material reciclável tem uma pontuação específica:

| Material | Pontos por kg | Impacto Ambiental |
|----------|--------------|-------------------|
| PET      | 50 pontos    | Redução de 3.0 kg de CO₂ |
| Alumínio | 80 pontos    | Economia de 5.0 kWh de energia |
| Vidro    | 30 pontos    | Redução de 0.3 kg de CO₂ |
| Papel    | 20 pontos    | Preservação de 1 árvore a cada 50kg |

## 🌿 Sobre o Assistente Virtual do Green SaaS

O **assistente virtual do Green SaaS**, chamado **Theo**, foi criado para facilitar o acesso às informações da plataforma de reciclagem universitária da **Unama**. Ele atua como um guia interativo, fornecendo respostas claras, objetivas e atualizadas sobre o funcionamento do programa.

### ✅ O que o assistente responde:

- Pontos de coleta e horários de funcionamento em cada unidade participante  
- Tipos de materiais aceitos para reciclagem e dicas de preparo  
- Sistema de pontuação por material e como maximizar os pontos  
- Localização dos pontos de coleta dentro do campus  
- Ranking das turmas e funcionamento do dashboard  
- Processo completo de entrega dos recicláveis  
- Contatos dos responsáveis por unidade  

### 💬 Como ele se comunica:

O assistente incentiva práticas sustentáveis e promove o engajamento dos alunos com **emojis temáticos** (♻️ 🌱 🌎) e mensagens motivadoras, reforçando a importância da reciclagem e da competição saudável entre turmas.


## Tecnologias Utilizadas

- **Frontend**: 
  - Next.js 13 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI
  - Recharts

- **Backend**:
  - Next.js API Routes
  - Supabase
  - PostgreSQL

- **Autenticação**:
  - Supabase Auth

- **Storage**:
  - Supabase Storage

- **Implantação**:
  - Vercel

- **ChatBot Ai**
  - ChatGPT 4o-mini API

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Passos para Instalação

1. Clone o repositório
   \`\`\`bash
   git clone https://github.com/seu-usuario/green-saas.git
   cd green-saas
   \`\`\`

2. Instale as dependências
   \`\`\`bash
   npm install
   # ou
   yarn
   \`\`\`

3. Configure as variáveis de ambiente
   Crie um arquivo `.env.local` na raiz do projeto e adicione:
   \`\`\`env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://wxmhornyflaqhzaqulml.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
   
   # Database
   POSTGRES_URL=postgresql://postgres:Greensaas2025!@db.wxmhornyflaqhzaqulml.supabase.co:5432/postgres
   \`\`\`

4. Inicie o servidor de desenvolvimento
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   \`\`\`

5. Acesse o aplicativo em `http://localhost:3000`

## API Documentation

O Green SaaS possui uma documentação de API integrada, acessível através do menu "API Docs" no dashboard. **Importante: A documentação da API está disponível apenas para usuários administradores.**

A documentação inclui:

- Listagem de todos os endpoints disponíveis
- Parâmetros aceitos por cada endpoint
- Exemplos de requisições e respostas
- Funcionalidade de teste de endpoints

### Endpoints Principais

- **POST /api/create-user**: Cria um novo usuário
- **GET /api/unidades**: Lista todas as unidades
- **GET /api/cursos**: Lista todos os cursos
- **GET /api/ranking**: Obtém o ranking de turmas
- **GET /api/entregas**: Lista as entregas de materiais
- **POST /api/entregas**: Registra nova entrega
- **GET /api/estatisticas**: Obtém estatísticas de reciclagem

## Fluxo de Trabalho

### Para Administradores

1. Acesse o sistema com suas credenciais de administrador
2. No dashboard, visualize estatísticas gerais de reciclagem
3. Para registrar uma nova entrega:
   - Acesse "Nova Entrega" no menu
   - Faça upload de uma imagem do material
   - Preencha as informações (quantidade, tipo, curso, turma)
   - Envie a entrega
4. Consulte o ranking para acompanhar o desempenho das turmas

### Para Alunos

1. Acesse o sistema com suas credenciais de aluno
2. No dashboard, visualize o desempenho da sua turma
3. Acesse "Pontos de Coleta" para encontrar locais para entregar materiais
4. Consulte o ranking para acompanhar a posição da sua turma

## Modo de Demonstração

O sistema possui um modo de demonstração que funciona mesmo sem conexão com o Supabase. Para usá-lo:

1. Utilize as credenciais de demonstração fornecidas no início deste README
2. O sistema carregará dados fictícios para demonstrar as funcionalidades
3. Note que, no modo de demonstração, as operações de escrita (como criar novos registros) não persistirão

## Contribuidores

- Equipe GreenSaaS
- Universidade da Amazônia - Unama

## Licença

© 2025 Green SaaS - Todos os direitos reservados

---
