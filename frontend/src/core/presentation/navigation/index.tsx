// frontend/src/core/presentation/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import { LoginScreen } from '../../../auth/presentation/screens/LoginScreen';
import { UsersScreen } from '../../../users/presentation/screens/UsersScreen';
import { ChatScreen } from '../../../chat/presentation/screens/ChatScreen';
import { useAuthStore } from '../../../shared/state/store';
import { colors } from '../theme/colors';
import { AuthProvider } from './AuthProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack - only Login screen when not authenticated
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // App Stack - Users and Chat screens when authenticated
          <>
            <Stack.Screen
              name="Users"
              component={UsersScreen}
              options={{ title: 'Chats' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({ route }) => ({ title: route.params.user.name })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const Navigation: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
