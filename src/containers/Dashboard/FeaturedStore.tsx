import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../components/Text";
import { EXTERNAL_LINKS } from "../../constants/links";
import {
  FEATURED_STORE_ITEMS,
  FeaturedStoreType,
} from "../../constants/dummyContent";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

// Phase 3: replace FEATURED_STORE_ITEMS with real store data (see docs/prd.md §8.7).
const TYPE_LABEL_KEYS: Record<FeaturedStoreType, string> = {
  vip: "store_type_vip",
  vehicle: "store_type_vehicle",
  bundle: "store_type_bundle",
  coin: "store_type_coin",
};

const FeaturedStore = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text semibold size={4} color={theme.textPrimary} style={styles.title}>
        {t("featured_store_title")}
      </Text>
      <View style={styles.grid}>
        {FEATURED_STORE_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.tile, { backgroundColor: theme.itemBackgroundColor }]}
            onPress={() => shell.open(EXTERNAL_LINKS.store)}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    width: sc(180),
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

export default FeaturedStore;
