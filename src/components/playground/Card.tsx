import { View, Text, Image } from 'react-native';

type CardType = {
    id: string;
    text: string;
    color: string;
    uri: string;
};

export default function Card({ card }: { card: CardType }) {
    return (
        <View className="flex-1 bg-white rounded-3xl overflow-hidden w-full h-full border border-neutral-200">
            <Image
                source={{ uri: card.uri }}
                className="w-full h-[85%]"
                resizeMode="cover"
            />
            <View className="h-[15%] justify-center px-5 bg-white">
                <Text className="text-3xl font-bold text-neutral-800">
                    {card.text}
                </Text>
                <Text className="text-base text-neutral-400 mt-1">
                    24岁 • 纽约
                </Text>
            </View>
        </View>
    );
}