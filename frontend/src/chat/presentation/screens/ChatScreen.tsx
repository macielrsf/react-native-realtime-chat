// frontend/src/chat/presentation/screens/ChatScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../core/presentation/navigation/types';
import { useChatViewModel } from '../viewmodels/useChatViewModel';
import { useUnreadCounts } from '../../../shared/hooks/useUnreadCounts';
import { MessageBubble } from '../../../core/presentation/components/MessageBubble';
import { TypingIndicator } from '../../../core/presentation/components/TypingIndicator';
import { Message } from '../../domain/entities/Message';
import { useTheme } from '../../../core/presentation/theme/ThemeContext';
import { useLanguage } from '../../../shared/i18n';
import { spacing } from '../../../core/presentation/theme/spacing';
import { typography } from '../../../core/presentation/theme/typography';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
  route: ChatScreenRouteProp;
}

export const ChatScreen: React.FC<Props> = ({ route }) => {
  const { user } = route.params;
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<RNTextInput>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const { markConversationAsRead } = useUnreadCounts();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const {
    messages,
    isTyping,
    isLoading,
    currentUserId,
    loadHistory,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChatViewModel(user.id);

  useEffect(() => {
    loadHistory();
    // Marcar mensagens como lidas ao entrar no chat
    markConversationAsRead(user.id);
  }, [loadHistory, markConversationAsRead, user.id]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    stopTyping();

    try {
      await sendMessage(messageText);
      // Manter foco no input após enviar
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTextChange = (text: string) => {
    setInputText(text);

    if (text.length > 0) {
      startTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const handleSubmitEditing = () => {
    if (inputText.trim()) {
      handleSend();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} isFromMe={item.isFromMe(currentUserId)} />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {isLoading && messages.length === 0 ? (
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />
      )}

      <View
        style={[
          styles.inputContainer,
          { borderTopColor: theme.border, backgroundColor: theme.background },
        ]}
      >
        <RNTextInput
          ref={inputRef}
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text.primary },
          ]}
          value={inputText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          placeholder={t('chat.input.placeholder')}
          placeholderTextColor={theme.text.tertiary}
          multiline={false}
          returnKeyType="send"
          enablesReturnKeyAutomatically={true}
          blurOnSubmit={false}
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim() ? theme.primary : theme.surface,
            },
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text
            style={[
              styles.sendButtonText,
              {
                color: inputText.trim()
                  ? theme.text.inverse
                  : theme.text.secondary,
              },
            ]}
          >
            {t('chat.input.send')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    paddingVertical: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    ...typography.body,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    height: 40,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});
