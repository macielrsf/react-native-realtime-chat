# Guia de Testes - Frontend

Este documento descreve a estrutura de testes do projeto e como executá-los.

## Estrutura de Testes

### Testes Unitários (`__tests__/unit/`)

Testam unidades isoladas de código (entidades, value objects, use cases).

**Arquivos:**

- `Message.test.ts` - Testa a entidade Message
- `Username.test.ts` - Testa o value object Username
- `SendMessageUseCase.test.ts` - Testa o caso de uso de enviar mensagens
- `LoadHistoryUseCase.test.ts` - Testa o caso de uso de carregar histórico
- `ListUsersUseCase.test.ts` - Testa o caso de uso de listar usuários

### Testes de Integração (`__tests__/integration/`)

Testam componentes React com React Native Testing Library (RNTL).

**Arquivos:**

- `MessageBubble.test.tsx` - Testa o componente de bolha de mensagem
- `ChatInput.test.tsx` - Testa o componente de input de chat
- `MessageStatus.test.tsx` - Testa o componente de status de mensagem
- `LoginScreen.test.tsx` - Testa a tela de login
- `UsersScreen.test.tsx` - Testa a tela de usuários

### Testes E2E (`e2e/`)

Testam fluxos completos da aplicação com Detox.

**Arquivos:**

- `login.e2e.ts` - Testa fluxo de login, mudança de tema e idioma
- `chat.e2e.ts` - Testa fluxo de chat, envio de mensagens e retry

## Como Executar

### Pré-requisitos

```bash
# Instalar dependências
npm install
```

### Testes Unitários

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar teste específico
npm test -- __tests__/unit/Message.test.ts

# Com watch mode
npm test -- --watch __tests__/unit
```

### Testes de Integração

```bash
# Executar todos os testes de integração
npm run test:integration

# Executar teste específico
npm test -- __tests__/integration/LoginScreen.test.tsx
```

### Todos os Testes (Jest)

```bash
# Executar todos os testes
npm test

# Com cobertura
npm run test:coverage
```

### Testes E2E (Detox)

#### iOS

```bash
# 1. Build do app
npm run test:e2e:build:ios

# 2. Executar testes
npm run test:e2e:ios

# Executar teste específico
detox test --configuration ios.sim.debug e2e/login.e2e.ts
```

#### Android

```bash
# 1. Iniciar emulador
# Verifique o nome do AVD com: emulator -list-avds

# 2. Build do app
npm run test:e2e:build:android

# 3. Executar testes
npm run test:e2e:android

# Executar teste específico
detox test --configuration android.emu.debug e2e/chat.e2e.ts
```

## Configurações

### Jest (`jest.config.js`)

- Preset: `react-native`
- Setup: `__tests__/setup.ts`
- Coverage threshold: 70%
- Ignora: `node_modules`, arquivos de tipagem

### Detox (`.detoxrc.js`)

- Configurações para iOS (simulador iPhone 15)
- Configurações para Android (emulador Pixel 3a API 34)
- Timeout: 120 segundos

## Mocks

Os seguintes módulos são mockados automaticamente no `__tests__/setup.ts`:

- `@react-native-async-storage/async-storage`
- `react-native-keychain`
- `socket.io-client`

## Boas Práticas

### Testes Unitários

- Use mocks para dependências externas
- Teste casos de sucesso e erro
- Teste validações e edge cases

### Testes de Integração

- Envolva componentes com ThemeProvider e LanguageProvider
- Teste interações do usuário (tap, change text)
- Verifique elementos visíveis e estados

### Testes E2E

- Use testIDs para elementos críticos
- Teste fluxos completos do usuário
- Simule condições de rede (offline/online)
- Use waits apropriados para operações assíncronas

## Cobertura de Testes

Execute para ver relatório de cobertura:

```bash
npm run test:coverage
```

Metas de cobertura:

- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

## Troubleshooting

### Testes Jest falhando

- Limpe cache: `npx jest --clearCache`
- Verifique mocks em `__tests__/setup.ts`

### Testes Detox falhando

- Verifique se o simulador/emulador está rodando
- Rebuild: `npm run test:e2e:build:ios` ou `npm run test:e2e:build:android`
- Verifique logs: `detox test --loglevel trace`

### Elementos não encontrados (Detox)

- Adicione `testID` aos componentes
- Use `by.text()` para textos visíveis
- Aumente timeout se necessário

## Adicionando Novos Testes

### Teste Unitário

```typescript
// __tests__/unit/MyEntity.test.ts
describe('MyEntity', () => {
  it('should do something', () => {
    // Arrange
    const entity = new MyEntity();

    // Act
    const result = entity.doSomething();

    // Assert
    expect(result).toBe(expected);
  });
});
```

### Teste de Integração

```tsx
// __tests__/integration/MyComponent.test.tsx
import { render, fireEvent } from '@testing-library/react-native';

const renderWithProviders = component => {
  return render(
    <LanguageProvider>
      <ThemeProvider>{component}</ThemeProvider>
    </LanguageProvider>,
  );
};

describe('MyComponent', () => {
  it('should render', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### Teste E2E

```typescript
// e2e/myflow.e2e.ts
describe('My Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete flow', async () => {
    await element(by.id('my-button')).tap();
    await expect(element(by.text('Success'))).toBeVisible();
  });
});
```
