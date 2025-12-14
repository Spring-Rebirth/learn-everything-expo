import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default function UploadScreen() {
  // 状态管理
  const [imageUri, setImageUri] = useState<string | null>(null); // 本地图片路径
  const [uploading, setUploading] = useState(false); // 是否正在上传
  const [transferred, setTransferred] = useState(0); // 上传进度 (0-100)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // 上传成功后的云端链接

  // 1. 选择图片
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      // 如果用户取消了选择
      if (response.didCancel) return;
      // 如果出错了
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      // 获取图片 URI
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setImageUri(asset.uri);
        setDownloadUrl(null); // 重置之前的上传结果
      }
    });
  };

  // 2. 上传图片的核心逻辑
  const uploadImage = async () => {
    if (!imageUri) return;

    // 获取文件名 (为了防止重名覆盖，建议加上时间戳)
    // 逻辑：取出路径最后的部分作为文件名
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

    // 设置是否正在上传的状态
    setUploading(true);
    setTransferred(0);

    // 【核心步骤 A】：创建 Storage 引用
    // 这里的 'images/' 是云端文件夹的名字，会自动创建
    const reference = storage().ref(`images/${filename}`);

    // 【核心步骤 B】：针对不同平台的路径处理
    // iOS 可以直接用 uri ('file:///...')
    // Android 有时需要处理 'content://'，但 putFile 通常能处理
    const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

    // 【核心步骤 C】：执行上传任务 (使用 putFile)
    const task = reference.putFile(uploadUri);

    // 【核心步骤 D】：监听上传进度
    task.on('state_changed', (snapshot) => {
      // 计算百分比
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setTransferred(Math.round(progress));
    });

    try {
      // 等待任务完成
      await task;

      // 【核心步骤 E】：获取下载链接 (这是你存入数据库用的链接)
      const url = await reference.getDownloadURL();
      setDownloadUrl(url);

      Alert.alert('成功', '图片上传完成！');
    } catch (e) {
      console.error(e);
      Alert.alert('失败', '上传出错，请检查控制台');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase 图片上传演示</Text>

      {/* 图片预览区域 */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {/* 按钮区域 */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>1. 从相册选择图片</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnContainer}>
        {uploading ? (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text>{transferred}% 已上传</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, !imageUri && styles.buttonDisabled]}
            onPress={uploadImage}
            disabled={!imageUri} // 没有图片时禁用按钮
          >
            <Text style={[styles.buttonText, !imageUri && styles.buttonTextDisabled]}>
              2. 上传到 Firebase
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 显示结果 */}
      {downloadUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.successText}>上传成功！云端链接如下：</Text>
          <Text style={styles.urlText}>{downloadUrl}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  btnContainer: {
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#666666',
  },
  progressContainer: {
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
  },
  urlText: {
    fontSize: 10,
    color: '#333',
    marginTop: 5,
  },
});
