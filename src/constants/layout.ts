/**
 * Layout constants for responsive design
 * Aligned with Material Design 3 breakpoints and grid system
 *
 * Window size classes per MD3:
 * - Compact: Under 600dp (phones in portrait)
 * - Medium: 600–839dp (tablets in portrait, foldables unfolded in portrait)
 * - Expanded: 840–1199dp (phones in landscape, tablets in landscape, desktop)
 * - Large: 1200–1599dp (desktop)
 * - Extra-large: 1600+dp (desktop, ultra-wide monitors)
 *
 * Reference: https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */

export const LAYOUT = {
  // Maximum content width for centered layouts (Twitter-style)
  // Custom value for optimal content reading width
  MAX_CONTENT_WIDTH: 1200,

  // Maximum width for grid layouts (categories with 2 columns)
  // Custom value for grid-based layouts
  MAX_GRID_WIDTH: 1400,

  // Optimal reading width for articles (600-800px range)
  // Custom value for optimal article reading experience
  ARTICLE_MAX_WIDTH: 800,

  // Drawer width on large screens
  // MD3: Navigation drawer standard width is 320dp
  // Reference: https://m3.material.io/components/navigation-drawer
  DRAWER_WIDTH: 320,

  // Right sidebar width on large screens
  // Custom value for application-specific sidebar
  SIDEBAR_WIDTH: 480,

  CARD_WIDTH: 480
} as const;

/**
 * Material Design 3 Component Heights
 * Standard heights for MD3 components that don't align with the 8dp grid
 *
 * Reference: https://m3.material.io/components
 */
export const COMPONENT_HEIGHTS = {
  // Standard FAB, Search Bar, and Tab Bar height
  // MD3: Standard height for FAB, Search Bar, and Tab Bar is 56dp
  // Reference:
  // - https://m3.material.io/components/floating-action-button/specs
  // - https://m3.material.io/components/search/specs
  // - https://m3.material.io/components/navigation-bar/specs
  STANDARD: 56 // 56dp
} as const;
