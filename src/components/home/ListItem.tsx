import { View, Text, Pressable, Image } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Item } from '../../navigation/screens/root-tabs/Home'
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootBottomTabsParamList } from '../../navigation/RootBottomTabs';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ListItem({ item, index }: { item: Item, index: number }) {
    const navigation = useNavigation<NativeStackNavigationProp<RootBottomTabsParamList>>();

    return (
        <AnimatedPressable
            testID='home-item-pressable'
            // onPress={() => navigation.navigate('HomeEntryStack', {
            //     screen: 'Detail',
            //     params: { itemId: item.id, title: item.title, image: item.image }
            // })}
            entering={FadeInDown.delay(index * 200)}
        >
            <View
                className='bg-white rounded-2xl overflow-hidden mb-4'
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                {/* Card Header */}
                <View className='flex-row items-center justify-between p-4'>
                    <View className='flex-row items-center flex-1'>
                        <View
                            className='w-12 h-12 rounded-full items-center justify-center mr-3'
                            style={{ backgroundColor: `rgba(102, 126, 234, ${0.1 + index * 0.1})` }}
                        >
                            <FontAwesome6
                                name='image'
                                size={20}
                                color='#667eea'
                                solid
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-lg font-bold text-gray-900'>{item.title}</Text>
                            <Text className='text-sm text-gray-600 mt-1'>{item.description}</Text>
                        </View>
                    </View>
                    <FontAwesome6 name='chevron-right' size={16} color='#C7C7CC' solid />
                </View>

                {/* Card Image */}
                {item.image && (
                    <View className='relative'>
                        <Image
                            testID='home-item-image'
                            source={item.image}
                            className='w-full h-48'
                            resizeMode='cover'
                        />
                        {/* <View
                            className='absolute bottom-0 left-0 right-0 h-16 bg-black/20'
                        /> */}
                        <View className='absolute bottom-4 left-4'>
                            <Text className='text-white font-semibold text-sm bg-black/30 px-2 py-1 rounded-full'>
                                View Details
                            </Text>
                        </View>
                    </View>
                )}

                {/* Card Footer */}
                <View className='flex-row items-center justify-between p-4'>
                    <View className='flex-row items-center'>
                        <FontAwesome6 name='star' size={14} color='#6B7280' solid />
                        <Text className='text-xs text-gray-600 ml-2'>Lable placeholder</Text>
                    </View>
                    <View className='flex-row items-center'>
                        <FontAwesome6 name='clock' size={14} color='#6B7280' solid />
                        <Text className='text-xs text-gray-600 ml-1'>Just now</Text>
                    </View>
                </View>
            </View>
        </AnimatedPressable>
    )
}