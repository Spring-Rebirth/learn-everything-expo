import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import { registerRootComponent } from 'expo';
import { Image } from 'react-native';

// Polyfill Image.resolveAssetSource for newer React Native versions
// where it was removed but some libraries still depend on it
if (typeof (Image as any).resolveAssetSource === 'undefined') {
    try {
        (Image as any).resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource').default || require('react-native/Libraries/Image/resolveAssetSource');
    } catch (e) {
        console.error('Failed to polyfill Image.resolveAssetSource', e);
    }
}

import { App } from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
