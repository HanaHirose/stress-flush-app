import { useRef } from 'react';
import { Animated } from 'react-native';

export const useRainbowAnimation = () => {
  // 虹の高さの進行度（0〜1）
  const rainbowProgress = useRef(new Animated.Value(0)).current;

  // 虹を伸ばすアニメーション
  const animateRainbowIn = () => {
    Animated.timing(rainbowProgress, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false, // height と translateY にアニメーションを使うので false
    }).start();
  };

  // 虹を縮めるアニメーション
  const animateRainbowOut = () => {
    Animated.timing(rainbowProgress, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return {
    rainbowProgress,
    animateRainbowIn,
    animateRainbowOut,
  };
};
