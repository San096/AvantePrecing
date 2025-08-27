# 🚀 Avante Precificação

Sistema web para **gestão de clientes, precificação de serviços e geração de orçamentos em PDF**, desenvolvido para a **AvanteTech Jr.**.  

O sistema permite cadastrar clientes, criar novas precificações com base em tempo/hora, adicionar procedimentos e gerar orçamentos detalhados em PDF, já com a identidade da empresa.  

---

## ✨ Funcionalidades

- 🔐 **Login/Logout com Firebase Auth**
- 👥 **Cadastro e listagem de clientes**
- 📝 **Criação de precificações**
  - Descrição do problema
  - Dados do equipamento (nome, marca, modelo)
  - Quantidade de desenvolvedores, dias úteis, horas/dia e valor da hora
  - Procedimentos com cronograma (nome e dias de execução)
- 📊 **Cálculo automático**
  - Total de horas
  - Custo total
- 📄 **Geração de PDF personalizado**
  - Logo da AvanteTech Jr.
  - Dados da empresa (fixos)
  - Dados do cliente
  - Precificação detalhada
  - Procedimentos & cronograma
  - Campo para assinatura do Diretor Financeiro
- 🌐 **Hospedagem no Vercel**

---

## 🛠️ Tecnologias

- [React 19](https://react.dev/)  
- [React Router](https://reactrouter.com/)  
- [TailwindCSS](https://tailwindcss.com/)  
- [Firebase (Auth + Firestore)](https://firebase.google.com/)  
- [jsPDF](https://github.com/parallax/jsPDF)  
- [html2canvas](https://html2canvas.hertzen.com/)  
- [Vercel](https://vercel.com/) (deploy)  

---

## 📂 Estrutura do Projeto
src/
├── assets/ # Logo e imagens
├── components/ # Header, Footer, Firebase config
├── pages/ # Páginas principais
│ ├── Login.jsx
│ ├── Clients.jsx
│ ├── NewClient.jsx
│ ├── Pricings.jsx
│ ├── NewPricing.jsx
│ ├── PricingReview.jsx
│ └── PricingDetail.jsx
└── App.jsx # Rotas principais

## ⚙️ Como rodar localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/avante-precificacao.git
   cd avante-precificacao

   
Instale as dependências

npm install
Configure o Firebase

Crie um projeto no Firebase Console

Ative Authentication (Email/Password)

Ative Firestore Database

Copie suas credenciais no arquivo src/components/firebase.js


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
Execute o projeto


npm run dev

Próximos Passos

🔎 Melhorar visualização dos relatórios

📊 Dashboard com estatísticas de precificação

📨 Enviar PDF por e-mail diretamente

👥 Controle de usuários com diferentes permissões





