import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useThemeContext } from '../../providers/ThemeProvider';
import { usePreferencesStore } from '../../store/usePreferencesStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type PermissionState = Notifications.PermissionStatus | 'unknown';

export default function NotificationsLab() {
  const { isDark } = useThemeContext();
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('unknown');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [scheduledId, setScheduledId] = useState<string | null>(null);
  const setNotificationsEnabled = usePreferencesStore((state) => state.setNotificationsEnabled);

  useEffect(() => {
    const bootstrap = async () => {
      const settings = await Notifications.getPermissionsAsync();
      setPermissionStatus(settings.status);
      setNotificationsEnabled(settings.status === Notifications.PermissionStatus.GRANTED);
    };
    bootstrap();
  }, [setNotificationsEnabled]);

  const requestPermission = async () => {
    const result = await Notifications.requestPermissionsAsync();
    setPermissionStatus(result.status);
    setNotificationsEnabled(result.status === Notifications.PermissionStatus.GRANTED);
    if (result.status === Notifications.PermissionStatus.GRANTED) {
      await getPushToken();
    }
  };

  const getPushToken = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      setPushToken(token.data);
    } catch (err) {
      setPushToken('获取 token 失败，请在真机并配置 projectId 后重试');
    }
  };

  const scheduleLocalNotification = async () => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ 本地通知',
        body: '3 秒后触发的演示通知',
      },
      trigger: { seconds: 3 },
    });
    setScheduledId(id);
  };

  const cancelAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setScheduledId(null);
  };

  const statusLabel = (() => {
    switch (permissionStatus) {
      case Notifications.PermissionStatus.GRANTED:
        return '已授权';
      case Notifications.PermissionStatus.DENIED:
        return '已拒绝';
      case Notifications.PermissionStatus.UNDETERMINED:
        return '未询问';
      default:
        return '未知';
    }
  })();

  const bg = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#111827' : '#ffffff';
  const textColor = isDark ? '#e5e7eb' : '#0f172a';
  const subText = isDark ? '#cbd5e1' : '#475569';

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: bg }} contentContainerStyle={{ padding: 16 }}>
      <View
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: isDark ? '#1f2937' : '#e2e8f0' }}
      >
        <Text className="text-xl font-bold mb-2" style={{ color: textColor }}>
          Expo Notifications
        </Text>
        <Text style={{ color: subText }}>
          包含权限申请、获取 Expo Push Token（真机）、本地通知排程与取消。
        </Text>
      </View>

      <View
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: isDark ? '#1f2937' : '#e2e8f0' }}
      >
        <Text className="font-semibold mb-2" style={{ color: textColor }}>
          权限状态：{statusLabel}
        </Text>
        <Pressable
          onPress={requestPermission}
          className="px-4 py-3 rounded-xl mb-3"
          style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
        >
          <Text className="font-semibold text-white text-center">请求权限</Text>
        </Pressable>

        <Pressable
          onPress={getPushToken}
          disabled={permissionStatus !== Notifications.PermissionStatus.GRANTED}
          className="px-4 py-3 rounded-xl mb-3"
          style={{
            backgroundColor: permissionStatus === Notifications.PermissionStatus.GRANTED ? (isDark ? '#0f766e' : '#10b981') : '#94a3b8',
          }}
        >
          <Text className="font-semibold text-white text-center">获取 Expo Push Token</Text>
        </Pressable>

        {pushToken && (
          <View className="mt-2">
            <Text className="text-xs" style={{ color: subText }}>
              Token:
            </Text>
            <Text selectable style={{ color: textColor }}>
              {pushToken}
            </Text>
          </View>
        )}
      </View>

      <View
        className="rounded-2xl p-4 mb-4"
        style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: isDark ? '#1f2937' : '#e2e8f0' }}
      >
        <Text className="font-semibold mb-3" style={{ color: textColor }}>
          本地通知
        </Text>
        <Pressable
          onPress={scheduleLocalNotification}
          className="px-4 py-3 rounded-xl mb-3"
          style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
        >
          <Text className="font-semibold text-white text-center">3 秒后推送一条通知</Text>
        </Pressable>

        <Pressable
          onPress={cancelAll}
          className="px-4 py-3 rounded-xl"
          style={{ backgroundColor: isDark ? '#b91c1c' : '#ef4444' }}
        >
          <Text className="font-semibold text-white text-center">取消所有计划中的通知</Text>
        </Pressable>

        {scheduledId && (
          <Text className="mt-3 text-xs" style={{ color: subText }}>
            已计划通知 ID: {scheduledId}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

