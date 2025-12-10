import React from 'react';
import Animated from 'react-native-reanimated';
import Card from './Card';

type CardType = {
    id: string;
    text: string;
    color: string;
    uri: string;
};

interface BackgroundCardProps {
    card: CardType;
    style: any;
    zIndex?: number;
}

export default function BackgroundCard({ card, style, zIndex = 0 }: BackgroundCardProps) {
    return (
        <Animated.View
            className="absolute w-[90%] h-[60%]"
            style={[{ zIndex }, style]}
        >
            <Card card={card} />
        </Animated.View>
    );
}
