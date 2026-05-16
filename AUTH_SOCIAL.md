# 🔐 Guia de Configuração: Login via Google e GitHub (Nexion)

Este documento descreve os passos necessários para habilitar a autenticação social no Nexion. Como este processo envolve a criação de credenciais em plataformas externas, você precisará realizar algumas etapas manualmente.

---

## 🚀 1. Configuração no GitHub

1. Acesse **GitHub > Settings > Developer Settings > OAuth Apps**.
2. Clique em **New OAuth App**.
3. Preencha os dados:
   - **Application Name**: `Nexion`
   - **Homepage URL**: `http://localhost:3000` (ou sua URL de produção)
   - **Authorization callback URL**: Pegue esta URL no seu painel do Supabase em:
     `Authentication > Providers > GitHub`. Ela será algo como: `https://vopzjcybcxongtwmvhqj.supabase.co/auth/v1/callback`
4. Clique em **Register application**.
5. Gere um **Client Secret**.
6. **Ação para você**: Copie o `Client ID` e o `Client Secret` e cole-os no painel do Supabase (**Authentication > Providers > GitHub**).

---

## 🌐 2. Configuração no Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto chamado `Nexion`.
3. Vá em **APIs & Services > OAuth consent screen**.
   - Escolha **External**.
   - Preencha o nome do app e email de suporte.
4. Vá em **Credentials > Create Credentials > OAuth client ID**.
   - **Application type**: Web application.
   - **Authorized redirect URIs**: Pegue no painel do Supabase em `Authentication > Providers > Google`.
5. **Ação para você**: Copie o `Client ID` e o `Client Secret` e cole-os no painel do Supabase.

---

## 🛠️ 3. O que eu (Gemini) farei no Código

Assim que você configurar os provedores no painel do Supabase, eu implementarei a seguinte lógica automática:

### A. Fluxo de Callback
Criarei uma rota `/auth/callback` que intercepta o retorno do Google/GitHub, troca o código temporário por uma sessão e verifica se o usuário é novo.

### B. Fluxo de Onboarding (Obrigatório)
Como o Nexion exige um `nickname` único:
1. O usuário faz login via Google/GitHub.
2. O sistema verifica se já existe um registro na tabela `profiles` para aquele ID.
3. Se **não existir**: Redirecionaremos o usuário para uma tela especial `/onboarding` onde ele **deve** escolher um nickname antes de continuar.
4. Se **já existir**: Ele vai direto para o Dashboard.

### C. Atualização dos Botões
Ativarei os botões de "Google" e "GitHub" nas telas de Login e Cadastro para disparar a função:
```typescript
supabase.auth.signInWithOAuth({
  provider: 'google', // ou 'github'
  options: { redirectTo: `${origin}/auth/callback` }
})
```

---

## ✅ Próximos Passos
1. Realize as configurações nos painéis do **GitHub** e **Google**.
2. Cole as credenciais no painel do **Supabase**.
3. **Me avise aqui quando terminar**, dizendo: *"Credenciais configuradas no Supabase"*.
4. Assim que você avisar, eu criarei a rota de callback, a tela de onboarding e ativarei os botões!
