// frontend/src/shared/di/container.ts
import { AxiosHttpClient } from '../http/AxiosHttpClient';
import { SecureStorage } from '../storage/SecureStorage';
import { SocketClient } from '../../chat/infrastructure/ws/SocketClient';

// Auth
import { AuthApi } from '../../auth/infrastructure/http/AuthApi';
import { AuthRepositoryHttp } from '../../auth/infrastructure/repositories/AuthRepositoryHttp';
import { LoginUseCase } from '../../auth/application/LoginUseCase';
import { RegisterUseCase } from '../../auth/application/RegisterUseCase';
import { GetMeUseCase } from '../../auth/application/GetMeUseCase';

// Users
import { UsersApi } from '../../users/infrastructure/http/UsersApi';
import { UserRepositoryHttp } from '../../users/infrastructure/repositories/UserRepositoryHttp';
import { ListUsersUseCase } from '../../users/application/ListUsersUseCase';

// Chat
import { ChatApi } from '../../chat/infrastructure/http/ChatApi';
import { ChatRepositoryHttp } from '../../chat/infrastructure/repositories/ChatRepositoryHttp';
import { LoadHistoryUseCase } from '../../chat/application/LoadHistoryUseCase';
import { SendMessageUseCase } from '../../chat/application/SendMessageUseCase';
import { GetConversationsUseCase } from '../../chat/application/GetConversationsUseCase';
import { UnreadCountApi } from '../../chat/infrastructure/http/UnreadCountApi';
import {
  GetUnreadCountsUseCase,
  GetTotalUnreadCountUseCase,
  MarkAsReadUseCase,
} from '../../chat/application/UnreadCountUseCases';

class DIContainer {
  // Shared
  public readonly httpClient: AxiosHttpClient;
  public readonly tokenStorage: SecureStorage;
  public readonly socketClient: SocketClient;

  // Auth
  private readonly authApi: AuthApi;
  private readonly authRepository: AuthRepositoryHttp;
  public readonly loginUseCase: LoginUseCase;
  public readonly registerUseCase: RegisterUseCase;
  public readonly getMeUseCase: GetMeUseCase;

  // Users
  private readonly usersApi: UsersApi;
  private readonly userRepository: UserRepositoryHttp;
  public readonly listUsersUseCase: ListUsersUseCase;

  // Chat
  private readonly chatApi: ChatApi;
  private readonly chatRepository: ChatRepositoryHttp;
  public readonly loadHistoryUseCase: LoadHistoryUseCase;
  public readonly sendMessageUseCase: SendMessageUseCase;
  public readonly getConversationsUseCase: GetConversationsUseCase;

  // Unread Count
  private readonly unreadCountApi: UnreadCountApi;
  public readonly getUnreadCountsUseCase: GetUnreadCountsUseCase;
  public readonly getTotalUnreadCountUseCase: GetTotalUnreadCountUseCase;
  public readonly markAsReadUseCase: MarkAsReadUseCase;

  constructor() {
    // Shared
    this.httpClient = new AxiosHttpClient();
    this.tokenStorage = new SecureStorage();
    this.socketClient = new SocketClient();

    // Configure unauthorized handler
    this.setupUnauthorizedHandler();

    // Auth
    this.authApi = new AuthApi(this.httpClient);
    this.authRepository = new AuthRepositoryHttp(this.authApi);
    this.loginUseCase = new LoginUseCase(this.authRepository);
    this.registerUseCase = new RegisterUseCase(this.authRepository);
    this.getMeUseCase = new GetMeUseCase(this.authRepository);

    // Users
    this.usersApi = new UsersApi(this.httpClient);
    this.userRepository = new UserRepositoryHttp(this.usersApi);
    this.listUsersUseCase = new ListUsersUseCase(this.userRepository);

    // Chat
    this.chatApi = new ChatApi(this.httpClient);
    this.chatRepository = new ChatRepositoryHttp(
      this.chatApi,
      this.socketClient,
    );
    this.loadHistoryUseCase = new LoadHistoryUseCase(this.chatRepository);
    this.sendMessageUseCase = new SendMessageUseCase(this.chatRepository);
    this.getConversationsUseCase = new GetConversationsUseCase(
      this.chatRepository,
    );

    // Unread Count
    this.unreadCountApi = new UnreadCountApi(this.httpClient);
    this.getUnreadCountsUseCase = new GetUnreadCountsUseCase(
      this.unreadCountApi,
    );
    this.getTotalUnreadCountUseCase = new GetTotalUnreadCountUseCase(
      this.unreadCountApi,
    );
    this.markAsReadUseCase = new MarkAsReadUseCase(this.unreadCountApi);
  }

  private setupUnauthorizedHandler(): void {
    this.httpClient.setUnauthorizedHandler(async () => {
      console.warn('Token expirado - realizando logout automático');

      try {
        // Limpar tokens
        await this.tokenStorage.clearTokens();

        // Remover token do HTTP client
        this.httpClient.setAuthToken(null);

        // Desconectar socket
        this.socketClient.disconnect();

        // Limpar todos os estados
        const {
          useAuthStore,
          useUsersStore,
          useChatStore,
          useUnreadCountStore,
        } = await import('../state/store');

        // Limpar estados
        useAuthStore.getState().clearAuth();
        useUsersStore.getState().setUsers([]);
        useUsersStore.getState().setError(null);
        useChatStore.setState({
          messages: {},
          typingUsers: new Set(),
          error: null,
        });
        useUnreadCountStore.setState({
          unreadCounts: {},
          totalCount: 0,
          isLoading: false,
        });

        console.log('Logout automático concluído - redirecionando para login');

        // Mostrar alerta de sessão expirada
        const { Alert } = await import('react-native');
        Alert.alert(
          'Sessão Expirada',
          'Sua sessão expirou. Por favor, faça login novamente.',
          [{ text: 'OK' }],
        );
      } catch (error) {
        console.error('Erro durante logout automático:', error);
      }
    });
  }
}

export const container = new DIContainer();
