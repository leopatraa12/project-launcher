import { t } from "i18next";
import { StyleSheet, View } from "react-native";
import Text from "../../components/Text";
import {
  COMMUNITY_UPDATES,
  CommunityUpdateType,
} from "../../constants/dummyContent";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

// Phase 3: replace COMMUNITY_UPDATES with a real backend feed (see docs/prd.md §8.6).
const TYPE_LABEL_KEYS: Record<CommunityUpdateType, string> = {
  announcement: "community_type_announcement",
  event: "community_type_event",
  discord: "community_type_discord",
  maintenance: "community_type_maintenance",
};

const CommunityUpdate = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text semibold size={4} color={theme.textPrimary} style={styles.title}>
        {t("community_update_title")}
      </Text>
      <View style={styles.list}>
        {COMMUNITY_UPDATES.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: theme.itemBackgroundColor }]}
          >
            <Text semibold size={1} color={theme.primary} style={styles.badge}>
              {t(TYPE_LABEL_KEYS[item.type])}
            </Text>
            <Text semibold size={2} color={theme.textPrimary}>
              {item.title}
            </Text>
            <Text
              size={1}
              color={theme.textSecondary}
              numberOfLines={2}
              style={styles.description}
            >
              {item.description}
            </Text>
          </View>
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
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: sc(220),
    borderRadius: sc(8),
    padding: sc(12),
    marginRight: sc(10),
    marginBottom: sc(10),
  },
  badge: {
    marginBottom: sc(4),
  },
  description: {
    marginTop: sc(4),
  },
});

export default CommunityUpdate;
