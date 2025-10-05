import * as SplashScreen from 'expo-splash-screen';
import { Navigation } from './navigation';

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <Navigation />
  );
}
