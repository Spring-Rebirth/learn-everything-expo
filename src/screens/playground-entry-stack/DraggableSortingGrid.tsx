import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedReaction,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLUMNS = 3;
const MARGIN = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SIZE = (SCREEN_WIDTH - MARGIN * 2) / COLUMNS - MARGIN * 2;

const INITIAL_ITEMS = [
  { id: '1', color: '#ef4444' }, // red
  { id: '2', color: '#f97316' }, // orange
  { id: '3', color: '#eab308' }, // yellow
  { id: '4', color: '#22c55e' }, // green
  { id: '5', color: '#06b6d4' }, // cyan
  { id: '6', color: '#3b82f6' }, // blue
  { id: '7', color: '#a855f7' }, // purple
  { id: '8', color: '#ec4899' }, // pink
  { id: '9', color: '#64748b' }, // slate
];

type Item = (typeof INITIAL_ITEMS)[0];

interface SortableItemProps {
  item: Item;
  index: number;
  positions: SharedValue<Record<string, number>>;
  onDragEnd: (from: number, to: number) => void;
}

function getPosition(index: number) {
  'worklet';
  return {
    x: (index % COLUMNS) * (SIZE + MARGIN * 2) + MARGIN,
    y: Math.floor(index / COLUMNS) * (SIZE + MARGIN * 2) + MARGIN,
  };
}

function getOrder(x: number, y: number) {
  'worklet';
  const col = Math.round((x - MARGIN) / (SIZE + MARGIN * 2));
  const row = Math.round((y - MARGIN) / (SIZE + MARGIN * 2));
  return row * COLUMNS + col;
}

function SortableItem({ item, positions }: SortableItemProps) {
  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(getPosition(positions.value[item.id]).x);
  const translateY = useSharedValue(getPosition(positions.value[item.id]).y);

  useAnimatedReaction(
    () => positions.value[item.id],
    (currentOrder) => {
      if (!isDragging.value) {
        const newPos = getPosition(currentOrder);
        translateX.value = withSpring(newPos.x);
        translateY.value = withSpring(newPos.y);
      }
    },
    [item.id]
  );

  const context = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((e) => {
      translateX.value = e.translationX + context.value.x;
      translateY.value = e.translationY + context.value.y;

      const newOrder = getOrder(translateX.value, translateY.value);

      if (newOrder >= 0 && newOrder < INITIAL_ITEMS.length) {
        const oldOrder = positions.value[item.id];
        if (newOrder !== oldOrder) {
          const idToSwap = Object.keys(positions.value).find(
            (key) => positions.value[key] === newOrder
          );
          if (idToSwap) {
            const newPositions = { ...positions.value };
            newPositions[item.id] = newOrder;
            newPositions[idToSwap] = oldOrder;
            positions.value = newPositions;
          }
        }
      }
    })
    .onEnd(() => {
      const currentOrder = positions.value[item.id];
      const newPos = getPosition(currentOrder);
      translateX.value = withSpring(newPos.x);
      translateY.value = withSpring(newPos.y);
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      backgroundColor: item.color,
      borderRadius: 8,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isDragging.value ? 1.1 : 1 },
      ],
      zIndex: isDragging.value ? 100 : 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDragging.value ? 0.2 : 0,
      shadowRadius: 4,
      elevation: isDragging.value ? 5 : 0,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{item.id}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function DraggableSortingGrid() {
  const positions = useSharedValue<Record<string, number>>(
    Object.fromEntries(INITIAL_ITEMS.map((item, index) => [item.id, index]))
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Draggable Grid</Text>
      </View>
      <View style={styles.gridContainer}>
        {INITIAL_ITEMS.map((item, index) => (
          <SortableItem
            key={item.id}
            item={item}
            index={index}
            positions={positions}
            onDragEnd={() => { }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
    marginTop: 20,
    height: Math.ceil(INITIAL_ITEMS.length / COLUMNS) * (SIZE + MARGIN * 2) + 50,
  },
  itemContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
