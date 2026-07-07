import { t } from "i18next";
import { memo, useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { images } from "../../constants/images";
import { useAssetUpdate } from "../../states/assetUpdate";
import { useTheme } from "../../states/theme";
import { formatBytes } from "../../utils/helpers";
import { sc } from "../../utils/sizeScaler";

const TIP_KEYS = [
  "asset_update_tip_1",
  "asset_update_tip_2",
  "asset_update_tip_3",
];

const formatRemaining = (etaSeconds: number): string => {
  if (!isFinite(etaSeconds) || etaSeconds <= 0) return "--:--";
  const minutes = Math.floor(etaSeconds / 60);
  const seconds = Math.floor(etaSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const AssetUpdateOverlay = memo(() => {
  const { theme } = useTheme();
  const {
    visible,
    stage,
    currentPackageName,
    packageIndex,
    packageCount,
    progress,
    loadingPercent,
  } = useAssetUpdate();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (stage !== "loading_screen") return;
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIP_KEYS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stage]);

  const isDownloadStage =
    stage === "checking_manifest" ||
    stage === "downloading" ||
    stage === "verifying" ||
    stage === "extracting";

  const downloadStageLabel = useMemo(() => {
    switch (stage) {
      case "checking_manifest":
        return t("asset_update_checking_manifest");
      case "verifying":
        return t("asset_update_verifying");
      case "extracting":
        return t("asset_update_extracting");
      default:
        return currentPackageName || t("asset_update_downloading_title");
    }
  }, [stage, currentPackageName]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.secondary }]}>
      {stage === "loading_screen" ? (
        <>
          <Image
            source={{ uri: images.loadingBackground }}
            style={styles.background}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text semibold size={4} color={theme.textPrimary}>
              {t("asset_update_loading_title")}
            </Text>
            <View style={styles.spacer} />
            <View
              style={[
                styles.progressBarContainer,
                { backgroundColor: theme.serverListItemBackgroundColor },
              ]}
            >
              <View
                // @ts-ignore
                style={[
                  styles.progressBarFill,
                  {
                    width: `${loadingPercent}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <Text color={theme.textSecondary} style={styles.tipText}>
              {t(TIP_KEYS[tipIndex])}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.content}>
          <Icon
            svg
            image={images.logoDark}
            size={sc(80)}
            color={theme.primary}
          />
          <View style={styles.spacer} />
          {isDownloadStage && (
            <>
              <Text
                semibold
                color={theme.textPrimary}
                style={styles.downloadingText}
              >
                {downloadStageLabel}
              </Text>
              {packageCount > 0 && (
                <Text color={theme.textSecondary} style={styles.packageIndexText}>
                  {packageIndex}/{packageCount}
                </Text>
              )}
              <View
                style={[
                  styles.progressBarContainer,
                  { backgroundColor: theme.serverListItemBackgroundColor },
                ]}
              >
                <View
                  // @ts-ignore
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress.percent}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.statsRow}>
                <Text color={theme.textSecondary} style={styles.statsText}>
                  {formatBytes(progress.size)}/{formatBytes(progress.total)}
                </Text>
                <Text color={theme.textSecondary} style={styles.statsText}>
                  {formatBytes(progress.bytesPerSecond)}/s
                </Text>
                <Text color={theme.textSecondary} style={styles.statsText}>
                  {t("asset_update_remaining_time", {
                    time: formatRemaining(progress.etaSeconds),
                  })}
                </Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
});

AssetUpdateOverlay.displayName = "AssetUpdateOverlay";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 62,
    overflow: "hidden",
    borderRadius: sc(10),
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: sc(40),
  },
  spacer: {
    height: sc(20),
  },
  downloadingText: {
    marginBottom: sc(6),
    textAlign: "center",
  },
  packageIndexText: {
    marginBottom: sc(10),
    fontSize: sc(12),
  },
  progressBarContainer: {
    width: sc(320),
    height: sc(16),
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: sc(320),
    marginTop: sc(8),
  },
  statsText: {
    fontSize: sc(12),
  },
  tipText: {
    marginTop: sc(16),
    fontSize: sc(13),
  },
});

export default AssetUpdateOverlay;
