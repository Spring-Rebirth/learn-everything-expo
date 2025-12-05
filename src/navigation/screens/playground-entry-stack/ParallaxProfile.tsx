import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PagerView from 'react-native-pager-view';
import Animated from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = 250;
const TAB_BAR_HEIGHT = 48;

export default function ParallaxProfile() {
    
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* 1. 绝对定位的 Header */}
            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2000&auto=format&fit=crop' }}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                <View style={styles.headerOverlay} />
                <View style={styles.headerContent}>
                    <View style={styles.avatar} />
                    <Text style={styles.name}>John Doe</Text>
                </View>
            </View>

            {/* 2. 绝对定位的 TabBar (初始位置在 Header 下方) */}
            {/* 注意：在实际动画中，它的 translateY 会变化 */}
            <View style={styles.tabBarContainer}>
                <View style={styles.tabItem}>
                    <Text style={styles.tabText}>Photos</Text>
                </View>
                <View style={styles.tabItem}>
                    <Text style={styles.tabText}>Likes</Text>
                </View>
            </View>

            {/* 3. 左右滑动的 PagerView */}
            {/* 它的 zIndex 应该比 Header 低，内容会被 Header 遮挡 */}
            {/* 但为了能触摸到，我们需要处理 padding */}
            <PagerView style={styles.pagerView} initialPage={0}>
                
                {/* Page 1 */}
                <View key="1" style={styles.page}>
                    {/* 这里将来会是 FlatList，现在先用 View 占位 */}
                    {/* 我们需要一个占位符让内容从 Header 下方开始 */}
                    <View style={{ height: HEADER_HEIGHT + TAB_BAR_HEIGHT, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                        <Text style={{ marginTop: 100, textAlign: 'center' }}>Header Placeholder</Text>
                    </View>
                    
                    <View style={{ padding: 20 }}>
                        <Text>List Content Start...</Text>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <View key={i} style={{ height: 100, backgroundColor: '#eee', marginVertical: 10 }} />
                        ))}
                    </View>
                </View>

                {/* Page 2 */}
                <View key="2" style={styles.page}>
                     <View style={{ height: HEADER_HEIGHT + TAB_BAR_HEIGHT, backgroundColor: 'rgba(0,0,255,0.1)' }}>
                        <Text style={{ marginTop: 100, textAlign: 'center' }}>Header Placeholder</Text>
                     </View>
                    <View style={{ padding: 20 }}>
                         <Text>Page 2 Content...</Text>
                    </View>
                </View>
            </PagerView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 100, // 确保在最上面
        // backgroundColor: 'blue', // debug
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
        borderWidth: 2,
        borderColor: 'white',
        marginRight: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    tabBarContainer: {
        position: 'absolute',
        top: HEADER_HEIGHT, // 初始位置紧接 Header
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT,
        backgroundColor: 'white',
        flexDirection: 'row',
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    pagerView: {
        flex: 1,
        // zIndex: 0, 
        // 注意：PagerView 默认在文档流中，会被 absolute 的 Header 覆盖
    },
    page: {
        flex: 1,
        // backgroundColor: 'yellow', // debug
    },
});

