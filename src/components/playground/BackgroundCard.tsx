import React from 'react';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import Card from './Card';

type CardType = {
    id: string;
    text: string;
    color: string;
    uri: string;
};

interface BackgroundCardProps {
    card: CardType;
    AnimatedStyle: AnimatedStyle;
    zIndex?: number;
}

export default function BackgroundCard({ card, AnimatedStyle, zIndex = 0 }: BackgroundCardProps) {
    return (
        <Animated.View
            className="absolute w-[90%] h-[60%]"
            style={[{ zIndex }, AnimatedStyle]}
        >
            <Card card={card} />
        </Animated.View>
    );
}
