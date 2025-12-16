import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export function FloatingBackButton() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      className="absolute z-50 rounded-full items-center justify-center p-2 bg-white border border-pink-200"
      style={{
        top: insets.top + 10,
        left: 20,
      }}
    >
      <FontAwesome6 name="arrow-left" size={20} color="#374151" />
    </TouchableOpacity>
  );
}
