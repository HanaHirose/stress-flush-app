import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAbsorbAnimation } from '@/animations/useAbsorbAnimation';

const MAX_HEARTS = 5;

// キャラ状態を定義（追加しやすくするため）
const CHARACTER_STATES = {
  NORMAL: 'normal',
  MOUTH_OPEN: 'mouthOpen',
  // 今後 chewing, digesting などを追加しやすい
};


export default function HomeScreen() {
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [isTyping, setIsTyping] = useState(false);  // テキスト入力中かどうかの状態
  const [stressText, setStressText] = useState(''); // ストレステキストの状態

  const swayAnim = useRef(new Animated.Value(0)).current; // 草の揺れアニメーション用
  const floatAnim = useRef(new Animated.Value(0)).current; // キャラの上下ぴょこぴょこアニメーション用

  const [displayedText, setDisplayedText] = useState('');
  const [showTextEffect, setShowTextEffect] = useState(false);

  const [characterState, setCharacterState] = useState(CHARACTER_STATES.NORMAL); // キャラ状態

  // 追加: 吸収アニメーション用フックから取得
  const {
    rotateAnim,
    scaleAnim,
    translateXAnim,
    translateYAnim,
    startAbsorbAnimation,
  } = useAbsorbAnimation(() => {
    setShowTextEffect(false);
  });

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

  // ストレスを食べてもらうボタンが押されたときの処理
  const handleSubmitStress = async () => {
    rotateAnim.setValue(0);
    scaleAnim.setValue(1);
    translateXAnim.setValue(0);
    translateYAnim.setValue(0);
    if (stressText.trim() !== '') {
      setIsTyping(false); // 入力UIを消す
      setDisplayedText(''); // 表示をリセット
      setShowTextEffect(true);
      // await playTypewriterSound(); // 音だけ先に鳴らす

      // 高速表示
      const chars = stressText.split('');
      let current = '';
      chars.forEach((char, index) => {
        setTimeout(() => {
          current += char;
          setDisplayedText(current);
          if (index === chars.length - 1) {
             setTimeout(() => {
              setCharacterState(CHARACTER_STATES.MOUTH_OPEN);
              setTimeout(() => {
                startAbsorbAnimation(); // 吸収アニメーション開始
              }, 1000); // 1秒後にアニメーション開始
            }, 1000); // 1秒後に口を開ける
            // 最後の文字で何か処理可能（例: 手紙表示→吸い込み）
          }
        }, index * 50); // 50msごとに1文字表示（速め）
      });

      setStressText('');
      setHearts((prev) => prev - 1);
    }
  };

  // キャラ状態に応じた画像を返す（変更点）
  const getCharacterImage = () => {
    switch (characterState) {
      case CHARACTER_STATES.MOUTH_OPEN:
        return require('@/assets/images/bird1-mouth-open.png');
      case CHARACTER_STATES.NORMAL:
      default:
        return require('@/assets/images/bird1.png');
    }
  };

  return (
    <View style={styles.background}>
      {/* 草アニメーション
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
      /> */}

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
          source={getCharacterImage()} // 画像取得を状態に応じて変更
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
      {!showTextEffect && ( 
        isTyping ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ここにストレスを書いてね"
            value={stressText}
            onChangeText={setStressText}
            multiline
          />
        <TouchableOpacity style={styles.button} onPress={handleSubmitStress}>
          <Text style={styles.buttonText}>ストレスを食べてもらう</Text>
        </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleEatStress}>
          <Text style={styles.buttonText}>ストレスを食べてもらう</Text>
        </TouchableOpacity>
      )
      )}

      {/* 表示中の文字（ふわっと出現） */}
  {showTextEffect && (

    <Animated.View
      style={[
        styles.letterContainer,
        {
          transform: [
            { translateX: translateXAnim },
            { translateY: translateYAnim },           
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '720deg'],
              }),
            },
            { scale: scaleAnim },

          ],
        },
      ]}
    >
      <Animated.Text style={styles.stressTextDisplay}>
        {displayedText}
      </Animated.Text>
    </Animated.View>

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
  letterWrapper: {
    position: 'absolute',
    top: '60%', // 初期の表示位置（キャラの上に調整）
    left: '20%', // 必要に応じて位置調整
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  letterContainer: {
    // position: 'absolute',
    // top: '60%',
    marginTop: 30,
    paddingHorizontal: 20,
    // backgroundColor: 'rgba(255,0,0,0.2)', // デバッグ用
  },
  stressTextDisplay: {
    fontSize: 20,
    fontFamily: 'System', // 必要に応じて可愛いフォントに差し替え
    textAlign: 'center',
    color: '#444',
  },

});
