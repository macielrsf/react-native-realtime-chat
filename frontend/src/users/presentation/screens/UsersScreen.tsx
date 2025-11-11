// frontend/src/users/presentation/screens/UsersScreen.tsx
import React, { useEffect, useLayoutEffect } from 'react';
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
import { useUnreadCounts } from '../../../shared/hooks/useUnreadCounts';
import { UserSummary } from '../../domain/entities/UserSummary';
import { colors } from '../../../core/presentation/theme/colors';
import { spacing } from '../../../core/presentation/theme/spacing';
import { typography } from '../../../core/presentation/theme/typography';

type UsersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Users'
>;

interface Props {
  navigation: UsersScreenNavigationProp;
}

const LogoutButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.logoutButton}
    activeOpacity={0.7}
  >
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
);

export const UsersScreen: React.FC<Props> = ({ navigation }) => {
  const { users, isLoading, loadUsers, refreshUsers } = useUsersViewModel();
  const { logout } = useAuthViewModel();
  const { unreadCounts, markConversationAsRead } = useUnreadCounts();

  const handleLogout = React.useCallback(() => {
    logout();
  }, [logout]);

  const logoutButton = React.useMemo(
    () => <LogoutButton onPress={handleLogout} />,
    [handleLogout],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => logoutButton,
    });
  }, [navigation, logoutButton]);

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
        style={[styles.userItem, hasUnreadMessages && styles.userItemUnread]}
        onPress={() => handleUserPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Avatar name={item.name} size={50} online={item.online} />
          <UnreadBadge count={unreadCount} size="medium" />
        </View>

        <View style={styles.userInfo}>
          <Text
            style={[
              styles.userName,
              hasUnreadMessages && styles.userNameUnread,
            ]}
          >
            {item.name}
          </Text>
          <Text style={styles.userStatus}>
            {item.online ? 'Online' : 'Offline'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        refreshing={isLoading}
        onRefresh={refreshUsers}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoutButton: {
    marginRight: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  logoutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '600',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  userItemUnread: {
    backgroundColor: colors.surface + '40', // Slight highlight for unread
  },
  avatarContainer: {
    position: 'relative',
  },
  userInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userNameUnread: {
    fontWeight: '700',
    color: colors.text.primary,
  },
  userStatus: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
