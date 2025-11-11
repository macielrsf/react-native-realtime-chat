# Como Funciona o Auto-Login com Keychain

## 🔐 Resumo

**SIM**, o `isAuthenticated` é restaurado do **react-native-keychain** ao abrir o app!

Quando você **mata o app e abre novamente**, o seguinte acontece:

```
App Start
    ↓
AuthProvider monta
    ↓
restoreSession() executa
    ↓
SecureStorage.getToken() → react-native-keychain
    ↓
Token existe?
    ├── ❌ Não → isAuthenticated = false → Login Screen
    └── ✅ Sim
         ↓
    GET /api/auth/me (valida token)
         ↓
    Token válido?
         ├── ❌ Não → clearAuth() → Login Screen
         └── ✅ Sim
              ↓
         setUser(user) → isAuthenticated = true
              ↓
         Users Screen ✅
```

---

## 🏗️ Arquitetura

### 1. Keychain (Persistência)

**Arquivo:** `frontend/src/shared/storage/SecureStorage.ts`

```typescript
import * as Keychain from 'react-native-keychain';

async getToken(): Promise<string | null> {
  const result = await Keychain.getGenericPassword({
    service: 'rn-chat-app',
  });

  if (!result) return null;

  const credentials = JSON.parse(result.password);
  return credentials.accessToken; // ← Token persiste FORA da memória
}
```

**Características:**

- ✅ **Persistente:** Sobrevive a restarts do app
- ✅ **Criptografado:** iOS Keychain / Android Keystore
- ✅ **Seguro:** Não incluído em backups
- ✅ **Isolado:** Por app (não acessível por outros apps)

---

### 2. Zustand Store (Estado em Memória)

**Arquivo:** `frontend/src/shared/state/store.ts`

```typescript
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false, // ← PERDIDO ao fechar app
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
```

**Características:**

- ❌ **Volátil:** Resetado quando app fecha
- ✅ **Rápido:** Estado global reativo
- ✅ **Temporário:** Válido durante sessão ativa

---

### 3. AuthProvider (Inicialização)

**Arquivo:** `frontend/src/core/presentation/navigation/AuthProvider.tsx`

```typescript
export const AuthProvider: React.FC = ({ children }) => {
  const { restoreSession } = useAuthViewModel();

  useEffect(() => {
    restoreSession(); // ← Executa SEMPRE ao abrir app
  }, [restoreSession]);

  return <>{children}</>;
};
```

**Responsabilidade:**

- ✅ Garante `restoreSession()` execute **antes** da navegação
- ✅ Reconstrói estado do Zustand a partir do Keychain
- ✅ Executa UMA VEZ ao montar o app

---

### 4. Navigation (Condicional)

**Arquivo:** `frontend/src/core/presentation/navigation/index.tsx`

```typescript
export const Navigation: React.FC = () => {
  return (
    <AuthProvider>
      {" "}
      {/* ← Executa restoreSession() primeiro */}
      <AppNavigator />
    </AuthProvider>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Loading />; // Durante restoreSession()

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" />
      ) : (
        <>
          <Stack.Screen name="Users" /> {/* ← Abre aqui se token válido */}
          <Stack.Screen name="Chat" />
        </>
      )}
    </Stack.Navigator>
  );
};
```

---

## 🔄 Fluxo Completo: Mata App → Reabre

### Passo a Passo Detalhado:

1. **Você faz login com alice/password123**

   ```
   LoginUseCase.execute()
       ↓
   Backend retorna { token: "jwt...", user: {...} }
       ↓
   SecureStorage.saveToken(token) → Keychain ✅ (persiste!)
   setUser(user) → Zustand (isAuthenticated = true)
       ↓
   Navigation → Users Screen
   ```

2. **Você mata o app (force quit)**

   ```
   App fecha
       ↓
   Zustand store é DESTRUÍDO (memória limpa)
       ↓
   isAuthenticated = false (perdido)
       ↓
   MAS: Token AINDA ESTÁ NO KEYCHAIN ✅
   ```

3. **Você reabre o app**
   ```
   App Start
       ↓
   AuthProvider monta
       ↓
   useEffect(() => restoreSession())
       ↓
   SecureStorage.getToken() → Keychain
       ↓
   Token encontrado: "jwt..." ✅
       ↓
   HttpClient.setAuthToken(token)
       ↓
   GET /api/auth/me
       ↓
   Backend responde: { user: { id: "1", name: "Alice Smith" } }
       ↓
   setUser(user) → Zustand RECONSTRUÍDO
       ↓
   isAuthenticated = true ✅
       ↓
   Navigation detecta mudança
       ↓
   Users Screen exibido! 🎉
   ```

---

## 📊 Comparação: Antes vs Depois

