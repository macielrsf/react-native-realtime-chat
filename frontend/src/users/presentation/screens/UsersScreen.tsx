// frontend/src/users/presentation/screens/UsersScreen.tsx
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../core/presentation/navigation/types';
import { useUsersViewModel } from '../viewmodels/useUsersViewModel';
import { useAuthViewModel } from '../../../auth/presentation/viewmodels/useAuthViewModel';
import { Avatar } from '../../../core/presentation/components/Avatar';
import { UnreadBadge } from '../../../core/presentation/components/UnreadBadge';
import { ThemeToggle } from '../../../core/presentation/components/ThemeToggle';
import { LanguageSwitcher } from '../../../core/presentation/components/LanguageSwitcher';
import { LogoutConfirmationModal } from '../../../core/presentation/components/LogoutConfirmationModal';
import { useUnreadCounts } from '../../../shared/hooks/useUnreadCounts';
import { UserSummary } from '../../domain/entities/UserSummary';
import { useTheme } from '../../../core/presentation/theme/ThemeContext';
import { useLanguage } from '../../../shared/i18n';
import { spacing } from '../../../core/presentation/theme/spacing';
import { typography } from '../../../core/presentation/theme/typography';

type UsersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Users'
>;

interface Props {
  navigation: UsersScreenNavigationProp;
}

const LogoutButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.logoutButton}
      activeOpacity={0.7}
    >
      <Text style={[styles.logoutText, { color: theme.danger }]}>
        {t('users.actions.logout')}
      </Text>
    </TouchableOpacity>
  );
};

const HeaderRight: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <View style={styles.headerRight}>
    <LanguageSwitcher />
    <ThemeToggle />
    <LogoutButton onPress={onLogout} />
  </View>
);

export const UsersScreen: React.FC<Props> = ({ navigation }) => {
  const { users, isLoading, loadUsers, refreshUsers } = useUsersViewModel();
  const { logout } = useAuthViewModel();
  const { unreadCounts, markConversationAsRead } = useUnreadCounts();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // For custom modal implementation (alternative):
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  // For custom modal implementation:
  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const headerRight = React.useMemo(
    () => <HeaderRight onLogout={handleLogout} />,
    [handleLogout],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight,
    });
  }, [navigation, headerRight]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUserPress = (user: UserSummary) => {
    // Marcar como lida quando navegar para o chat
    markConversationAsRead(user.id);
    navigation.navigate('Chat', { user });
  };

  const renderUser = ({ item }: { item: UserSummary }) => {
    const unreadCount = unreadCounts[item.id] || 0;
    const hasUnreadMessages = unreadCount > 0;

    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          { borderBottomColor: theme.surface },
          hasUnreadMessages && { backgroundColor: theme.surface + '40' },
        ]}
        onPress={() => handleUserPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Avatar name={item.name} size={50} online={item.online} />
        </View>

        <View style={styles.userInfo}>
          <Text
            style={[
              styles.userName,
              { color: theme.text.primary },
              hasUnreadMessages && styles.userNameUnread,
            ]}
          >
            {item.name}
          </Text>
          <Text style={[styles.userStatus, { color: theme.text.tertiary }]}>
            {item.online ? t('users.status.online') : t('users.status.offline')}
          </Text>
        </View>

        <View style={styles.badgeContainer}>
          <UnreadBadge count={unreadCount} size="large" />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        refreshing={isLoading}
        onRefresh={refreshUsers}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>
              {t('users.list.empty')}
            </Text>
          </View>
        }
      />

      <LogoutConfirmationModal
        visible={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  logoutText: {
    ...typography.body,
    fontWeight: '600',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  badgeContainer: {
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  userNameUnread: {
    fontWeight: '700',
  },
  userStatus: {
    ...typography.caption,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
  },
});
