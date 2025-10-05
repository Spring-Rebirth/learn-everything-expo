import PagerView from 'react-native-pager-view';
import { Onboarding1 } from '../../../components/Onboarding1';
import { Onboarding2 } from '../../../components/Onboarding2';
import { Onboarding3 } from '../../../components/Onboarding3';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Onboarding() {
    return (
        <View>
            <Text>Onboarding</Text>
        </View>
    );
}
