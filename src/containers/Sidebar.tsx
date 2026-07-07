import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { memo, useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../components/Icon";
import { EXTERNAL_LINKS } from "../constants/links";
import { images } from "../constants/images";
import { DashboardSection, useDashboardNav } from "../states/dashboardNav";
import { useSettingsModal } from "../states/settingsModal";
import { useTheme } from "../states/theme";
import { sc } from "../utils/sizeScaler";

interface NavItem {
  icon: string;
  title: string;
  section: DashboardSection;
}

const NAV_ITEMS: NavItem[] = [
  { icon: images.icons.home, title: "nav_home", section: "home" },
  { icon: images.icons.server, title: "nav_server", section: "server" },
  { icon: images.icons.store, title: "nav_store", section: "store" },
  { icon: images.icons.community, title: "nav_community", section: "community" },
];

const Sidebar = memo(() => {
  const { theme } = useTheme();
  const { scrollToSection } = useDashboardNav();
  const { show: showSettings } = useSettingsModal();

  const handleNavPress = useCallback(
    (section: DashboardSection) => scrollToSection(section),
    [scrollToSection]
  );

  const dynamicStyles = useMemo(
    () => ({
      container: [styles.container, { backgroundColor: theme.itemBackgroundColor }],
      navButton: [styles.navButton, { backgroundColor: theme.secondary }],
    }),
    [theme]
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={styles.topSection}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.section}
            style={dynamicStyles.navButton}
            onPress={() => handleNavPress(item.section)}
          >
            <Icon
              svg
              title={t(item.title)}
              image={item.icon}
              size={sc(20)}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={dynamicStyles.navButton} onPress={showSettings}>
          <Icon
            svg
            title={t("settings")}
            image={images.icons.settings}
            size={sc(20)}
            color={theme.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footerSection}>
        <TouchableOpacity
          style={dynamicStyles.navButton}
          onPress={() => shell.open(EXTERNAL_LINKS.discord)}
        >
          <Icon
            svg
            title={t("footer_discord")}
            image={images.icons.discord}
            size={sc(18)}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.navButton}
          onPress={() => shell.open(EXTERNAL_LINKS.website)}
        >
          <Icon
            svg
            title={t("footer_website")}
            image={images.icons.website}
            size={sc(18)}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.navButton}
          onPress={() => shell.open(EXTERNAL_LINKS.instagram)}
        >
          <Icon
            svg
            title={t("footer_instagram")}
            image={images.icons.instagram}
            size={sc(18)}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: sc(64),
    height: "100%",
    borderRadius: sc(10),
    paddingVertical: sc(15),
    justifyContent: "space-between",
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
  },
  footerSection: {
    alignItems: "center",
  },
  navButton: {
    height: sc(38),
    width: sc(38),
    borderRadius: sc(8),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: sc(10),
  },
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
