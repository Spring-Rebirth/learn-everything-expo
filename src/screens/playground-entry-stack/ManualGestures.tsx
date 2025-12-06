import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ManualGestures() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const color = useSharedValue('#3b82f6'); // blue-500

  const gesture = Gesture.Manual()
    .onTouchesDown((e, manager) => {
      // Activate gesture immediately on touch down
      manager.activate();
      scale.value = withSpring(1.2);
      color.value = '#ef4444'; // red-500
    })
    .onTouchesMove((e, manager) => {
      // Update position on move
      // Note: Manual gesture gives us raw touch events.
      // We need to track the first touch point.
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        // Centering the box on the finger requires knowing the box size/layout,
        // but here we just follow the touch coordinates relative to the view.
        // Simplified: just set x/y to touch absolute position minus offset if needed.
        // For simplicity in this demo, let's just move it to the touch point.
        x.value = touch.x - 50; // Center 100x100 box
        y.value = touch.y - 50;
      }
    })
    .onTouchesUp((e, manager) => {
      // End gesture on lift
      manager.end();
      scale.value = withSpring(1);
      color.value = '#3b82f6';
    })
    .onTouchesCancelled((e, manager) => {
      manager.fail();
      scale.value = withSpring(1);
      color.value = '#3b82f6';
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: scale.value },
      ],
      backgroundColor: color.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Touch and drag anywhere (Manual Gesture)</Text>
      <GestureDetector gesture={gesture}>
        <View style={styles.touchArea}>
          <Animated.View style={[styles.box, animatedStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    position: 'absolute',
    top: 100,
    fontSize: 16,
    color: '#4b5563',
  },
  touchArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    position: 'absolute',
  },
});

