// Phase 3: replace these static exports with real backend-sourced content
// (see docs/prd.md §8.6, §8.7, and the "User Profile" section). For this pass
// they only exist to fill out the dashboard with representative placeholder UI.

export type CommunityUpdateType =
  | "announcement"
  | "event"
  | "discord"
  | "maintenance";

export interface CommunityUpdateItem {
  id: string;
  type: CommunityUpdateType;
  title: string;
  description: string;
  badge: string;
}

export const COMMUNITY_UPDATES: CommunityUpdateItem[] = [
  {
    id: "announcement-1",
    type: "announcement",
    title: "Welcome to Kuyland Remastered",
    description: "The new launcher is here with a fresh look and faster updates.",
    badge: "New",
  },
  {
    id: "discord-1",
    type: "discord",
    title: "Discord Community",
    description: "Join our Discord server and connect with thousands of players.",
    badge: "Online",
  },
  {
    id: "event-1",
    type: "event",
    title: "Upcoming Events",
    description: "Double XP Event this weekend. Join now and get ready.",
    badge: "Soon",
  },
];

export type FeaturedStoreType = "vip" | "vehicle" | "bundle" | "coin";

export interface FeaturedStoreItem {
  id: string;
  type: FeaturedStoreType;
  title: string;
  description: string;
  icon: "crown" | "car" | "users" | "coin";
}

export const FEATURED_STORE_ITEMS: FeaturedStoreItem[] = [
  {
    id: "vip-1",
    type: "vip",
    title: "VIP Membership",
    description: "Unlock exclusive perks and privileges.",
    icon: "crown",
  },
  {
    id: "vehicle-1",
    type: "vehicle",
    title: "Vehicle Pack",
    description: "Ride in style with limited-edition vehicles.",
    icon: "car",
  },
  {
    id: "bundle-1",
    type: "bundle",
    title: "Character Bundle",
    description: "Everything you need to get started.",
    icon: "users",
  },
  {
    id: "coin-1",
    type: "coin",
    title: "Premium Coins",
    description: "Spend on customization and upgrades.",
    icon: "coin",
  },
];

// No player-progression backend exists yet — these are neutral placeholder
// values (not a real player's data) so the profile card layout can be shown
// now; wire this up to real data in Phase 3.
export interface DummyPlayerProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  isVip: boolean;
}

export const DUMMY_PLAYER_PROGRESS: DummyPlayerProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  isVip: false,
};
