import PagerView from 'react-native-pager-view';
import { Onboarding1 } from '../../../components/Onboarding1';
import { Onboarding2 } from '../../../components/Onboarding2';
import { Onboarding3 } from '../../../components/Onboarding3';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Onboarding() {
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <View className="flex-1">
            <PagerView
                style={{ flex: 1 }}
                initialPage={currentPage}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <Onboarding1 key="1" />
                <Onboarding2 key="2" />
                <Onboarding3 key="3" />
            </PagerView>

        </View>
    );
}
