// frontend/src/auth/presentation/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { TextInput } from '../../../core/presentation/components/TextInput';
import { Button } from '../../../core/presentation/components/Button';
import { ThemeToggle } from '../../../core/presentation/components/ThemeToggle';
import { LanguageSwitcher } from '../../../core/presentation/components/LanguageSwitcher';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import { useTheme } from '../../../core/presentation/theme/ThemeContext';
import { useLanguage } from '../../../shared/i18n';
import { spacing } from '../../../core/presentation/theme/spacing';
import { typography } from '../../../core/presentation/theme/typography';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthViewModel();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(t('core.common.error'), t('auth.errors.emptyFields'));
      return;
    }

    const success = await login(username.trim(), password);

    if (!success) {
      Alert.alert(
        t('auth.errors.loginFailed'),
        error || t('auth.errors.invalidCredentials'),
      );
    }
    // Navegação automática: quando isAuthenticated=true, Navigation renderiza Users Stack
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header controls - Theme and Language */}
        <View style={styles.headerControls}>
          <LanguageSwitcher />
          <ThemeToggle />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              {t('auth.login.title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              {t('auth.login.subtitle')}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              testID="username-input"
              label={t('auth.login.username')}
              value={username}
              onChangeText={setUsername}
              placeholder={t('auth.login.usernamePlace')}
              autoCapitalize="none"
            />

            <TextInput
              testID="password-input"
              label={t('auth.login.password')}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.login.passwordPlace')}
              secureTextEntry
            />

            <Button
              testID="login-button"
              title={
                isLoading
                  ? t('auth.login.signInLoading')
                  : t('auth.login.signIn')
              }
              onPress={handleLogin}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
  form: {
    gap: spacing.md,
  },
});
