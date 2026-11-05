# Task App

Aplicativo mobile desenvolvido com Expo e React Native para autenticação de usuários e gerenciamento de computadores emprestados.

## Funcionalidades

- Login de usuários.
- Cadastro de novos usuários.
- Persistência segura do token e dos dados do usuário com `expo-secure-store`.
- Validação de sessão.
- Registro de computadores por número de patrimônio.
- Listagem de computadores disponíveis.
- Retirada de computadores.
- Devolução de empréstimos ativos.
- Encerramento de sessão.
- Interface de tarefas demonstrativa com dados mockados.

## Tecnologias

- React Native
- Expo
- React Navigation
- Expo SecureStore
- JavaScript

## Pré-requisitos

- Node.js instalado.
- npm instalado.
- Expo CLI/Expo Go ou um emulador Android/iOS configurado.
- API do projeto em execução.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd Task_app
npm install
```

Inicie o projeto:

```bash
npm start
```

Também é possível iniciar diretamente em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

## Configuração da API

A URL da API está definida em `src/services/api.js`:

```javascript
export const API_URL = "http://10.0.2.2:8000/api";
```

O endereço `10.0.2.2` é utilizado pelo emulador Android para acessar o `localhost` da máquina de desenvolvimento. Caso o aplicativo seja executado em um dispositivo físico, substitua pelo endereço IP local do computador que hospeda a API.

Exemplo:

```javascript
export const API_URL = "http://192.168.0.10:8000/api";
```

## Rotas utilizadas

```txt
POST /api/login
POST /api/cadastro_usuario
GET  /api/token/validate
GET  /api/computadores
POST /api/computadores
POST /api/emprestimos
GET  /api/emprestimos/ativos
POST /api/emprestimos/{emprestimoId}/devolver
POST /api/logout
```

As rotas autenticadas utilizam o token da sessão. O cliente envia o token como Bearer token e o converte para o cookie esperado pela API:

```http
Authorization: Bearer {token}
```

Para listar apenas computadores disponíveis:

```txt
GET /api/computadores?status=disponivel
```

## Estrutura principal

```txt
.
├── App.js
├── app.json
├── index.js
├── package.json
├── assets/
└── src/
    ├── routers/
    │   └── route.js
    ├── screens/
    │   ├── splash.js
    │   ├── login.js
    │   ├── cadastro_user.js
    │   ├── home.js
    │   ├── cadastro_computador.js
    │   ├── emprestimos.js
    │   ├── tarefas.js
    │   └── edita_tarefa.js
    └── services/
        └── api.js
```

## Fluxo de autenticação

1. A tela inicial verifica se existe um token salvo.
2. O token é validado pela rota `/api/token/validate`.
3. Usuários autenticados são direcionados para a tela principal.
4. Usuários sem sessão ou com token inválido são direcionados para o login.
5. Ao sair, o token e os dados locais do usuário são removidos.

## Observações

- A tela de tarefas atualmente utiliza dados mockados e não possui integração com a API.
- O backend precisa estar acessível pelo dispositivo ou emulador utilizado.
- As credenciais e tokens não devem ser incluídos no repositório.

## Scripts disponíveis

```bash
npm start       # Inicia o servidor de desenvolvimento Expo
npm run android # Abre o projeto no Android
npm run ios     # Abre o projeto no iOS
npm run web     # Abre o projeto na web
```

## Licença

Este projeto não possui uma licença definida atualmente.
