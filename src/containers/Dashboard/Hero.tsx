import { t } from "i18next";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../components/Text";
import { HERO_BACKGROUND_GRADIENT } from "../../constants/brand";
import { SERVER_DESCRIPTION, SERVER_NAME } from "../../constants/server";
import { useJoinServerPrompt } from "../../states/joinServerPrompt";
import { useServers } from "../../states/servers";
import { useSettings } from "../../states/settings";
import { useTheme } from "../../states/theme";
import { startGame } from "../../utils/game";
import { sc } from "../../utils/sizeScaler";

const Hero = () => {
  const { theme } = useTheme();
  const { selected } = useServers();
  const { nickName, gtasaPath } = useSettings();
  const { showPrompt, setServer } = useJoinServerPrompt();

  const openJoinPrompt = useCallback(() => {
    if (!selected) return;
    setServer(selected);
    showPrompt(true);
  }, [selected, setServer, showPrompt]);

  const handlePlay = useCallback(() => {
    if (!selected) return;

    if (selected.hasPassword) {
      openJoinPrompt();
      return;
    }

    startGame(selected, nickName, gtasaPath, "");
  }, [selected, nickName, gtasaPath, openJoinPrompt]);

  return (
    <View style={[styles.container, { backgroundColor: theme.itemBackgroundColor }]}>
      {/* @ts-ignore */}
      <View style={[styles.background, { backgroundImage: HERO_BACKGROUND_GRADIENT }]} />
      <View style={styles.content}>
        <Text semibold size={4} color={theme.textPrimary} style={styles.title}>
          {SERVER_NAME}
        </Text>
        <Text
          color={theme.textSecondary}
          numberOfLines={2}
          style={styles.description}
        >
          {SERVER_DESCRIPTION}
        </Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.primary }]}
            onPress={handlePlay}
          >
            <Text semibold size={2} color="#FFFFFF">
              {t("hero_play_button")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.connectButton, { borderColor: theme.primary }]}
            onPress={openJoinPrompt}
          >
            <Text semibold size={2} color={theme.textPrimary}>
              {t("hero_connect_button")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: sc(220),
    borderRadius: sc(10),
    overflow: "hidden",
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
    justifyContent: "flex-end",
    padding: sc(20),
  },
  title: {
    marginBottom: sc(6),
  },
  description: {
    marginBottom: sc(16),
    maxWidth: sc(420),
  },
  buttonsRow: {
    flexDirection: "row",
  },
  playButton: {
    height: sc(40),
    paddingHorizontal: sc(28),
    borderRadius: sc(6),
    justifyContent: "center",
    alignItems: "center",
    marginRight: sc(12),
  },
  connectButton: {
    height: sc(40),
    paddingHorizontal: sc(28),
    borderRadius: sc(6),
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Hero;
