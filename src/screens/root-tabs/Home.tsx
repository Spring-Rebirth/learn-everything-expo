import { View, Text, Pressable, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from "@shopify/flash-list";
import { imageAssets } from '../../constant/imageAssets';
import { FontAwesome6 } from '@expo/vector-icons';
import ListItem from '../../components/home/ListItem';
import { RootBottomTabsParamList } from '../../navigation/RootBottomTabs';

export type Item = {
    id: string;
    title: string;
    description: string;
    image?: any;
};

export default function Home() {
    const navigation = useNavigation<NativeStackNavigationProp<RootBottomTabsParamList>>();
    const insert = useSafeAreaInsets();

    // 基础数据与静态图片数组（按顺序）
    const baseData: Omit<Item, 'image'>[] = [
        { id: '1', title: 'Item 1', description: 'Description for item 1' },
        { id: '2', title: 'Item 2', description: 'Description for item 2' },
        { id: '3', title: 'Item 3', description: 'Description for item 3' },
    ];

    const images = [
        imageAssets.nature1,
        imageAssets.nature2,
        imageAssets.nature3,
    ];

    const data: Item[] = baseData.map((item, idx) => ({ ...item, image: images[idx % images.length] }));

    const isAndroid = Platform.OS === 'android';

    return (
        <View className='flex-1 bg-slate-50'>
            {/* Modern Header with Solid Background */}
            <View
                testID='home-header'
                className='flex-row w-full justify-between items-center px-6 py-4 bg-white'
                style={{
                    paddingTop: isAndroid ? insert.top + 20 : insert.top + 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f1f5f9',
                }}
            >
                <View className='flex-row items-center'>
                    <FontAwesome6 name='house' size={24} color='#3b82f6' solid />
                    <Text className='text-2xl font-bold text-slate-800 ml-3'>Explore World</Text>
                </View>
            </View>

            {/* Modern Card List */}
            <FlashList
                testID='home-flash-list'
                className='flex-1 w-full'
                data={data}
                keyExtractor={(item) => item.id}
                onLoad={(info) => console.log('FlashList onLoad', info)}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className='flex-1 items-center justify-center py-20'>
                        <FontAwesome6 name='box-open' size={48} color='rgba(255,255,255,0.6)' solid />
                        <Text className='text-white text-lg font-medium mt-4'>No content available</Text>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <ListItem item={item} index={index} />
                )}
            />
        </View>
    );
}
