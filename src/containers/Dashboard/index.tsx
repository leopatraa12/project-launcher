import { memo, useCallback, useEffect, useRef } from "react";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import { useDashboardNav } from "../../states/dashboardNav";
import { sc } from "../../utils/sizeScaler";
import CommunityUpdate from "./CommunityUpdate";
import FeaturedStore from "./FeaturedStore";
import Hero from "./Hero";
import QuickAccess from "./QuickAccess";
import ServerInfo from "./ServerInfo";
import UserProfile from "./UserProfile";

const Dashboard = memo(() => {
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const { requestedSection, clearRequestedSection } = useDashboardNav();

  useEffect(() => {
    if (!requestedSection) return;

    const offset = sectionOffsets.current[requestedSection];
    if (offset !== undefined) {
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    }

    clearRequestedSection();
  }, [requestedSection, clearRequestedSection]);

  const registerOffset = useCallback(
    (section: string) => (event: LayoutChangeEvent) => {
      sectionOffsets.current[section] = event.nativeEvent.layout.y;
    },
    []
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.content}
    >
      <View onLayout={registerOffset("home")}>
        <UserProfile />
        <Hero />
      </View>
      <View onLayout={registerOffset("server")} style={styles.section}>
        <ServerInfo />
      </View>
      <View onLayout={registerOffset("community")} style={styles.section}>
        <CommunityUpdate />
      </View>
      <View onLayout={registerOffset("store")} style={styles.section}>
        <FeaturedStore />
      </View>
      <View style={styles.section}>
        <QuickAccess />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginLeft: sc(15),
  },
  content: {
    paddingBottom: sc(20),
  },
  section: {
    marginTop: sc(20),
  },
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
