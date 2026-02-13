import { Platform, TextStyle } from 'react-native';
import { type MD3Theme } from 'react-native-paper';

/**
 * Generates the style map passed to `RenderHtml` based on the current theme.
 * This is a pure function that takes a theme parameter and returns styles.
 *
 * @param theme The theme object from `react-native-paper`.
 * @returns An object where keys are HTML tag names and values are style objects.
 */
export function getArticleTagStyles(
  theme: MD3Theme,
  baseFontSize: number = 16,
  lineHeight: number = 1.6,
  paragraphSpacing: number = 16,
  fontFamily: string = 'system'
): Record<string, TextStyle> {
  const ratio = baseFontSize / 16; // Calculate ratio from base size

  // Map font family values to actual font families
  const fontFamilyMap: Record<string, string | undefined> = {
    system: undefined, // Use system default
    serif: 'Georgia, serif',
    'sans-serif': 'Arial, sans-serif',
    monospace: 'Courier New, monospace',
    Roboto: 'Roboto_400Regular',
    OpenSans: 'OpenSans_400Regular',
    Inter: 'Inter_400Regular',
    Lora: 'Lora_400Regular',
    Merriweather: 'Merriweather_400Regular',
    PlayfairDisplay: 'PlayfairDisplay_400Regular'
  };

  const fontFamilyValue = fontFamilyMap[fontFamily] || undefined;

  return {
    body: {
      color: theme.colors.onSurface,
      lineHeight: baseFontSize * lineHeight,
      fontSize: baseFontSize,
      fontFamily: fontFamilyValue,
      marginBottom: paragraphSpacing
    },
    h1: {
      fontWeight: '700' as TextStyle['fontWeight'],
      marginTop: 18,
      marginBottom: 12 + paragraphSpacing,
      color: theme.colors.onSurface,
      fontSize: 22 * ratio,
      lineHeight: 22 * ratio * lineHeight,
      fontFamily: fontFamilyValue
    },
    h2: {
      fontWeight: '700' as TextStyle['fontWeight'],
      marginTop: 16,
      marginBottom: 10 + paragraphSpacing,
      color: theme.colors.onSurface,
      fontSize: 18 * ratio,
      lineHeight: 18 * ratio * lineHeight,
      fontFamily: fontFamilyValue
    },
    h3: {
      fontWeight: '600' as TextStyle['fontWeight'],
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.onSurface
    },
    h4: {
      fontWeight: '600' as TextStyle['fontWeight'],
      marginTop: 14,
      marginBottom: 6,
      color: theme.colors.onSurface
    },
    h5: {
      fontWeight: '600' as TextStyle['fontWeight'],
      marginTop: 12,
      marginBottom: 4,
      color: theme.colors.onSurface
    },
    h6: {
      fontWeight: '600' as TextStyle['fontWeight'],
      marginTop: 10,
      marginBottom: 4,
      color: theme.colors.onSurface
    },
    p: {
      marginTop: 12,
      marginBottom: paragraphSpacing,
      color: theme.colors.onSurface,
      fontSize: baseFontSize,
      lineHeight: baseFontSize * lineHeight,
      fontFamily: fontFamilyValue
    },
    a: {
      color: theme.colors.primary,
      textDecorationLine: 'none'
    },
    ul: {
      marginVertical: 12,
      marginLeft: 16
    },
    ol: {
      marginVertical: 12,
      marginLeft: 16
    },
    li: {
      marginVertical: 4,
      color: theme.colors.onSurface,
      lineHeight: baseFontSize * lineHeight,
      fontSize: baseFontSize,
      fontFamily: fontFamilyValue
    },
    table: {
      backgroundColor: theme.colors.surface,
      marginVertical: 12,
      width: '100%',
      maxWidth: '100%',
      borderRadius: theme.roundness,
      overflow: 'hidden',
      alignSelf: 'center'
    },
    thead: {
      backgroundColor: 'transparent'
    },
    tbody: {
      backgroundColor: 'transparent'
    },
    th: {
      backgroundColor:
        (theme.colors as any).elevation?.level5 ||
        (theme.colors as any).surfaceContainerHighest ||
        (theme.colors as any).surfaceContainer ||
        theme.colors.surfaceVariant,
      color: theme.colors.onSurface,
      fontWeight: '600' as TextStyle['fontWeight'],
      paddingVertical: 8,
      paddingHorizontal: 12,
      textAlign: 'left' as TextStyle['textAlign'],
      fontSize: baseFontSize * 0.95,
      overflow: 'hidden',
      maxWidth: '100%',
      minWidth: 0,
      borderWidth: 0.5,
      borderColor: theme.colors.outlineVariant,
      borderStyle: 'solid' as any
    },
    td: {
      backgroundColor: 'transparent',
      paddingVertical: 8,
      paddingHorizontal: 12,
      color: theme.colors.onSurface,
      fontSize: baseFontSize * 0.95,
      overflow: 'hidden',
      maxWidth: '100%',
      minWidth: 0,
      borderWidth: 0.5,
      borderColor: theme.colors.outlineVariant,
      borderStyle: 'solid' as any,
      textAlign: 'left' as TextStyle['textAlign']
    },
    tr: {
      backgroundColor: 'transparent'
    },
    caption: {
      fontSize: baseFontSize * 0.85,
      color: theme.colors.onSurfaceVariant,
      fontStyle: 'italic',
      paddingVertical: 8,
      textAlign: 'center' as TextStyle['textAlign']
    },
    // Improved code styling
    code: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: theme.roundness * 2,
      fontFamily: 'monospace'
    },
    pre: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 16,
      borderRadius: theme.roundness,
      fontFamily: 'monospace',
      overflow: 'scroll',
      marginVertical: 12
    },
    // Blockquote styling
    blockquote: {
      backgroundColor: theme.colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginVertical: 12,
      marginLeft: 16,
      fontStyle: 'italic',
      color: theme.colors.onSurfaceVariant
    },
    // Image styling
    img: {
      maxWidth: '100%',
      height: 'auto'
    }
  };
}

