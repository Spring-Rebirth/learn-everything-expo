import { TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export function BackButton({ navigation }: { navigation: any }) {
  return (
    <TouchableOpacity
      testID='back-button'
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <View
        className='w-10 h-10 rounded-full bg-slate-700/80 items-center justify-center'
      >
        <FontAwesome6 name='arrow-left' size={18} color='#FFFFFF' iconStyle='solid' />
      </View>
    </TouchableOpacity>
  );
}
