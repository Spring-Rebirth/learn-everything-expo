import { Dimensions, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets'
import { CARDS } from '../../constant/mockCards';
import Card from './Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type CardType = typeof CARDS[0];

interface SwipeableCardProps {
    card: CardType;
    onSwipe: () => void;
    sharedTranslateX: SharedValue<number>;
}

export default function SwipeableCard({ card, onSwipe, sharedTranslateX }: SwipeableCardProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;

            sharedTranslateX.value = event.translationX;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction = event.translationX > 0 ? 'right' : 'left';
                const destX = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
                const destY = (event.translationY / event.translationX) * destX;

                const springConfig = {
                    velocity: event.velocityX,
                    stiffness: 80,
                    damping: 20,
                    overshootClamping: true,
                    restDisplacementThreshold: 0.1,
                    restSpeedThreshold: 0.1,
                };

                translateX.value = withSpring(destX, springConfig, (finished) => {
                    if (finished) {
                        scheduleOnRN(onSwipe);
                    }
                });

                translateY.value = withSpring(destY, springConfig);
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);

                sharedTranslateX.value = withSpring(0);
            }
        });

    const rotate = useDerivedValue(() => {
        return interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-10, 0, 10],
            Extrapolation.CLAMP
        );
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    const likeOpacity = useDerivedValue(() => {
        return interpolate(
            translateX.value,
            [0, SCREEN_WIDTH / 4],
            [0, 1],
            Extrapolation.CLAMP
        );
    });

    const nopeOpacity = useDerivedValue(() => {
        return interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 4, 0],
            [1, 0],
            Extrapolation.CLAMP
        );
    });

    const likeStyle = useAnimatedStyle(() => ({ opacity: likeOpacity.value }));
    const nopeStyle = useAnimatedStyle(() => ({ opacity: nopeOpacity.value }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                className="absolute w-[90%] h-[60%] shadow-xl"
                style={[
                    animatedStyle,
                    { zIndex: 10 }
                ]}
            >
                <Card card={card} />

                {/* LIKE Overlay */}
                <Animated.View
                    className="absolute top-10 left-10 -rotate-12 border-4 border-green-500 rounded-lg px-2 z-20"
                    style={likeStyle}
                >
                    <Text className="text-green-500 font-extrabold text-4xl tracking-widest">LIKE</Text>
                </Animated.View>

                {/* NOPE Overlay */}
                <Animated.View
                    className="absolute top-10 right-10 rotate-12 border-4 border-red-500 rounded-lg px-2 z-20"
                    style={nopeStyle}
                >
                    <Text className="text-red-500 font-extrabold text-4xl tracking-widest">NOPE</Text>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
}
