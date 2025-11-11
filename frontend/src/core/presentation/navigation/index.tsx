// frontend/src/core/presentation/navigation/index.tsx
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import { LoginScreen } from '../../../auth/presentation/screens/LoginScreen';
import { UsersScreen } from '../../../users/presentation/screens/UsersScreen';
import { ChatScreen } from '../../../chat/presentation/screens/ChatScreen';
import { useAuthStore } from '../../../shared/state/store';
import { useTheme } from '../theme/ThemeContext';
import { AuthProvider } from './AuthProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { theme, isDark } = useTheme();

  // Create custom navigation theme
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text.primary,
      border: theme.border,
    },
  };

  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text.primary,
          headerTitleStyle: {
            color: theme.text.primary,
          },
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
  },
});
