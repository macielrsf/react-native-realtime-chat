// frontend/src/core/presentation/components/MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../../chat/domain/entities/Message';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface MessageBubbleProps {
  message: Message;
  isFromMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromMe,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, isFromMe ? styles.sent : styles.received]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isFromMe
              ? theme.message.sent
              : theme.message.received,
          },
          isFromMe ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isFromMe
                ? theme.message.sentText
                : theme.message.receivedText,
            },
          ]}
        >
          {message.body}
        </Text>
        <Text
          style={[
            styles.time,
            isFromMe ? styles.timeSent : { color: theme.text.tertiary },
          ]}
        >
          {message.createdAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  sent: {
    alignItems: 'flex-end',
  },
  received: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '70%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  bubbleSent: {
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    borderBottomLeftRadius: 4,
  },
  text: {
    ...typography.body,
  },
  time: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  timeSent: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
