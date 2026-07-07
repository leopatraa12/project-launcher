import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { memo, useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../components/Icon";
import Text from "../components/Text";
import { images } from "../constants/images";
import { EXTERNAL_LINKS } from "../constants/links";
import { SERVER_NAME, SERVER_TAGLINE } from "../constants/server";
import { DashboardSection, useDashboardNav } from "../states/dashboardNav";
import { useSettingsModal } from "../states/settingsModal";
import { useTheme } from "../states/theme";
import { sc } from "../utils/sizeScaler";

interface NavItem {
  icon: string;
  titleKey: string;
  section: DashboardSection | "settings";
}

const NAV_ITEMS: NavItem[] = [
  { icon: images.icons.home, titleKey: "nav_home", section: "home" },
  { icon: images.icons.server, titleKey: "nav_server", section: "server" },
  { icon: images.icons.store, titleKey: "nav_store", section: "store" },
  { icon: images.icons.community, titleKey: "nav_community", section: "community" },
  { icon: images.icons.settings, titleKey: "settings", section: "settings" },
];

// Brand name/logo assets aren't ready yet — render the two-tone wordmark from
// the SERVER_NAME constant (last word in primary color) as a placeholder;
// swap for a real logo image once one exists.
const splitBrandName = (name: string) => {
  const words = name.trim().split(" ");
  const accent = words.pop() ?? "";
  return { lead: words.join(" "), accent };
};

const Sidebar = memo(() => {
  const { theme } = useTheme();
  const { scrollToSection } = useDashboardNav();
  const { show: showSettings } = useSettingsModal();

  const brand = useMemo(() => splitBrandName(SERVER_NAME), []);

  const handleNavPress = useCallback(
    (item: NavItem) => {
      if (item.section === "settings") {
        showSettings();
      } else {
        scrollToSection(item.section);
      }
    },
    [scrollToSection, showSettings]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      <View>
        <View style={styles.brandBlock}>
          <Text semibold size={3} color={theme.textPrimary}>
            {brand.lead}
          </Text>
          <Text semibold size={3} color={theme.primary}>
            {brand.accent}
          </Text>
          <Text
            size={1}
            color={theme.textSecondary}
            numberOfLines={2}
            style={styles.tagline}
          >
            {SERVER_TAGLINE}
          </Text>
        </View>

        <View style={styles.navList}>
          {NAV_ITEMS.map((item, index) => {
            // "home" is the default landing scroll target; treated as active at rest.
            const isActive = index === 0;
            return (
              <TouchableOpacity
                key={item.section}
                style={[
                  styles.navItem,
                  isActive && { backgroundColor: `${theme.primary}26` },
                ]}
                onPress={() => handleNavPress(item)}
              >
                <Icon
                  svg
                  image={item.icon}
                  size={sc(18)}
                  color={isActive ? theme.primary : theme.textSecondary}
                />
                <Text
                  semibold
                  size={2}
                  color={isActive ? theme.primary : theme.textPrimary}
                  style={styles.navItemLabel}
                >
                  {t(item.titleKey)}
                </Text>
                {isActive && (
                  <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.footerSection, { borderTopColor: theme.textInputBackgroundColor }]}>
        <TouchableOpacity onPress={() => shell.open(EXTERNAL_LINKS.discord)}>
          <Icon
            svg
            title={t("footer_discord")}
            image={images.icons.discord}
            size={sc(18)}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shell.open(EXTERNAL_LINKS.website)}>
          <Icon
            svg
            title={t("footer_website")}
            image={images.icons.website}
            size={sc(18)}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shell.open(EXTERNAL_LINKS.instagram)}>
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
    width: sc(210),
    height: "100%",
    borderRadius: sc(10),
    padding: sc(15),
    justifyContent: "space-between",
  },
  brandBlock: {
    marginBottom: sc(24),
  },
  tagline: {
    marginTop: sc(4),
    textTransform: "uppercase",
  },
  navList: {
    width: "100%",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    height: sc(42),
    paddingHorizontal: sc(12),
    borderRadius: sc(8),
    marginBottom: sc(6),
  },
  navItemLabel: {
    marginLeft: sc(12),
    flex: 1,
  },
  activeDot: {
    width: sc(6),
    height: sc(6),
    borderRadius: sc(3),
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: sc(15),
    borderTopWidth: 1,
    gap: sc(20),
  },
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
