import { t } from "i18next";
import { useMemo, useState } from "react";
import { shell } from "@tauri-apps/api";
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../../../components/Icon";
import Text from "../../../components/Text";
import { images } from "../../../constants/images";
import { PING_TIMEOUT_VALUE } from "../../../utils/query";
import { useServers } from "../../../states/servers";
import { useTheme } from "../../../states/theme";
import { sc } from "../../../utils/sizeScaler";
import { validateWebUrl } from "../../../utils/validation";
import AdditionalInfo from "./AdditionalInfo";
import BottomBar from "./BottomBar";
import PlayerList from "./PlayerList";

interface StatTileProps {
  label: string;
  value: string;
}

const StatTile = ({ label, value }: StatTileProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.statTile, { backgroundColor: theme.itemBackgroundColor }]}
    >
      <Text size={1} color={theme.textSecondary}>
        {label}
      </Text>
      <Text semibold size={3} color={theme.textPrimary}>
        {value}
      </Text>
    </View>
  );
};

const ServerInfo = () => {
  const { theme, themeType } = useTheme();
  const { selected } = useServers();
  const [showLiveDetails, setShowLiveDetails] = useState(false);

  // The UDP query protocol only tells us whether the server responded (online)
  // or timed out (offline) — there's no distinct "maintenance" signal to detect,
  // so that status is left defined in the theme for future use but not surfaced here.
  const isOnline = !!selected && selected.ping !== PING_TIMEOUT_VALUE;
  const statusColor = isOnline ? theme.statusOnline : theme.statusOffline;
  const statusLabel = isOnline ? t("status_online") : t("status_offline");

  const webUrl = useMemo(() => {
    if (selected) {
      if (validateWebUrl(selected.rules.weburl)) {
        return selected.rules.weburl;
      }
    }
    return "";
  }, [selected]);

  const bannerUrl = useMemo(() => {
    if (!selected?.omp) return "";

    const { bannerDark, bannerLight } = selected.omp;
    const preferredBanner = themeType === "dark" ? bannerDark : bannerLight;
    const fallbackBanner = themeType === "dark" ? bannerLight : bannerDark;

    return preferredBanner || fallbackBanner || "";
  }, [selected?.omp?.bannerDark, selected?.omp?.bannerLight, themeType]);

  if (!selected) {
    return (
      <View style={[styles.container, { backgroundColor: theme.secondary }]}>
        <Text color={theme.textSecondary}>{t("server_info_title")}...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.secondary }]}>
      <View style={styles.headerRow}>
        <Text semibold size={4} color={theme.textPrimary}>
          {t("server_info_title")}
        </Text>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text semibold size={1} color={statusColor}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.statTilesRow}>
        <StatTile
          label={t("server_info_players_online")}
          value={`${selected.playerCount}`}
        />
        <StatTile
          label={t("server_info_max_players")}
          value={`${selected.maxPlayers}`}
        />
        <StatTile
          label={t("server_info_ping")}
          value={isOnline ? `${selected.ping} ms` : "-"}
        />
        <StatTile label={t("server_info_version")} value={selected.version} />
        <StatTile
          label={t("server_info_voice_status")}
          value={t("server_info_voice_status_unavailable")}
        />
      </View>

      <BottomBar />

      <View
        style={[
          styles.bannerContainer,
          { height: bannerUrl.length ? sc(90) : sc(35) },
        ]}
      >
        <div title={webUrl} style={{ width: "100%", height: "100%" }}>
          <Pressable
            disabled={webUrl.length < 1}
            style={styles.bannerPressable}
            onPress={() =>
              shell.open(webUrl.includes("http") ? webUrl : "https://" + webUrl)
            }
          >
            {bannerUrl.length ? (
              <Image
                source={{ uri: bannerUrl }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            ) : webUrl.length ? (
              <>
                <Icon svg image={images.icons.link} size={sc(29)} />
                <Text
                  semibold
                  size={1}
                  color={theme.textPrimary}
                  style={{ marginLeft: sc(5) }}
                >
                  {webUrl}
                </Text>
              </>
            ) : null}
          </Pressable>
        </div>
      </View>

      <TouchableOpacity
        style={styles.liveDetailsToggle}
        onPress={() => setShowLiveDetails((prev) => !prev)}
      >
        <Text semibold size={2} color={theme.primary}>
          {t("server_info_live_details_toggle")}{" "}
          {showLiveDetails ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showLiveDetails && (
        <View style={styles.liveDetailsRow}>
          <View style={styles.liveDetailsColumn}>
            <PlayerList players={selected.players} />
          </View>
          <View style={styles.liveDetailsColumn}>
            <AdditionalInfo server={selected} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: sc(10),
    padding: sc(15),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sc(12),
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: sc(8),
    height: sc(8),
    borderRadius: sc(4),
    marginRight: sc(6),
  },
  statTilesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: sc(12),
  },
  statTile: {
    flexGrow: 1,
    minWidth: sc(100),
    marginRight: sc(8),
    marginBottom: sc(8),
    borderRadius: sc(8),
    padding: sc(10),
  },
  bannerContainer: {
    width: "100%",
    marginTop: sc(8),
    marginBottom: sc(8),
    borderRadius: sc(5),
    overflow: "hidden",
  },
  bannerPressable: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    paddingLeft: sc(12),
  },
  bannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  liveDetailsToggle: {
    marginTop: sc(4),
    marginBottom: sc(8),
  },
  liveDetailsRow: {
    flexDirection: "row",
    height: sc(300),
  },
  liveDetailsColumn: {
    flex: 1,
    marginRight: sc(10),
  },
});

export default ServerInfo;
