// frontend/src/core/presentation/components/LanguageSwitcher.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useLanguage } from '../../../shared/i18n';
import { Language } from '../../../shared/i18n/types';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export const LanguageSwitcher: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const currentOption = languageOptions.find(
    option => option.code === currentLanguage,
  );

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        testID="language-switcher"
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: theme.text.primary }]}>
          {currentOption?.flag} {currentOption?.code}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
              {t('core.language.change')}
            </Text>

            {languageOptions.map(option => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.optionButton,
                  currentLanguage === option.code && {
                    backgroundColor: theme.primary + '20',
                  },
                ]}
                onPress={() => handleLanguageChange(option.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.optionText, { color: theme.text.primary }]}
                >
                  {option.flag} {option.label}
                </Text>
                {currentLanguage === option.code && (
                  <Text style={[styles.checkMark, { color: theme.primary }]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  buttonText: {
    ...typography.caption,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: spacing.lg,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    ...typography.heading,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.xs,
  },
  optionText: {
    ...typography.body,
    flex: 1,
  },
  checkMark: {
    ...typography.body,
    fontWeight: 'bold',
  },
});
