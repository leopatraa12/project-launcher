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
      <View onLayout={registerOffset("home")} style={styles.topRow}>
        <View style={styles.heroColumn}>
          <Hero />
        </View>
        <View onLayout={registerOffset("server")} style={styles.sideColumn}>
          <UserProfile />
          <ServerInfo />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View onLayout={registerOffset("community")} style={styles.bottomColumn}>
          <CommunityUpdate />
        </View>
        <View onLayout={registerOffset("store")} style={styles.bottomColumn}>
          <FeaturedStore />
        </View>
        <View style={styles.bottomColumn}>
          <QuickAccess />
        </View>
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
  topRow: {
    flexDirection: "row",
    gap: sc(15),
  },
  heroColumn: {
    flex: 2,
  },
  sideColumn: {
    flex: 1,
    gap: sc(15),
  },
  bottomRow: {
    flexDirection: "row",
    marginTop: sc(15),
    gap: sc(15),
  },
  bottomColumn: {
    flex: 1,
  },
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
