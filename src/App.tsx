import './lib/nativewind/global.css';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { Navigation } from './navigation';
import { ThemeProvider } from './providers/ThemeProvider';
import { usePreferencesStore } from './store/usePreferencesStore';

SplashScreen.preventAutoHideAsync();

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  const preferencesHydrated = usePreferencesStore((state) => state.hydrated);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const onAppStateChange = (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (preferencesHydrated) {
      setAppIsReady(true);
    }
  }, [preferencesHydrated]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // 让 SplashScreen 保持显示，直到本地偏好、待办与习惯数据全部就绪
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
