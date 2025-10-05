import './lib/nativewind/global.css';
import * as SplashScreen from 'expo-splash-screen';
import { Navigation } from './navigation';

SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export function App() {
  return (
    <Navigation />
  );
}
