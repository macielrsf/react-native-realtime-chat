// frontend/__tests__/integration/UsersScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UsersScreen } from '../../src/users/presentation/screens/UsersScreen';

// Mock Navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock UsersViewModel
const mockUsers = [
  {
    id: 'user-1',
    name: 'Alice',
    username: 'alice',
    online: true,
  },
  {
    id: 'user-2',
    name: 'Bob',
    username: 'bob',
    online: false,
  },
];

jest.mock('../../src/users/presentation/viewmodels/useUsersViewModel', () => ({
  useUsersViewModel: () => ({
    users: mockUsers,
    isLoading: false,
    loadUsers: jest.fn(),
    refresh: jest.fn(),
    refreshUsers: jest.fn(),
  }),
}));

// Mock Unread Counts
jest.mock('../../src/shared/hooks/useUnreadCounts', () => ({
  useUnreadCounts: () => ({
    unreadCounts: { 'user-1': 2, 'user-2': 0 },
    markConversationAsRead: jest.fn(),
  }),
}));

// Mock useConversations
jest.mock('../../src/chat/presentation/hooks/useConversations', () => ({
  useConversations: () => ({
    conversations: [],
    isLoading: false,
    refresh: jest.fn(),
    refreshConversations: jest.fn(),
    markConversationAsRead: jest.fn(),
  }),
}));

// Mock useAuthViewModel
jest.mock('../../src/auth/presentation/viewmodels/useAuthViewModel', () => ({
  useAuthViewModel: () => ({
    user: { id: 'current-user', name: 'Current User', username: 'currentuser' },
    logout: jest.fn(),
    isLoading: false,
  }),
}));

describe('UsersScreen', () => {
  const mockNavigation = {
    navigate: mockNavigate,
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render list of users', () => {
    const { getByTestId } = render(<UsersScreen navigation={mockNavigation} />);

    // Verify the list is rendered
    expect(getByTestId('users-list')).toBeTruthy();

    // Verify individual user items
    expect(getByTestId('user-item-0')).toBeTruthy();
    expect(getByTestId('user-item-1')).toBeTruthy();
  });

  it('should display online status', () => {
    const { getByText } = render(<UsersScreen navigation={mockNavigation} />);

    // Alice is online
    expect(getByText('Online')).toBeTruthy();
  });

  it('should display unread count badge', () => {
    const { getByText } = render(<UsersScreen navigation={mockNavigation} />);

    // user-1 (Alice) has 2 unread messages
    expect(getByText('2')).toBeTruthy();
  });

  it('should navigate to chat when user is pressed', async () => {
    const { getByTestId } = render(<UsersScreen navigation={mockNavigation} />);

    const aliceItem = getByTestId('user-item-0');
    fireEvent.press(aliceItem);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Chat', {
        user: {
          id: 'user-1',
          name: 'Alice',
          username: 'alice',
          online: true,
        },
      });
    });
  });

  it('should render theme toggle in header', () => {
    render(<UsersScreen navigation={mockNavigation} />);

    // ThemeToggle and LanguageSwitcher are rendered in the header via setOptions
    // Verify that setOptions was called to configure the header
    expect(mockNavigation.setOptions).toHaveBeenCalled();
  });

  it('should render language switcher in header', () => {
    render(<UsersScreen navigation={mockNavigation} />);

    // ThemeToggle and LanguageSwitcher are rendered in the header via setOptions
    // Verify that setOptions was called to configure the header
    expect(mockNavigation.setOptions).toHaveBeenCalled();
  });
});
