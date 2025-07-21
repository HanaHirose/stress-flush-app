import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MAX_HEARTS = 5;

export default function HomeScreen() {
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [isTyping, setIsTyping] = useState(false);  // テキスト入力中かどうかの状態
  const [stressText, setStressText] = useState(''); // ストレステキストの状態

  const swayAnim = useRef(new Animated.Value(0)).current; // 草の揺れアニメーション用
  const floatAnim = useRef(new Animated.Value(0)).current; // キャラの上下ぴょこぴょこアニメーション用

  useEffect(() => {
    // 草の揺れアニメーションを設定
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    // キャラの上下ぴょこぴょこ
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleEatStress = () => {
    if (hearts > 0) {
      setIsTyping(true); // ボタンを隠して入力欄を表示
    }
  };

  const handleSubmitStress = () => {
    if (stressText.trim() !== '') {
      setHearts((prev) => prev - 1); // ハート減少
      console.log(`"${stressText}" をキャラが食べました！`);
      // TODO: アニメやうんち生成など
      setStressText('');
      setIsTyping(false); // 入力完了 → ボタン再表示
    }
  };


  return (
    <View style={styles.background}>
      {/* 草アニメーション */}
      <Animated.Image
        source={require('@/assets/images/react-logo.png')} // 静止草画像を用意してください
        style={[
          styles.grass,
          {
            transform: [
              {
                rotate: swayAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-2deg', '2deg'],
                }),
              },
            ],
          },
        ]}
      />

      {/* ハート表示 */}
      <View style={styles.heartContainer}>
        {Array.from({ length: MAX_HEARTS }).map((_, i) => (
          <Image
            key={i}
            source={
              i < hearts
                ? require('@/assets/images/heart.png') // ハートがある場合の画像
                : require('@/assets/images/heart-empty.png') // ハートがない場合の画像（同じ画像を使用）
            }
            style={styles.heart}
          />
        ))}
      </View>

      {/* キャラ表示（仮イメージ） */}
      <View style={styles.characterContainer}>
        <Animated.Image
          source={require('@/assets/images/bird1.png')} // アニメーションなしの固定キャラ画像
          style={[
            styles.character,
            {
              transform: [{ translateY: floatAnim }],
            }
          ]}
        />
      </View>

      {/* 食べてもらうボタン
      <TouchableOpacity style={styles.button} onPress={handleEatStress}>
        <Text style={styles.buttonText}>ストレスを食べてもらう</Text>
      </TouchableOpacity> */}
  

      {/* 入力欄 or ボタン */}
      {isTyping ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ここにストレスを書いてね"
            value={stressText}
            onChangeText={setStressText}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitStress}>
            <Text style={styles.buttonText}>食べてもらう！</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleEatStress}>
          <Text style={styles.buttonText}>ストレスを食べてもらう</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#d9f9daff', // 緑の背景色
    justifyContent: 'center',
    alignItems: 'center',
  },
  grass: {
    position: 'absolute',
    bottom: 0,
    width: 300,
    height: 80,
  },
  heartContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  heart: {
    width: 30,
    height: 30,
    marginRight: 4,
  },
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  character: {
    width: 150,
    height: 150,
  },
  button: {
    backgroundColor: '#68C290',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
    inputContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 100,
    padding: 12,
    borderRadius: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top', // Android対応：上から書けるように
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#FFB347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
