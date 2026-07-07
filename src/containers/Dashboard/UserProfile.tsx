import { t } from "i18next";
import { StyleSheet, View } from "react-native";
import Text from "../../components/Text";
import { AVATAR_PLACEHOLDER_COLOR } from "../../constants/brand";
import { useSettings } from "../../states/settings";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

// No player-progression backend exists yet, so this only shows avatar + nickname.
// Level/XP/VIP badge intentionally omitted rather than filled with fake numbers —
// see docs/prd.md §"User Profile" and add it here once that backend exists.
const UserProfile = () => {
  const { theme } = useTheme();
  const { nickName } = useSettings();

  const displayName = nickName.length ? nickName : t("nickname");
  const initial = nickName.length ? nickName[0].toUpperCase() : "?";

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: AVATAR_PLACEHOLDER_COLOR }]}>
        <Text semibold size={3} color="#FFFFFF">
          {initial}
        </Text>
      </View>
      <Text semibold size={3} color={theme.textPrimary} style={styles.name}>
        {displayName}
      </Text>
      {/* VIP/Level/XP badge — Phase 3, needs player-progression backend */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sc(12),
  },
  avatar: {
    width: sc(40),
    height: sc(40),
    borderRadius: sc(20),
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginLeft: sc(12),
  },
});

export default UserProfile;
