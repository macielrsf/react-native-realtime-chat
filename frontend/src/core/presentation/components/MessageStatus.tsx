// frontend/src/core/presentation/components/MessageStatus.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../../../shared/i18n';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'failed';
  onRetry?: () => void;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  onRetry,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  if (status === 'sending') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.text.tertiary} />
        <Text style={[styles.statusText, { color: theme.text.tertiary }]}>
          {t('chat.message.sending')}
        </Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.failedContainer}>
        <View style={styles.failedContent}>
          <Text style={[styles.statusText, { color: theme.danger }]}>
            ❌ {t('chat.message.failed')}
          </Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={[styles.retryButton, { borderColor: theme.danger }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.retryText, { color: theme.danger }]}>
                {t('chat.message.retry')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (status === 'delivered') {
    return (
      <View style={styles.container}>
        <Text style={[styles.statusText, { color: theme.text.tertiary }]}>
          ✓✓
        </Text>
      </View>
    );
  }

  if (status === 'sent') {
    return (
      <View style={styles.container}>
        <Text style={[styles.statusText, { color: theme.text.tertiary }]}>
          ✓
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    fontSize: 10,
  },
  failedContainer: {
    marginTop: spacing.xs,
  },
  failedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  retryButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderWidth: 1,
    borderRadius: 4,
  },
  retryText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
});
