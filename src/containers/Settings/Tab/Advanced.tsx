import { t } from "i18next";
import { StyleSheet, TextInput, View } from "react-native";
import Text from "../../../components/Text";
import { IN_GAME } from "../../../constants/app";
import { useSettings } from "../../../states/settings";
import { useTheme } from "../../../states/theme";
import { sc } from "../../../utils/sizeScaler";

const Advanced = () => {
  const { theme } = useTheme();
  const { customGameExe, setCustomGameExe } = useSettings();
  return (
    <View
      style={{
        paddingHorizontal: 12,
        overflow: "hidden",
        paddingVertical: 10,
        flex: 1,
      }}
    >
      {!IN_GAME && (
        <View>
          <Text semibold color={theme.textPrimary} size={2}>
            {t("settings_custom_game_exe_label")}:
          </Text>
          <View style={styles.pathInputContainer}>
            <TextInput
              value={customGameExe}
              onChangeText={(text) => setCustomGameExe(text)}
              style={[
                styles.pathInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.textInputBackgroundColor,
                },
              ]}
            />
          </View>
        </View>
      )}
      <View style={{ flex: 1 }} />
    </View>
  );
};
const styles = StyleSheet.create({
  pathInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 7,
  },
  pathInput: {
    paddingHorizontal: sc(10),
    flex: 1,
    height: sc(38),
    borderRadius: sc(5),
    // @ts-ignore
    outlineStyle: "none",
    fontFamily: "Proxima Nova Regular",
    fontSize: sc(17),
  },
  browseButton: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  resetButton: {
    marginTop: 5,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  appInfoContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
});

export default Advanced;
