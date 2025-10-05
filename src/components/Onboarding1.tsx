import { View, Text } from 'react-native';
import Onboarding1Image from '../assets/svg/onboarding/onboarding1.svg';

export function Onboarding1() {
    return (
        <View className='flex-1 items-center justify-center'>
            <Onboarding1Image />
            <Text className='text-2xl font-bold'>Choose Products</Text>
            <Text className='text-gray-500 text-center mt-4 text-xl px-4 leading-6'>
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </Text>

        </View>
    );
}
