# financeapp-frontend
Criação do frontend do projeto de aplicativo de finanças
README - Frontend (React Native)

🔮 Sistema de Controle Financeiro - App Mobile

Este é o front-end mobile da aplicação de controle financeiro, feito com React Native e Expo. Permite ao usuário controlar receitas, despesas, metas e investimentos diretamente do celular.

⚖️ Tecnologias Utilizadas

React Native

Expo

Axios

JWT-Decode

🚀 Como executar localmente

1. Requisitos:

Node.js

Expo CLI (npm install -g expo-cli)

Celular com Expo Go ou emulador Android/iOS

2. Clone o repositório:

git clone https://github.com/seuusuario/frontend-financeiro.git
cd frontend-financeiro

3. Instale as dependências:

npm install

4. Configure a URL da API:

No arquivo services/api.js, edite:

baseURL: 'http://SEU_IP:8080/api'

Substitua SEU_IP pelo IP da sua máquina visível para o celular.

5. Inicie o projeto:

npx expo start

Use o QR Code no Expo Go do seu celular para testar.

🔐 Telas principais

Login / Cadastro

Menu principal

Cadastro e listagem de receitas, despesas, metas e investimentos

Gráfico de relatórios mensais
