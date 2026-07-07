// Placeholder visual branding used until real brand assets (logo, hero banner,
// cinematic background) are provided.
//
// Hero background image:
// - Place the file at: public/images/hero-banner.jpg
// - Referenced from: src/constants/images.ts -> images.heroBanner
// - Recommended size: 1920x800px (landscape, ~2.4:1), JPG or WEBP, under ~500KB.
//   The Hero container renders at 100% width x 420px tall, so this covers
//   standard desktop widths at 2x pixel density without upscaling.
// - The image is drawn with resizeMode "cover" behind a dark gradient scrim
//   (HERO_OVERLAY_GRADIENT below) so title/description/buttons stay readable
//   regardless of what the photo looks like. Until the file exists the
//   <Image> simply fails to load and the scrim alone is shown.
//
// Once a real avatar/logo image exists, also replace UserProfile.tsx's
// initial-letter avatar circle with it.
export const HERO_OVERLAY_GRADIENT =
  "linear-gradient(0deg, #0A0B0DE6 0%, #0A0B0D99 40%, #0A0B0D4D 70%, #0A0B0D33 100%), " +
  "radial-gradient(120% 140% at 15% 20%, #14532D4D 0%, transparent 55%)";

export const AVATAR_PLACEHOLDER_COLOR = "#22C55E";
