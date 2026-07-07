import { t } from "i18next";
import { StyleSheet, View } from "react-native";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { images } from "../../constants/images";
import {
  COMMUNITY_UPDATES,
  CommunityUpdateType,
} from "../../constants/dummyContent";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

// Phase 3: replace COMMUNITY_UPDATES with a real backend feed (see docs/prd.md §8.6).
const TYPE_META: Record<CommunityUpdateType, { icon: string; iconColor: string }> = {
  announcement: { icon: images.icons.megaphone, iconColor: "#22C55E" },
  event: { icon: images.icons.calendar, iconColor: "#22C55E" },
  discord: { icon: images.icons.discord, iconColor: "#5865F2" },
  maintenance: { icon: images.icons.calendar, iconColor: "#F59E0B" },
};

const CommunityUpdate = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      <Text semibold size={2} color={theme.textPrimary} style={styles.title}>
        {t("community_update_title")}
      </Text>
      <View style={styles.list}>
        {COMMUNITY_UPDATES.map((item) => {
          const meta = TYPE_META[item.type];
          return (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconSquare, { backgroundColor: `${meta.iconColor}26` }]}>
                <Icon svg image={meta.icon} size={sc(16)} color={meta.iconColor} />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text semibold size={2} color={theme.textPrimary}>
                    {item.title}
                  </Text>
                  <Text size={1} color={theme.textSecondary}>
                    {item.badge}
                  </Text>
                </View>
                <Text
                  size={1}
                  color={theme.textSecondary}
                  numberOfLines={2}
                  style={styles.description}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
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
  card: {
    flexDirection: "row",
    marginBottom: sc(12),
  },
  iconSquare: {
    width: sc(34),
    height: sc(34),
    borderRadius: sc(8),
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    marginLeft: sc(10),
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  description: {
    marginTop: sc(2),
  },
});

export default CommunityUpdate;
