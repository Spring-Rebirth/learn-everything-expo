import { View, Text } from 'react-native';
import Onboarding3Image from '../assets/svg/onboarding/onboarding3.svg';

export function Onboarding3() {
    return (
        <View className='flex-1 items-center justify-center'>
            <Onboarding3Image />
            <Text className='text-2xl font-bold'>Get Your Order</Text>
            <Text className='text-gray-500 text-center mt-4 text-xl px-4 leading-6'>
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </Text>
        </View>
    );
}