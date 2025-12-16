import { TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export function BackButton({ navigation }: { navigation: any }) {
    return (
        <TouchableOpacity
            testID='back-button'
            onPress={() => navigation.goBack()}
        >
            <View
                className='w-12 h-12 rounded-full bg-white/90 items-center justify-center'
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                }}
            >
                <FontAwesome6 name='arrow-left' size={20} color='#374151' iconStyle='solid' />
            </View>
        </TouchableOpacity>
    );
}