/**
 * Generates class-based styles for Wikipedia-specific elements
 *
 * @param theme The theme object from `react-native-paper`.
 * @returns An object where keys are CSS class names and values are style objects.
 */
export function getArticleClassStyles(
  theme: MD3Theme,
  baseFontSize: number = 16
): Record<string, TextStyle> {
  const ratio = baseFontSize / 16;

  return {
    // Image containers
    thumbinner: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8
    },
    multiimageinner: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8
    },
    // Combined class for thumbnail groups (table-like structure)
    'thumbinner multiimageinner': {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 12,
      flexDirection: 'column' as any
    },
    // Table row equivalent in thumbnail groups
    trow: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row' as any,
      flexWrap: 'wrap' as any,
      marginVertical: 4
    },
    // Single thumbnail item in a group
    tsingle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
      marginVertical: 8,
      maxWidth: '100%'
    },
    // Image container within thumbnail
    thumbimage: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    // Caption for thumbnails
    thumbcaption: {
      fontSize: baseFontSize * 0.85,
      color: theme.colors.onSurfaceVariant,
      fontStyle: 'italic',
      textAlign: 'center' as TextStyle['textAlign'],
      marginTop: 8,
      paddingHorizontal: 8,
      width: '100%'
    },
    // Wikipedia-specific classes for better theme adaptation
    reference: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12 * ratio,
      fontStyle: 'italic'
    },
    external: {
      color: theme.colors.primary
    },
    // MediaWiki wikitable class - matches Wikipedia table styling
    // This class is applied to <table class="wikitable"> elements
    wikitable: {
      backgroundColor: 'transparent',
      width: '100%',
      borderRadius: (theme as any).roundness,
      overflow: 'hidden',
      alignSelf: 'center'
    },
    // Sortable tables (jQuery tablesorter)
    sortable: {
      backgroundColor: 'transparent'
    },
    'jquery-tablesorter': {
      backgroundColor: 'transparent'
    },
    // Plain row headers - normal font weight, left-aligned
    // Applied to tables with class="wikitable plainrowheaders"
    plainrowheaders: {
      backgroundColor: 'transparent'
    },
    // Collapsible tables
    'mw-collapsible': {
      backgroundColor: 'transparent'
    },
    'mw-collapsed': {
      backgroundColor: 'transparent'
    },
    // Table with no borders
    'wikitable noborder': {
      borderWidth: 0
    },
    // Table with alternating row colors (zebra striping)
    // so zebra striping would need a custom renderer
    'wikitable zebra': {
      backgroundColor: 'transparent'
    },
    // Navigation boxes
    navbox: {
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.outlineVariant,
      borderRadius: theme.roundness,
      padding: 12,
      marginVertical: 16
    },
    // Citation styles
    citation: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12 * ratio
    },
    // Mobile-optimized table cells
    'mobile-table-cell': {
      minWidth: 80,
      paddingVertical: 8,
      paddingHorizontal: 8
    },
    // Infobox tables - should take full container width
    infobox: {
      maxWidth: '100%',
      marginLeft: -8, // Break out of section padding
      marginRight: -8, // Break out of section padding
      ...Platform.select({
        web: {
          width: 'calc(100% + 16px)' as any
        },
        default: {
          width: '100%'
        }
      })
    }
  };
}
