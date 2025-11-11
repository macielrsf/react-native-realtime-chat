// frontend/src/core/presentation/components/TypingIndicator.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const TypingIndicator: React.FC = () => {
  const { theme } = useTheme();
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [opacity1, opacity2, opacity3]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.text.tertiary }]}>Typing</Text>
      <View style={styles.dots}>
        <Animated.View
          style={[
            styles.dot,
            { opacity: opacity1, backgroundColor: theme.text.tertiary },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { opacity: opacity2, backgroundColor: theme.text.tertiary },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { opacity: opacity3, backgroundColor: theme.text.tertiary },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.caption,
    marginRight: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
