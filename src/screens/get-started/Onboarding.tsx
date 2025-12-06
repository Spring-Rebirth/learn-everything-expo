import PagerView from 'react-native-pager-view';
import { Onboarding1 } from '../../components/Onboarding1';
import { Onboarding2 } from '../../components/Onboarding2';
import { Onboarding3 } from '../../components/Onboarding3';
import { Pressable, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/index';

export default function Onboarding() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <View className="flex-1">
            <Text className="absolute top-8 left-0 right-0 text-center text-2xl font-bold"
                style={{ marginTop: insets.top }}
            >
                {currentPage + 1} / 3
            </Text>
            <PagerView
                style={{ flex: 1 }}
                initialPage={currentPage}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <View testID='onboarding-page-1' key="1">
                    <Onboarding1 />
                </View>
                <View testID='onboarding-page-2' key="2">
                    <Onboarding2 />
                </View>
                <View testID='onboarding-page-3' key="3">
                    <Onboarding3 />
                </View>
            </PagerView>

            <Pressable
                className="bg-[#C62C46] p-4 rounded-full items-center justify-center
                    absolute bottom-16 left-0 right-0 mx-4"
                style={{ marginBottom: insets.bottom }}
                onPress={() => {
                    if (currentPage === 2) {
                        navigation.navigate('RootBottomTabs', {
                            screen: 'Home',
                        });
                    } else {
                        pagerRef.current?.setPage(currentPage + 1);
                    }
                }}
            >
                <Text className="text-white text-2xl font-bold">
                    {currentPage === 2 ? 'Get Started' : 'Next'}
                </Text>
            </Pressable>
        </View>
    );
}
