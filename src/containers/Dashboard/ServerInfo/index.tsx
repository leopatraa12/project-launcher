import { shell } from "@tauri-apps/api";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../../../components/Icon";
import Text from "../../../components/Text";
import { images } from "../../../constants/images";
import { useServers } from "../../../states/servers";
import { useTheme } from "../../../states/theme";
import { PING_TIMEOUT_VALUE } from "../../../utils/query";
import { sc } from "../../../utils/sizeScaler";
import { validateWebUrl } from "../../../utils/validation";
import AdditionalInfo from "./AdditionalInfo";
import BottomBar from "./BottomBar";
import PlayerList from "./PlayerList";

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}

const InfoRow = ({ icon, label, value, valueColor, isLast }: InfoRowProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.infoRow,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: theme.textInputBackgroundColor,
        },
      ]}
    >
      <View style={styles.infoRowLeft}>
        <Icon svg image={icon} size={sc(15)} color={theme.textSecondary} />
        <Text size={2} color={theme.textSecondary} style={styles.infoRowLabel}>
          {label}
        </Text>
      </View>
      <Text semibold size={2} color={valueColor ?? theme.textPrimary}>
        {value}
      </Text>
    </View>
  );
};

const ServerInfo = () => {
  const { theme } = useTheme();
  const { selected } = useServers();
  const [showLiveDetails, setShowLiveDetails] = useState(false);

  // The UDP query protocol only tells us whether the server responded (online)
  // or timed out (offline) — there's no distinct "maintenance" signal to detect,
  // so that status is left defined in the theme for future use but not surfaced here.
  const isOnline = !!selected && selected.ping !== PING_TIMEOUT_VALUE;
  const statusColor = isOnline ? theme.statusOnline : theme.statusOffline;
  const statusLabel = isOnline ? t("status_online") : t("status_offline");

  const webUrl = useMemo(() => {
    if (selected && validateWebUrl(selected.rules.weburl)) {
      return selected.rules.weburl;
    }
    return "";
  }, [selected]);

  if (!selected) {
    return (
      <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
        <Text color={theme.textSecondary}>{t("server_info_title")}...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      <View style={styles.headerRow}>
        <Text semibold size={2} color={theme.textPrimary} style={styles.headerTitle}>
          {t("server_info_title")}
        </Text>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text semibold size={1} color={statusColor}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.rowsList}>
        <InfoRow
          icon={images.icons.users}
          label={t("server_info_players_online")}
          value={`${selected.playerCount} / ${selected.maxPlayers}`}
        />
        <InfoRow
          icon={images.icons.signal}
          label={t("server_info_ping")}
          value={isOnline ? `${selected.ping}ms` : "-"}
        />
        <InfoRow
          icon={images.icons.versionTag}
          label={t("server_info_version")}
          value={selected.version}
        />
        <InfoRow
          icon={images.icons.mic}
          label={t("server_info_voice_status")}
          value={t("server_info_voice_status_unavailable")}
          valueColor={theme.textSecondary}
          isLast
        />
      </View>

      <TouchableOpacity
        style={styles.liveDetailsToggle}
        onPress={() => setShowLiveDetails((prev) => !prev)}
      >
        <Text semibold size={1} color={theme.primary}>
          {t("server_info_live_details_toggle")} {showLiveDetails ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showLiveDetails && (
        <View style={styles.liveDetails}>
          <BottomBar />
          {webUrl.length > 0 && (
            <Text
              size={1}
              color={theme.primary}
              style={styles.webUrl}
              onPress={() =>
                shell.open(webUrl.includes("http") ? webUrl : "https://" + webUrl)
              }
            >
              {webUrl}
            </Text>
          )}
          <View style={styles.liveDetailsRow}>
            <View style={styles.liveDetailsColumn}>
              <PlayerList players={selected.players} />
            </View>
            <View style={styles.liveDetailsColumn}>
              <AdditionalInfo server={selected} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    borderRadius: sc(10),
    padding: sc(15),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sc(12),
  },
  headerTitle: {
    textTransform: "uppercase",
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
  rowsList: {
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: sc(10),
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoRowLabel: {
    marginLeft: sc(8),
  },
  liveDetailsToggle: {
    marginTop: sc(12),
  },
  liveDetails: {
    marginTop: sc(10),
  },
  webUrl: {
    marginTop: sc(8),
  },
  liveDetailsRow: {
    flexDirection: "row",
    height: sc(260),
    marginTop: sc(10),
  },
  liveDetailsColumn: {
    flex: 1,
    marginRight: sc(10),
  },
});

export default ServerInfo;
