import { t } from "i18next";
import { StyleSheet, View } from "react-native";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { AVATAR_PLACEHOLDER_COLOR } from "../../constants/brand";
import { DUMMY_PLAYER_PROGRESS } from "../../constants/dummyContent";
import { images } from "../../constants/images";
import { useSettings } from "../../states/settings";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

// No player-progression backend exists yet, so Level/XP/VIP use neutral
// placeholder data (DUMMY_PLAYER_PROGRESS) rather than fabricated real-looking
// numbers — see constants/dummyContent.ts. Wire this up to real data in Phase 3.
const UserProfile = () => {
  const { theme } = useTheme();
  const { nickName } = useSettings();

  const displayName = nickName.length ? nickName : t("nickname");
  const initial = nickName.length ? nickName[0].toUpperCase() : "?";
  const { level, xp, xpToNextLevel, isVip } = DUMMY_PLAYER_PROGRESS;
  const xpProgress = Math.min(1, xp / xpToNextLevel);

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: AVATAR_PLACEHOLDER_COLOR }]}>
          <Text semibold size={3} color="#FFFFFF">
            {initial}
          </Text>
        </View>
        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <Text semibold size={3} color={theme.textPrimary}>
              {displayName}
            </Text>
            {isVip && (
              <View style={[styles.vipBadge, { borderColor: theme.primary }]}>
                <Text semibold size={1} color={theme.primary}>
                  {t("profile_vip_badge")}
                </Text>
              </View>
            )}
          </View>
          <Text size={1} color={theme.textSecondary}>
            {t("profile_level", { level })}
          </Text>
        </View>
        <Icon
          title={t("notifications")}
          image={images.icons.bell}
          size={sc(18)}
          color={theme.textSecondary}
        />
      </View>

      <View style={styles.xpRow}>
        <Text size={1} color={theme.textSecondary}>
          {t("profile_xp_progress", { xp, xpToNextLevel })}
        </Text>
      </View>
      <View
        style={[styles.xpTrack, { backgroundColor: theme.textInputBackgroundColor }]}
      >
        <View
          style={[
            styles.xpFill,
            { backgroundColor: theme.primary, width: `${xpProgress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: sc(10),
    padding: sc(15),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: sc(40),
    height: sc(40),
    borderRadius: sc(20),
    justifyContent: "center",
    alignItems: "center",
  },
  identity: {
    flex: 1,
    marginLeft: sc(12),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vipBadge: {
    borderWidth: 1,
    borderRadius: sc(4),
    paddingHorizontal: sc(6),
    paddingVertical: sc(1),
    marginLeft: sc(8),
  },
  xpRow: {
    marginTop: sc(12),
    marginBottom: sc(6),
    alignItems: "flex-end",
  },
  xpTrack: {
    width: "100%",
    height: sc(6),
    borderRadius: sc(3),
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    borderRadius: sc(3),
  },
});

export default UserProfile;
