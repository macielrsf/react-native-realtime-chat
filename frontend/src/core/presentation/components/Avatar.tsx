// frontend/src/core/presentation/components/Avatar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface AvatarProps {
  name: string;
  size?: number;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 40, online }) => {
  const { theme } = useTheme();

  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: size * 0.4,
            color: theme.text.inverse,
          },
        ]}
      >
        {initials}
      </Text>
      {online !== undefined && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: online ? theme.online : theme.offline,
              borderColor: theme.background,
            },
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: size * 0.125,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
