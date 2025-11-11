// frontend/src/core/presentation/components/MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../../chat/domain/entities/Message';
import { colors } from '../theme/colors';
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
  return (
    <View style={[styles.container, isFromMe ? styles.sent : styles.received]}>
      <View
        style={[
          styles.bubble,
          isFromMe ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        <Text
          style={[
            styles.text,
            isFromMe ? styles.textSent : styles.textReceived,
          ]}
        >
          {message.body}
        </Text>
        <Text
          style={[
            styles.time,
            isFromMe ? styles.timeSent : styles.timeReceived,
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
    backgroundColor: colors.message.sent,
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: colors.message.received,
    borderBottomLeftRadius: 4,
  },
  text: {
    ...typography.body,
  },
  textSent: {
    color: colors.message.sentText,
  },
  textReceived: {
    color: colors.message.receivedText,
  },
  time: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  timeSent: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeReceived: {
    color: colors.text.tertiary,
  },
});
