// frontend/src/chat/presentation/components/ChatInput.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../core/presentation/theme/ThemeContext';
import { useLanguage } from '../../../shared/i18n';
import { spacing } from '../../../core/presentation/theme/spacing';
import { typography } from '../../../core/presentation/theme/typography';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  maxLength?: number;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  onTyping,
  onStopTyping,
  maxLength = 1000,
  disabled = false,
}) => {
  const [isMultiline, setIsMultiline] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const typingTimeoutRef = useRef<number | null>(null);
  const inputRef = useRef<RNTextInput>(null);

  const handleTextChange = (text: string) => {
    onChangeText(text);

    if (text.length > 0 && onTyping) {
      onTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 2000);
    } else if (onStopTyping) {
      onStopTyping();
    }
  };

  const handleSubmitEditing = () => {
    if (value.trim() && !disabled) {
      onSend();
      // Manter foco no input após enviar
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMultiline = () => {
    setIsMultiline(!isMultiline);
  };

  return (
    <View
      style={[
        styles.container,
        { borderTopColor: theme.border, backgroundColor: theme.background },
      ]}
    >
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            { backgroundColor: theme.surface },
            isMultiline && { backgroundColor: theme.primary + '20' },
          ]}
          onPress={toggleMultiline}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: theme.text.secondary },
              isMultiline && { color: theme.primary },
            ]}
          >
            {isMultiline ? '↩' : '⤴'}
          </Text>
        </TouchableOpacity>

        <RNTextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text.primary,
            },
            isMultiline ? styles.inputMultiline : styles.inputSingleline,
          ]}
          value={value}
          onChangeText={handleTextChange}
          onSubmitEditing={!isMultiline ? handleSubmitEditing : undefined}
          placeholder={t('chat.input.placeholder')}
          placeholderTextColor={theme.text.tertiary}
          multiline={isMultiline}
          returnKeyType={isMultiline ? 'default' : 'send'}
          enablesReturnKeyAutomatically={!isMultiline}
          blurOnSubmit={false}
          maxLength={maxLength}
          editable={!disabled}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                value.trim() && !disabled ? theme.primary : theme.surface,
            },
            (!value.trim() || disabled) && styles.sendButtonDisabled,
          ]}
          onPress={handleSubmitEditing}
          disabled={!value.trim() || disabled}
        >
          <Text
            style={[
              styles.sendButtonText,
              {
                color:
                  value.trim() && !disabled
                    ? theme.text.inverse
                    : theme.text.secondary,
              },
            ]}
          >
            {t('chat.input.send')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    padding: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  modeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    ...typography.body,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    minHeight: 40,
  },
  inputSingleline: {
    height: 40,
    maxHeight: 40,
  },
  inputMultiline: {
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    height: 40,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});
