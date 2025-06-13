# Energy Savings Simulator

## Descrição do Projeto
Este projeto é um simulador de economia de energia fullstack desenvolvido com Next.js, TypeScript, Tailwind CSS e PostgreSQL. Ele permite que os usuários simulem a economia de energia com base em seus dados de consumo, capture leads e armazene essas informações em um banco de dados.

## Funcionalidades Principais
- **Simulação de Economia de Energia**: Os usuários podem inserir seus dados de consumo (valor mensal da conta, cidade, estado, tipo de fornecimento) para calcular a economia de energia potencial ao longo de 1, 3 e 5 anos.
- **Captura de Leads**: Os dados dos usuários (nome, e-mail, telefone, CPF) são capturados e associados à simulação realizada.
- **Armazenamento de Dados**: Todas as simulações e dados de leads são armazenados em um banco de dados PostgreSQL.
- **Área Administrativa**: Uma interface de administração protegida por login permite visualizar e gerenciar a lista de leads, incluindo busca e ordenação.

## Stack Tecnológica
- **Framework**: Next.js
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **Estilização**: Tailwind CSS

## Instruções para Execução da Aplicação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker (para executar o PostgreSQL localmente)

### 1. Clonar o Repositório
```bash
git clone https://github.com/AnaTPaula/energy-savings-simulator.git
cd energy-savings-simulator
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

```
# Configurações do Banco de Dados PostgreSQL
PGUSER=user
PGHOST=localhost
PGDATABASE=energy_savings_db
PGPASSWORD=password
PGPORT=5432

# Chave Secreta para JWT (apenas para ambiente de desenvolvimento/teste)
JWT_SECRET=sua_chave_secreta_aqui_para_jwt
```
**Certifique-se de usar uma chave secreta forte para JWT em produção.**

### 3. Iniciar o Banco de Dados (com Docker)
Certifique-se de que o Docker esteja em execução. O projeto inclui um arquivo `docker-compose.yml` para iniciar o contêiner PostgreSQL.
```bash
docker-compose up -d db
```
Isso iniciará o contêiner do PostgreSQL em segundo plano.

### 4. Inicializar o Banco de Dados
O script `init.sql` é executado automaticamente quando o contêiner do PostgreSQL é iniciado via `docker-compose up -d db`, garantindo que as tabelas necessárias sejam criadas.

**Usuário Administrador Padrão:** O script `init.sql` também cria um usuário administrador padrão para acesso à área administrativa.
- **Email:** `admin@admin.com`
- **Senha:** `123`
Recomenda-se alterar essas credenciais após o primeiro login em um ambiente de produção.

### 5. Instalar Dependências
```bash
npm install
# ou
yarn install
```

### 6. Rodar a Aplicação
```bash
npm run dev
# ou
yarn dev
```
A aplicação estará disponível em `http://localhost:3000`.

## Instruções para Execução dos Testes Unitários

Para rodar os testes unitários do projeto, utilize o seguinte comando:

```bash
npm test
# ou
yarn test
```
Isso executará todos os testes unitários definidos no diretório `__tests__/`.