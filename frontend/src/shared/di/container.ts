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
}

export const container = new DIContainer();
