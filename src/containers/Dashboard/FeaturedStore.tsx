import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { EXTERNAL_LINKS } from "../../constants/links";
import { images } from "../../constants/images";
import {
  FEATURED_STORE_ITEMS,
  FeaturedStoreItem,
} from "../../constants/dummyContent";
import { useTheme } from "../../states/theme";
import { sc } from "../../utils/sizeScaler";

const ICON_MAP: Record<FeaturedStoreItem["icon"], string> = {
  crown: images.icons.crown,
  car: images.icons.car,
  users: images.icons.users,
  coin: images.icons.coin,
};

const VIP_ACCENT_COLOR = "#F5B942";

// Phase 3: replace FEATURED_STORE_ITEMS with real store data (see docs/prd.md §8.7).
const FeaturedStore = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      <Text semibold size={2} color={theme.textPrimary} style={styles.title}>
        {t("featured_store_title")}
      </Text>
      <View style={styles.grid}>
        {FEATURED_STORE_ITEMS.map((item) => {
          const isVip = item.type === "vip";
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tile,
                {
                  backgroundColor: isVip
                    ? `${VIP_ACCENT_COLOR}1F`
                    : theme.textInputBackgroundColor,
                  borderColor: isVip ? VIP_ACCENT_COLOR : "transparent",
                },
              ]}
              onPress={() => shell.open(EXTERNAL_LINKS.store)}
            >
              <Icon
                svg
                image={ICON_MAP[item.icon]}
                size={sc(22)}
                color={isVip ? VIP_ACCENT_COLOR : theme.primary}
              />
              <Text
                semibold
                size={1}
                color={theme.textPrimary}
                numberOfLines={2}
                style={styles.tileTitle}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: sc(10),
  },
  tile: {
    flexBasis: "47%",
    flexGrow: 1,
    height: sc(96),
    borderRadius: sc(8),
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    padding: sc(8),
  },
  tileTitle: {
    marginTop: sc(8),
    textAlign: "center",
  },
});

export default FeaturedStore;
