import { View, Text } from 'react-native';
import Onboarding2Image from '../assets/svg/onboarding/onboarding2.svg';

export function Onboarding2() {
    return (
        <View className='flex-1 items-center justify-center'>
            <Onboarding2Image />
            <Text className='text-2xl font-bold'>Make Payment</Text>
            <Text className='text-gray-500 text-center mt-4 text-xl px-4 leading-6'>
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </Text>
        </View>
    );
}