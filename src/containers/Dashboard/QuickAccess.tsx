import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { EXTERNAL_LINKS } from "../../constants/links";
import { images } from "../../constants/images";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

const SHORTCUTS = [
  {
    icon: images.icons.document,
    titleKey: "quick_access_rulebook",
    subtitleKey: "quick_access_rulebook_subtitle",
    link: EXTERNAL_LINKS.rulebook,
  },
  {
    icon: images.icons.headset,
    titleKey: "quick_access_support",
    subtitleKey: "quick_access_support_subtitle",
    link: EXTERNAL_LINKS.support,
  },
  {
    icon: images.icons.chart,
    titleKey: "quick_access_statistics",
    subtitleKey: "quick_access_statistics_subtitle",
    link: EXTERNAL_LINKS.statistics,
  },
  {
    icon: images.icons.document,
    titleKey: "quick_access_changelog",
    subtitleKey: "quick_access_changelog_subtitle",
    link: EXTERNAL_LINKS.changelog,
  },
];

const QuickAccess = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      <Text semibold size={2} color={theme.textPrimary} style={styles.title}>
        {t("quick_access_title")}
      </Text>
      <View style={styles.list}>
        {SHORTCUTS.map((shortcut) => (
          <TouchableOpacity
            key={shortcut.titleKey}
            style={[styles.row, { backgroundColor: theme.textInputBackgroundColor }]}
            onPress={() => shell.open(shortcut.link)}
          >
            <View style={[styles.iconSquare, { backgroundColor: `${theme.primary}26` }]}>
              <Icon svg image={shortcut.icon} size={sc(15)} color={theme.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text semibold size={2} color={theme.textPrimary}>
                {t(shortcut.titleKey)}
              </Text>
              <Text size={1} color={theme.textSecondary}>
                {t(shortcut.subtitleKey)}
              </Text>
            </View>
            <Icon
              svg
              image={images.icons.chevronRight}
              size={sc(14)}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: sc(10),
    padding: sc(15),
  },
  title: {
    marginBottom: sc(12),
    textTransform: "uppercase",
  },
  list: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: sc(8),
    padding: sc(10),
    marginBottom: sc(10),
  },
  iconSquare: {
    width: sc(32),
    height: sc(32),
    borderRadius: sc(7),
    justifyContent: "center",
    alignItems: "center",
  },
  rowBody: {
    flex: 1,
    marginLeft: sc(10),
  },
});

export default QuickAccess;
