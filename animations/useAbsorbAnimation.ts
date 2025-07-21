import { useRef } from 'react';
import { Animated } from 'react-native';

export const useAbsorbAnimation = (onFinish: () => void) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const startAbsorbAnimation = () => {
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -170,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),

    ]).start(onFinish);
  };

  return {
    rotateAnim,
    scaleAnim,
    translateXAnim,
    translateYAnim,
    startAbsorbAnimation,
  };
};
