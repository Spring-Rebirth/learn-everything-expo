import { useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useThemeContext } from '../../providers/ThemeProvider';

export default function CameraLab() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [saving, setSaving] = useState(false);
  const { isDark } = useThemeContext();

  const bg = isDark ? '#0f172a' : '#f8fafc';
  const textColor = isDark ? '#e5e7eb' : '#0f172a';
  const cardBg = isDark ? '#111827' : '#ffffff';

  if (!cameraPermission) {
    return null;
  }

  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: bg }}>
        <Text className="text-lg mb-4 font-semibold" style={{ color: textColor }}>
          需要相机权限
        </Text>
        <Pressable
          onPress={requestCameraPermission}
          className="px-4 py-3 rounded-xl"
          style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
        >
          <Text className="text-white font-semibold">请求相机权限</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      setCapturedUri(photo.uri);
    }
  };

  const savePicture = async () => {
    if (!capturedUri) return;
    const permission = mediaPermission ?? (await requestMediaPermission());
    if (!permission?.granted) {
      await requestMediaPermission();
      return;
    }
    try {
      setSaving(true);
      await MediaLibrary.saveToLibraryAsync(capturedUri);
    } finally {
      setSaving(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      />

      <View
        className="p-4"
        style={{
          backgroundColor: cardBg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: 1,
          borderColor: isDark ? '#1f2937' : '#e2e8f0',
        }}
      >
        <Text className="font-semibold mb-2" style={{ color: textColor }}>
          简易相机
        </Text>
        <View className="flex-row justify-between mb-3">
          <Pressable
            onPress={toggleFacing}
            className="px-4 py-3 rounded-xl flex-1 mr-2"
            style={{ backgroundColor: isDark ? '#1f2937' : '#e2e8f0' }}
          >
            <Text className="text-center font-semibold" style={{ color: textColor }}>
              切换镜头
            </Text>
          </Pressable>
          <Pressable
            onPress={takePicture}
            className="px-4 py-3 rounded-xl flex-1 ml-2"
            style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
          >
            <Text className="text-center font-semibold text-white">拍照</Text>
          </Pressable>
        </View>

        <Pressable
          disabled={!capturedUri || saving}
          onPress={savePicture}
          className="px-4 py-3 rounded-xl mb-3"
          style={{ backgroundColor: capturedUri ? (isDark ? '#0f766e' : '#10b981') : '#94a3b8' }}
        >
          <Text className="text-center font-semibold text-white">
            {saving ? '保存中...' : '保存到相册'}
          </Text>
        </Pressable>

        {capturedUri && (
          <View>
            <Text className="mb-2" style={{ color: textColor }}>预览：</Text>
            <Image
              source={{ uri: capturedUri }}
              style={{
                height: 220,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDark ? '#1f2937' : '#e2e8f0',
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

