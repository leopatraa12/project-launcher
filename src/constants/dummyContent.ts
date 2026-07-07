// Phase 3: replace these static arrays with real backend-sourced content
// (see docs/prd.md §8.6, §8.7). For this pass they only exist to fill out the
// dashboard's Community Update / Featured Store sections with representative UI.

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
}

export const COMMUNITY_UPDATES: CommunityUpdateItem[] = [
  {
    id: "announcement-1",
    type: "announcement",
    title: "Welcome to Kuyland Remastered",
    description: "The new launcher is here with a fresh look and faster updates.",
  },
  {
    id: "event-1",
    type: "event",
    title: "Weekend Double XP",
    description: "Earn double XP on all game modes this weekend.",
  },
  {
    id: "discord-1",
    type: "discord",
    title: "Join our Discord community",
    description: "Chat with other players, get support, and stay up to date.",
  },
  {
    id: "maintenance-1",
    type: "maintenance",
    title: "Scheduled Maintenance",
    description: "The server will be briefly offline for maintenance on Sunday.",
  },
];

export type FeaturedStoreType = "vip" | "vehicle" | "bundle" | "coin";

export interface FeaturedStoreItem {
  id: string;
  type: FeaturedStoreType;
  title: string;
  description: string;
}

export const FEATURED_STORE_ITEMS: FeaturedStoreItem[] = [
  {
    id: "vip-1",
    type: "vip",
    title: "VIP Membership",
    description: "Unlock exclusive perks and privileges.",
  },
  {
    id: "vehicle-1",
    type: "vehicle",
    title: "Exclusive Vehicle Pack",
    description: "Ride in style with limited-edition vehicles.",
  },
  {
    id: "bundle-1",
    type: "bundle",
    title: "Starter Bundle",
    description: "Everything you need to get started.",
  },
  {
    id: "coin-1",
    type: "coin",
    title: "Premium Coins",
    description: "Spend on customization and upgrades.",
  },
];
