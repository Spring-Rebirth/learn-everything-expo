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
      className="absolute z-50 w-10 h-10 rounded-full bg-white/90 items-center justify-center"
      style={{
        top: insets.top + 10,
        left: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <FontAwesome6 name="arrow-left" size={20} color="#374151" />
    </TouchableOpacity>
  );
}

