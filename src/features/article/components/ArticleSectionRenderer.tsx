import React from 'react';
import RenderHtml from 'react-native-render-html';

import type { SectionState } from '@/hooks/articles/useArticleSections';

interface ArticleSectionRendererProps {
  section: SectionState;
  isExpanded: boolean;
  onPress: () => void;
  renderers: any;
  renderersProps: any;
  customHTMLElementModels: any;
  domVisitors: any;
  tagsStyles: any;
  classesStyles: any;
  contentWidth: number;
  systemFonts: string[];
  ignoredDomTags: string[];
  defaultTextProps: any;
}

interface RenderHtmlWrapperProps {
  html: string;
  renderers: any;
  renderersProps: any;
  customHTMLElementModels: any;
  domVisitors: any;
  tagsStyles: any;
  classesStyles: any;
  contentWidth: number;
  systemFonts: string[];
  ignoredDomTags: string[];
  defaultTextProps: any;
}

const RenderHtmlWrapper = React.memo(
  ({
    html,
    renderers,
    renderersProps,
    customHTMLElementModels,
    domVisitors,
    tagsStyles,
    classesStyles,
    contentWidth,
    systemFonts,
    ignoredDomTags,
    defaultTextProps
  }: RenderHtmlWrapperProps) => {
    return (
      <RenderHtml
        source={{ html }}
        contentWidth={contentWidth}
        defaultTextProps={defaultTextProps}
        systemFonts={systemFonts}
        ignoredDomTags={ignoredDomTags}
        customHTMLElementModels={customHTMLElementModels}
        domVisitors={domVisitors}
        tagsStyles={tagsStyles as any}
        classesStyles={classesStyles as any}
        renderers={renderers}
        renderersProps={renderersProps}
      />
    );
  },
  (prevProps, nextProps) => prevProps.html === nextProps.html
);
RenderHtmlWrapper.displayName = 'RenderHtmlWrapper';
