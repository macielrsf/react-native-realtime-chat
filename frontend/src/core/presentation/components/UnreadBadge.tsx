// frontend/src/core/presentation/components/UnreadBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface UnreadBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({
  count,
  maxCount = 99,
  size = 'medium',
}) => {
  const { theme } = useTheme();

  if (count <= 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeStyles = {
    small: styles.badgeSmall,
    medium: styles.badgeMedium,
    large: styles.badgeLarge,
  };

  const textSizeStyles = {
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  };

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        {
          backgroundColor: theme.danger,
          borderColor: theme.background,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          textSizeStyles[size],
          { color: theme.text.inverse },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -6,
    right: -6,
    borderWidth: 2,
  },
  badgeSmall: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 6,
  },
  badgeMedium: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
  },
  badgeLarge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 10,
    lineHeight: 12,
  },
  textMedium: {
    fontSize: 12,
    lineHeight: 14,
  },
  textLarge: {
    fontSize: 14,
    lineHeight: 16,
  },
});
