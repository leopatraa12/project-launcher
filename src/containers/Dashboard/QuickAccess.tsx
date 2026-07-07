import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../components/Text";
import { EXTERNAL_LINKS } from "../../constants/links";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

const SHORTCUTS = [
  { titleKey: "quick_access_rulebook", link: EXTERNAL_LINKS.rulebook },
  { titleKey: "quick_access_support", link: EXTERNAL_LINKS.support },
  { titleKey: "quick_access_statistics", link: EXTERNAL_LINKS.statistics },
  { titleKey: "quick_access_changelog", link: EXTERNAL_LINKS.changelog },
];

const QuickAccess = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text semibold size={4} color={theme.textPrimary} style={styles.title}>
        {t("quick_access_title")}
      </Text>
      <View style={styles.row}>
        {SHORTCUTS.map((shortcut) => (
          <TouchableOpacity
            key={shortcut.titleKey}
            style={[styles.button, { backgroundColor: theme.itemBackgroundColor }]}
            onPress={() => shell.open(shortcut.link)}
          >
            <Text semibold size={2} color={theme.textPrimary}>
              {t(shortcut.titleKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    marginBottom: sc(12),
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    height: sc(44),
    paddingHorizontal: sc(18),
    borderRadius: sc(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: sc(10),
    marginBottom: sc(10),
  },
});

export default QuickAccess;
