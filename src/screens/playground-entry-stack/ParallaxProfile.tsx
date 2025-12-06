import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PagerView from 'react-native-pager-view';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
    Extrapolate,
    useDerivedValue,
    runOnJS,
    useAnimatedReaction,
    useAnimatedRef,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 250;
const TAB_BAR_HEIGHT = 48;

const DATA1 = Array.from({ length: 30 }).map((_, i) => ({ id: i, text: `Photos Item ${i + 1}` }));
const DATA2 = Array.from({ length: 20 }).map((_, i) => ({ id: i, text: `Likes Item ${i + 1}` }));

export default function ParallaxProfile() {
    const insets = useSafeAreaInsets();
    const SAFE_AREA_HEIGHT = insets.top;
    const [statusBarStyle, setStatusBarStyle] = React.useState<'light' | 'dark'>('light');

    // 状态管理
    const activePage = useSharedValue(0);
    const scrollY1 = useSharedValue(0);
    const scrollY2 = useSharedValue(0);

    // 引用列表实例，用于同步位置
    const listRef1 = useAnimatedRef<FlatList>();
    const listRef2 = useAnimatedRef<FlatList>();

    // 核心：Header 位置由当前激活的页面的滚动值驱动
    const scrollY = useDerivedValue(() => {
        return activePage.value === 0 ? scrollY1.value : scrollY2.value;
    });

    // 监听滚动，切换 StatusBar 样式
    useAnimatedReaction(
        () => scrollY.value > HEADER_HEIGHT - SAFE_AREA_HEIGHT - 50,
        (isDark, prevIsDark) => {
            if (isDark !== prevIsDark) {
                runOnJS(setStatusBarStyle)(isDark ? 'dark' : 'light');
            }
        }
    );

    // Scroll Handlers
    const scrollHandler1 = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY1.value = event.contentOffset.y;
        },
    });

    const scrollHandler2 = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY2.value = event.contentOffset.y;
        },
    });

    // 页面切换时的同步逻辑
    const handlePageSelected = (e: any) => {
        const position = e.nativeEvent.position;
        activePage.value = position;

        // 这里的逻辑在 JS 线程执行，因为 PagerView 的回调是 JS 的
        // 但我们需要读取 Reanimated 的 SharedValues

        // 策略：
        // 1. 获取当前的 Header 折叠状态 (即 scrollY 的值)
        // 2. 获取目标列表的当前滚动位置 (需要 listRef.current.contentOffset? 不，我们有 scrollY1/2)
        // 3. 如果 Header 处于半展开状态 (0 < scrollY < HEADER_HEIGHT)，强制将目标列表滚动到相同位置
        // 4. 如果 Header 已完全收起 (scrollY >= HEADER_HEIGHT)，确保目标列表至少滚动到了 HEADER_HEIGHT

        // 注意：直接读取 .value 在 JS 线程可能不是最新的，但在 onPageSelected 这种低频事件中通常没问题。

        const currentHeaderOffset = activePage.value === 0 ? scrollY2.value : scrollY1.value; // 注意：此时 activePage 已经更新了，但我们想知道的是“切换前”的状态？
        // 不，activePage.value = position 已经执行了。所以 scrollY 已经是新页面的值了。
        // 我们需要比较的是：新页面的 offset 和 旧页面的 offset。

        // 让我们换个思路：
        const targetOffset = position === 0 ? scrollY1.value : scrollY2.value;
        const prevOffset = position === 0 ? scrollY2.value : scrollY1.value;

        // 阈值：Header 完全收起所需的滚动距离
        // 注意：Tab 吸顶时，Header 实际上移动了 HEADER_HEIGHT - SAFE_AREA_HEIGHT ?
        // 不，Header 移动距离就是 scrollY。
        // TabBar 吸顶时，scrollY = HEADER_HEIGHT - SAFE_AREA_HEIGHT。
        const stickyThreshold = HEADER_HEIGHT - SAFE_AREA_HEIGHT;

        if (prevOffset < stickyThreshold) {
            // 如果旧页面 Header 还没收起（或者半展开），新页面必须同步到相同位置，否则 Header 会跳变
            if (position === 0) {
                listRef1.current?.scrollToOffset({ offset: prevOffset, animated: false });
            } else {
                listRef2.current?.scrollToOffset({ offset: prevOffset, animated: false });
            }
        } else {
            // 如果旧页面 Header 已经完全收起（吸顶了）
            // 我们要检查新页面是否也“足够深”
            if (targetOffset < stickyThreshold) {
                // 新页面还没滚够，强制它滚到吸顶位置，保持 Header 收起状态
                if (position === 0) {
                    listRef1.current?.scrollToOffset({ offset: stickyThreshold, animated: false });
                } else {
                    listRef2.current?.scrollToOffset({ offset: stickyThreshold, animated: false });
                }
            }
            // 如果新页面已经滚得很深了，那就保持原样，不用动
        }
    };

    // 样式定义
    const headerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT],
            Extrapolate.CLAMP
        );
        return { transform: [{ translateY }] };
    });

    // 吸顶背景层动画样式 (纯色背景)
    const stickyHeaderBgStyle = useAnimatedStyle(() => {
        // 当 scrollY 接近 HEADER_HEIGHT - SAFE_AREA_HEIGHT 时，透明度从 0 变 1
        const triggerPoint = HEADER_HEIGHT - SAFE_AREA_HEIGHT - TAB_BAR_HEIGHT;
        const opacity = interpolate(
            scrollY.value,
            [triggerPoint, HEADER_HEIGHT - SAFE_AREA_HEIGHT],
            [0, 1],
            Extrapolate.CLAMP
        );
        return { opacity };
    });

    const tabBarStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT + SAFE_AREA_HEIGHT],
            Extrapolate.CLAMP
        );
        return { transform: [{ translateY }] };
    });

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.listItem}>
            <Text>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style={statusBarStyle} />

            <Animated.View style={[styles.headerContainer, headerStyle]}>
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
            </Animated.View>

            {/* 状态栏区域遮挡层 */}
            <Animated.View
                style={[
                    styles.statusBarCover,
                    { height: SAFE_AREA_HEIGHT },
                    stickyHeaderBgStyle
                ]}
            />

            <Animated.View style={[styles.tabBarContainer, tabBarStyle]}>
                <View style={styles.tabItem}>
                    <Text style={styles.tabText}>Photos</Text>
                </View>
                <View style={styles.tabItem}>
                    <Text style={styles.tabText}>Likes</Text>
                </View>
            </Animated.View>

            <PagerView
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={handlePageSelected}
            >
                <View key="1" style={styles.page}>
                    <Animated.FlatList
                        ref={listRef1}
                        data={DATA1}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        onScroll={scrollHandler1}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT + 10,
                            paddingBottom: 50
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View key="2" style={styles.page}>
                    <Animated.FlatList
                        ref={listRef2}
                        data={DATA2}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        onScroll={scrollHandler2}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT + 10,
                            paddingBottom: 50
                        }}
                        showsVerticalScrollIndicator={false}
                    />
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
        zIndex: 100,
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
    statusBarCover: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 101,
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
        top: HEADER_HEIGHT,
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
    },
    page: {
        flex: 1,
    },
    listItem: {
        height: 80,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
});
