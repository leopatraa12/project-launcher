export interface ThemeColors {
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textPlaceholder: string;
  itemBackgroundColor: string;
  textInputBackgroundColor: string;
  serverListItemBackgroundColor: string;
  statusOnline: string;
  statusOffline: string;
  statusMaintenance: string;
}

// Kuyland Remastered brand palette: Emerald Green (primary), Matte Black (secondary), White (accent).
export const darkThemeColors: ThemeColors = {
  primary: "#22C55E",
  secondary: "#0A0B0D",
  textPrimary: "#FAFAFA",
  textSecondary: "#FFFFFF66",
  textPlaceholder: "#909090",
  itemBackgroundColor: "#16181C",
  textInputBackgroundColor: "#111316",
  serverListItemBackgroundColor: "#22252A",
  statusOnline: "#22C55E",
  statusOffline: "#EF4444",
  statusMaintenance: "#F59E0B",
};

export const lightThemeColors: ThemeColors = {
  primary: "#16A34A",
  secondary: "#FFFFFF",
  textPrimary: "#0A0B0D",
  textSecondary: "#0A0B0D80",
  textPlaceholder: "#6D7071",
  itemBackgroundColor: "#F3F6FC",
  textInputBackgroundColor: "#F3F6FC",
  serverListItemBackgroundColor: "#E9ECF2",
  statusOnline: "#16A34A",
  statusOffline: "#DC2626",
  statusMaintenance: "#D97706",
};
