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
  primary: "#1FAE6F",
  secondary: "#101012",
  textPrimary: "#FAFAFA",
  textSecondary: "#FFFFFF40",
  textPlaceholder: "#909090",
  itemBackgroundColor: "#1B1B1F",
  textInputBackgroundColor: "#16161A",
  serverListItemBackgroundColor: "#26262B",
  statusOnline: "#2ECC71",
  statusOffline: "#E74C3C",
  statusMaintenance: "#F39C12",
};

export const lightThemeColors: ThemeColors = {
  primary: "#1FAE6F",
  secondary: "#FFFFFF",
  textPrimary: "#101012",
  textSecondary: "#10101280",
  textPlaceholder: "#6D7071",
  itemBackgroundColor: "#F3F6FC",
  textInputBackgroundColor: "#F3F6FC",
  serverListItemBackgroundColor: "#E9ECF2",
  statusOnline: "#2ECC71",
  statusOffline: "#E74C3C",
  statusMaintenance: "#F39C12",
};
