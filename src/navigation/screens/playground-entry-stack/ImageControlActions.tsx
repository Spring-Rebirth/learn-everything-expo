import { View, Image } from "react-native";

export default function ImageControlActions() {
    return (
        <View className="flex-1">
            <Image
                source={require('../../../assets/images/emma-swoboda.jpg')}
                className="w-full h-full"
            />
        </View>
    );
}
