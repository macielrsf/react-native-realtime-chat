// frontend/src/shared/state/store.ts
import { create } from 'zustand';
import { User } from '../../auth/domain/entities/User';
import { UserSummary } from '../../users/domain/entities/UserSummary';
import { Message } from '../../chat/domain/entities/Message';

// Auth State
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: user => set({ user, isAuthenticated: true }),
  setTokens: (token, refreshToken) => set({ token, refreshToken }),
  clearAuth: () =>
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
}));

// Users State
interface UsersState {
  users: UserSummary[];
  isLoading: boolean;
  error: string | null;

  setUsers: (users: UserSummary[]) => void;
  updateUserOnlineStatus: (userId: string, online: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUsersStore = create<UsersState>(set => ({
  users: [],
  isLoading: false,
  error: null,

  setUsers: users => set({ users }),
  updateUserOnlineStatus: (userId, online) =>
    set(state => ({
      users: state.users.map(user =>
        user.id === userId ? UserSummary.create({ ...user, online }) : user,
      ),
    })),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
}));

// Chat State
interface ChatState {
  messages: Record<string, Message[]>;
  typingUsers: Set<string>;
  isLoading: boolean;
  error: string | null;

  setMessages: (userId: string, messages: Message[]) => void;
  addMessage: (userId: string, message: Message) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>(set => ({
  messages: {},
  typingUsers: new Set(),
  isLoading: false,
  error: null,

  setMessages: (userId, messages) =>
    set(state => ({
      messages: { ...state.messages, [userId]: messages },
    })),
  addMessage: (userId, message) =>
    set(state => ({
      messages: {
        ...state.messages,
        [userId]: [...(state.messages[userId] || []), message],
      },
    })),
  setTyping: (userId, isTyping) =>
    set(state => {
      const newTypingUsers = new Set(state.typingUsers);
      if (isTyping) {
        newTypingUsers.add(userId);
      } else {
        newTypingUsers.delete(userId);
      }
      return { typingUsers: newTypingUsers };
    }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
}));

// Unread Count State
interface UnreadCountState {
  unreadCounts: Record<string, number>;
  totalCount: number;
  isLoading: boolean;

  setUnreadCounts: (
    counts: Array<{ conversationWith: string; count: number }>,
  ) => void;
  updateUnreadCount: (userId: string, count: number) => void;
  incrementUnreadCount: (userId: string) => void;
  markAsRead: (userId: string) => void;
  setTotalCount: (total: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useUnreadCountStore = create<UnreadCountState>(set => ({
  unreadCounts: {},
  totalCount: 0,
  isLoading: false,

  setUnreadCounts: counts =>
    set(_state => {
      const newCounts: Record<string, number> = {};
      let total = 0;

      counts.forEach(item => {
        newCounts[item.conversationWith] = item.count;
        total += item.count;
      });

      return {
        unreadCounts: newCounts,
        totalCount: total,
      };
    }),

  updateUnreadCount: (userId, count) =>
    set(state => {
      const oldCount = state.unreadCounts[userId] || 0;
      const difference = count - oldCount;

      return {
        unreadCounts: { ...state.unreadCounts, [userId]: count },
        totalCount: Math.max(0, state.totalCount + difference),
      };
    }),

  incrementUnreadCount: userId =>
    set(state => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
      totalCount: state.totalCount + 1,
    })),

  markAsRead: userId =>
    set(state => {
      const currentCount = state.unreadCounts[userId] || 0;
      return {
        unreadCounts: { ...state.unreadCounts, [userId]: 0 },
        totalCount: Math.max(0, state.totalCount - currentCount),
      };
    }),

  setTotalCount: total => set({ totalCount: total }),
  setLoading: isLoading => set({ isLoading }),
}));
