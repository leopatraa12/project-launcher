import { t } from "i18next";
import { useCallback, useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { images } from "../../constants/images";
import { HERO_OVERLAY_GRADIENT } from "../../constants/brand";
import { SERVER_DESCRIPTION, SERVER_NAME } from "../../constants/server";
import { useJoinServerPrompt } from "../../states/joinServerPrompt";
import { useServers } from "../../states/servers";
import { useSettings } from "../../states/settings";
import { useTheme } from "../../states/theme";
import { startGame } from "../../utils/game";
import { sc } from "../../utils/sizeScaler";

// Brand banner image isn't ready yet — split SERVER_NAME so the last word
// renders in the primary color as a placeholder wordmark (swap for a real
// hero banner/logo image once one exists, see constants/brand.ts).
const splitTitle = (name: string) => {
  const words = name.trim().split(" ");
  const accent = words.pop() ?? "";
  return { lead: words.join(" "), accent };
};

const Hero = () => {
  const { theme } = useTheme();
  const { selected } = useServers();
  const { nickName, gtasaPath } = useSettings();
  const { showPrompt, setServer } = useJoinServerPrompt();

  const title = useMemo(() => splitTitle(SERVER_NAME), []);

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
      <Image
        source={{ uri: images.heroBanner }}
        style={styles.background}
        resizeMode="cover"
      />
      {/* @ts-ignore */}
      <View style={[styles.background, { backgroundImage: HERO_OVERLAY_GRADIENT }]} />
      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text semibold size={4} color={theme.textPrimary} style={styles.titleLine}>
            {title.lead}
          </Text>
          <Text semibold size={4} color={theme.primary} style={styles.titleLine}>
            {title.accent}
          </Text>
        </View>
        <Text
          color={theme.textSecondary}
          numberOfLines={2}
          style={styles.description}
        >
          {SERVER_DESCRIPTION}
        </Text>
        <View style={styles.buttonsColumn}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.primary }]}
            onPress={handlePlay}
          >
            <Icon svg image={images.icons.play} size={sc(14)} color="#FFFFFF" />
            <Text semibold size={2} color="#FFFFFF" style={styles.buttonLabel}>
              {t("hero_play_button")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.connectButton, { borderColor: theme.primary }]}
            onPress={openJoinPrompt}
          >
            <Icon svg image={images.icons.link} size={sc(14)} color={theme.primary} />
            <Text semibold size={2} color={theme.textPrimary} style={styles.buttonLabel}>
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
    height: sc(420),
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
    padding: sc(24),
  },
  titleBlock: {
    marginBottom: sc(10),
  },
  titleLine: {
    fontSize: sc(38),
    lineHeight: sc(42),
  },
  description: {
    marginBottom: sc(20),
    maxWidth: sc(360),
  },
  buttonsColumn: {
    width: sc(280),
  },
  playButton: {
    height: sc(46),
    borderRadius: sc(8),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: sc(10),
  },
  connectButton: {
    height: sc(46),
    borderRadius: sc(8),
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    marginLeft: sc(8),
  },
});

export default Hero;