| Momento                | Zustand (Memória)                          | Keychain (Disco) | Tela Exibida      |
| ---------------------- | ------------------------------------------ | ---------------- | ----------------- |
| **Login**              | isAuthenticated=true ✅                    | token salvo ✅   | Users             |
| **Usando app**         | isAuthenticated=true ✅                    | token salvo ✅   | Users/Chat        |
| **Mata app**           | RESETADO ❌                                | token salvo ✅   | -                 |
| **Reabre app (ANTES)** | isAuthenticated=false ❌                   | token salvo ✅   | Login (ruim!)     |
| **Reabre app (AGORA)** | restoreSession() → isAuthenticated=true ✅ | token salvo ✅   | Users (ótimo!) ✅ |

---

## 🧪 Prova de Conceito

### Teste 1: Token Salvo no Keychain

```typescript
// Após login, verifique:
const token = await Keychain.getGenericPassword({ service: "rn-chat-app" });
console.log(token);
// {
//   username: 'auth',
//   password: '{"accessToken":"eyJ...","refreshToken":"eyJ..."}'
// }
```

### Teste 2: Zustand Resetado Após Restart

```typescript
// Antes de fechar app:
const { isAuthenticated } = useAuthStore.getState();
console.log(isAuthenticated); // true ✅

// FECHA E REABRE APP

// Imediatamente ao reabrir (ANTES de restoreSession):
const { isAuthenticated } = useAuthStore.getState();
console.log(isAuthenticated); // false ❌ (memória limpa)

// APÓS restoreSession() (1-2 segundos):
const { isAuthenticated } = useAuthStore.getState();
console.log(isAuthenticated); // true ✅ (restaurado do keychain!)
```

---

## 🎯 Por Que Funciona?

### 1. AuthProvider Garante Inicialização

```tsx
<Navigation>
  <AuthProvider>
    {" "}
    {/* Executa PRIMEIRO */}
    <AppNavigator>
      {" "}
      {/* Renderiza DEPOIS */}
      {isAuthenticated ? <Users /> : <Login />}
    </AppNavigator>
  </AuthProvider>
</Navigation>
```

**Ordem de execução:**

1. `AuthProvider` monta
2. `useEffect(() => restoreSession())` executa
3. `isLoading = true` (Loading Screen)
4. Token recuperado do Keychain
5. `/api/auth/me` valida token
6. `setUser()` → `isAuthenticated = true`
7. `isLoading = false`
8. `AppNavigator` renderiza com `isAuthenticated = true`
9. **Users Screen exibido!** ✅

---

### 2. Keychain É Independente da Memória

```
┌─────────────────────────────────────┐
│         Memória (RAM)               │
│  ┌──────────────────────────────┐   │
│  │   Zustand Store              │   │
│  │   isAuthenticated: false     │   │ ← Resetado ao fechar
│  │   user: null                 │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Disco (Keychain/Keystore)       │
│  ┌──────────────────────────────┐   │
│  │   service: 'rn-chat-app'     │   │
│  │   accessToken: "eyJ..."      │   │ ← PERSISTE!
│  │   refreshToken: "eyJ..."     │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔒 Segurança

### iOS Keychain

- **Localização:** `/private/var/Keychains/keychain-2.db` (criptografado)
- **Acesso:** Apenas o app com mesmo bundle ID
- **Criptografia:** AES-256-GCM via Secure Enclave
- **Proteção:** `ACCESSIBLE.WHEN_UNLOCKED` (só quando desbloqueado)

### Android Keystore

- **Localização:** Sistema (abstrato)
- **Acesso:** Apenas o app com mesmo package name
- **Criptografia:** RSA/AES via TEE (Trusted Execution Environment)
- **Proteção:** Hardware-backed quando disponível

---

## 🐛 Troubleshooting

### "Abre no Login mesmo após ter logado"

**Causa:** `restoreSession()` não está executando

**Solução:**

```bash
# Verifique os logs:
console.log('AuthProvider montou');
console.log('restoreSession() executando...');
console.log('Token encontrado:', !!token);
```

### "Loading infinito"

**Causa:** Backend não está respondendo `/api/auth/me`

**Solução:**

```bash
# Verifique se backend está rodando:
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

### "Token existe mas abre no Login"

**Causa:** Token expirado (15 min por padrão)

**Solução:**

```typescript
// Em restoreSession(), se token inválido:
catch (err) {
  console.error('Token inválido:', err);
  await clearTokens(); // Limpa keychain
  clearAuth(); // Reseta Zustand
}
```

---

## ✅ Resultado Final

**SIM, funciona com Keychain!**

Quando você:

1. ✅ Faz login
2. ✅ Mata o app (force quit)
3. ✅ Reabre

O app:

1. ✅ Recupera token do **Keychain** (não do Zustand)
2. ✅ Valida com backend
3. ✅ Reconstrói estado do **Zustand**
4. ✅ Abre direto na **Users Screen**

**Você não precisa fazer login novamente!** 🎉
