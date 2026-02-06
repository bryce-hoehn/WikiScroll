# WikiScape Code Simplification Analysis

**Date:** February 6, 2026  
**Analysis Type:** Architecture Review based on [bulletproof-react](https://github.com/alan2207/bulletproof-react) guidelines  
**Status:** Analysis Complete - **NO CODE CHANGES MADE**

---

## Executive Summary

The WikiScape codebase is a well-structured React Native application with solid foundations. However, there are clear opportunities for simplification following bulletproof-react architectural principles.

**Complexity Rating:** 7/10 (Moderate - manageable with clear improvement path)

### Main Issues Identified:

1. **Large components** mixing multiple responsibilities (600+ lines)
2. **Missing feature-based organization** - code organized by type instead of feature  
3. **Code duplication** across similar feed components
4. **Complex hooks** that should be split into smaller units
5. **No clear API orchestration layer** for complex data fetching

---

## Critical Files Requiring Attention

| File | Lines | Main Issues | Priority |
|------|-------|-------------|----------|
| **bookmarks.tsx** | 910 | Screen doing too much: search, filter, sort, selection, bulk ops | **P0** |
| **articleParsing.ts** | 867 | Monolithic utility with multiple parsing strategies | **P0** |
| **SearchOverlay.tsx** | 608 | UI mixed with keyboard, animation, navigation logic | **P0** |
| **Article.tsx** | 543 | Mixes scroll, preferences, progress tracking, section management | **P0** |
| **useArticleSections.ts** | 511 | Hook doing 6 different things (parsing, state, positions, nav) | **P0** |
| **settings.tsx** | 649 | Too many responsibilities | P1 |
| **ImageDialog.tsx** | 630 | Complex gestures, zoom, pan in one component | P1 |

---

## Current vs. Recommended Structure

### Current Structure (Type-Based)
```
src/
├── api/              # ✅ Well organized by feature
├── components/       # ⚠️ Large components, mixed concerns
├── hooks/            # ✅ Well organized
├── app/              # ✅ Good (Expo Router)
├── context/          # ⚠️ 6 contexts, some overlap
├── utils/            # ✅ Good
├── types/            # ✅ Good
└── constants/        # ✅ Good (design tokens)
```

### Bulletproof React Structure (Feature-Based)
```
src/
├── app/              # Routes and providers
├── components/       # ONLY shared components
├── features/         # ⚠️ MISSING - Feature modules
│   ├── articles/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── bookmarks/
│   ├── search/
│   └── feed/
├── hooks/            # ONLY shared hooks
└── stores/           # Global state
```

---

## Key Recommendations

### Priority 0: Critical (5-7 days effort)

#### 1. Create Feature-Based Structure (2-3 days)
Move from type-based to feature-based organization:

```
features/
├── articles/
│   ├── api/          # getArticle, getArticleHtml, trackVisit
│   ├── components/   # ArticleReader, ArticleContent, ArticleToolbar
│   ├── hooks/        # useArticle, useArticlePreferences, useArticleProgress
│   └── types/        # article.ts
├── bookmarks/
│   ├── api/          # downloadBookmark, exportBookmarks
│   ├── components/   # BookmarksList, BookmarksToolbar, BookmarkCard
│   ├── hooks/        # useBookmarks, useBookmarksFilter, useBookmarksSort
│   └── types/        # bookmarks.ts
├── search/
│   ├── api/          # searchArticles, getSearchSuggestions
│   ├── components/   # SearchOverlay, SearchResults, RecentArticles
│   ├── hooks/        # useSearch, useSearchAnimation, useSearchKeyboard
│   └── types/        # search.ts
└── feed/
    ├── api/          # getRecommendations, getTrendingArticles
    ├── components/   # BaseFeed, ForYouFeed, HotFeed
    ├── hooks/        # useFeed, useInfiniteScroll
    └── types/        # feed.ts
```

#### 2. Refactor bookmarks.tsx (1 day)
**Problem:** 910-line screen doing 10+ responsibilities

**Solution:** Create thin screen that composes feature components:
- Extract `BookmarksToolbar` (search, filter, sort controls)
- Extract `BookmarkSelectionMode` (bulk operations UI)
- Create hooks: `useBookmarksFilter`, `useBookmarksSort`, `useBookmarkSelection`
- Target: Reduce screen to < 150 lines

#### 3. Split useArticleSections.ts (1 day)
**Problem:** 511-line hook doing 6 different things

**Solution:** Split into 4 focused hooks:
```tsx
features/articles/hooks/sections/
├── useParseSections.ts       # HTML → sections extraction
├── useSectionAccordion.ts    # Expand/collapse state
├── useSectionPositions.ts    # Layout calculations
└── useSectionNavigation.ts   # Scroll-to-section logic
```

#### 4. Extract SearchOverlay Logic (1 day)
**Problem:** 608 lines mixing UI, animations, keyboard, navigation

**Solution:** Extract to hooks:
- `useSearchOverlayAnimation.ts` - Fade & slide animations
- `useSearchKeyboard.ts` - Keyboard show/hide handling
- `useSearchNavigation.ts` - Article navigation
- Target: Reduce component to < 200 lines

---

### Priority 1: High Impact, Low Effort (1 day)

#### 5. Create useBaseFeed Hook (2-3 hours)
**Problem:** ForYouFeed, HotFeed, RandomFeed have identical logic (~300 lines duplicated)

**Solution:**
```tsx
// features/feed/hooks/useBaseFeed.ts
export function useBaseFeed<T>(
  fetchFn: (page: number) => Promise<T[]>,
  options?: { pageSize?: number }
) {
  // Shared: data, loading, refreshing, page, hasMore
  // Shared: refresh(), loadMore()
  return { data, loading, refreshing, hasMore, refresh, loadMore };
}

// Usage in ForYouFeed.tsx
const { data, loading, refreshing, refresh, loadMore } = useBaseFeed(
  (page) => api.getRecommendations(page),
  { pageSize: 20 }
);
```

#### 6. Create Article Transform Utilities (1 hour)
Extract duplicated article transformation logic from RandomFeed:

```tsx
// features/articles/utils/transformArticle.ts
export function transformArticleResponse(response: ArticleResponse): Article | null
export function transformArticleResponses(responses: ArticleResponse[]): Article[]
```

#### 7. Add useLatestRef Hook (30 minutes)
Remove ref synchronization boilerplate:

```tsx
// hooks/useLatestRef.ts
export function useLatestRef<T>(value: T): React.MutableRefObject<T>

// Replaces 3 lines with 1:
const getRecommendationsRef = useLatestRef(getRecommendations);
```

#### 8. Split articleParsing.ts (2-3 hours)
**Problem:** 867-line monolithic utility file

**Solution:** Split into focused modules:
```
utils/parsing/
├── htmlParser.ts          # Core HTML parsing
├── sectionExtractor.ts    # Section extraction
├── imageExtractor.ts      # Image parsing
├── mediaExtractor.ts      # Tables, audio, video
└── textExtractor.ts       # Plain text extraction
```

---

### Priority 2: Medium Impact (2-3 days)

#### 9. Refactor Article.tsx (1 day)
**Problem:** 543 lines mixing 7 different responsibilities

**Solution:**
- Extract `useArticlePreferences` (font size, line height, spacing)
- Extract `useArticleScrolling` (scroll position, progress tracking)
- Extract `useScrollToSection` (platform-specific scroll logic)
- Create `ArticleContent` sub-component (HTML rendering only)
- Target: Reduce to < 150 lines

#### 10. Consolidate Contexts (1 day)
**Current:** 6 separate contexts

**Options:**
- Option A: Merge `FeedScrollContext` + `ScrollToTopContext` → `NavigationContext`
- Option B: Migrate to Zustand for simpler state management

#### 11. Create API Orchestration Hooks (2-3 hours)
**Problem:** Complex API orchestration in screen components

**Solution:**
```tsx
// features/articles/hooks/useArticleData.ts
export function useArticleData(title: string) {
  // Orchestrates: article, thumbnail, links
  // Auto-tracks visit, prefetches images
  return { article, thumbnail, backlinks, forwardLinks, isLoading };
}
```

---

## Code Duplication Patterns

### 1. Feed Component Duplication
- **Files:** ForYouFeed.tsx, HotFeed.tsx, RandomFeed.tsx
- **Duplication:** ~300 lines of identical state/loading/refresh logic
- **Solution:** `useBaseFeed` hook

### 2. Article Transform Logic
- **File:** RandomFeed.tsx (lines 41-57, 102-118)
- **Duplication:** Article response transformation repeated
- **Solution:** `transformArticleResponse` utility

### 3. Ref Synchronization Pattern
- **Files:** ForYouFeed, Feed.tsx, SearchOverlay
- **Pattern:** Manual ref + useEffect synchronization
- **Solution:** `useLatestRef` hook

---

## Context Complexity

**Current:** 6 contexts with some overlap
```
BookmarksContext, FeaturedContentContext, FeedScrollContext,
ScrollToTopContext, SettingsContext, SnackbarContext
```

**Recommendation:**
- Consolidate FeedScrollContext + ScrollToTopContext
- Consider Zustand for better performance and simpler API

---

## Benefits of Refactoring

### Developer Experience
- ✅ **Easier onboarding** - Feature-based structure is self-documenting
- ✅ **Faster development** - Less time searching for files
- ✅ **Better code reuse** - Shared components/hooks more discoverable
- ✅ **Reduced cognitive load** - Smaller, focused files

### Code Quality
- ✅ **Better testability** - Smaller units easier to test
- ✅ **Reduced bugs** - Simpler code, fewer edge cases
- ✅ **Easier debugging** - Clear separation of concerns
- ✅ **Better type safety** - Smaller scopes for TS inference

### Maintainability
- ✅ **Safer refactoring** - Feature boundaries prevent unintended changes
- ✅ **Easier to add features** - Clear patterns to follow
- ✅ **Better code reviews** - Smaller, focused PRs
- ✅ **Reduced technical debt** - Following best practices

---

## Estimated Effort

### Full Refactoring (P0 + P1 + P2)
- **Time:** 15-20 development days (3-4 weeks)
- **Risk:** Medium
- **Impact:** High

### Critical Issues Only (P0)
- **Time:** 5-7 development days (1-1.5 weeks)
- **Risk:** Low
- **Impact:** High

### Recommended Incremental Approach
- **Week 1:** Feature-based structure + bookmarks.tsx
- **Week 2:** Split useArticleSections + create useBaseFeed
- **Week 3:** Refactor Article.tsx + SearchOverlay.tsx
- **Week 4:** Testing, documentation, polish

---

## Comparison with Bulletproof React

### ✅ What WikiScape Does Well
1. API layer well-organized by domain
2. Good TypeScript usage
3. Design system tokens (constants/)
4. Hooks well-organized, using React Query effectively
5. File-based routing (Expo Router)

### ⚠️ What Needs Improvement
1. Code organized by type, not feature
2. Multiple 500+ line components
3. Some hooks too large/complex
4. Code duplication in feeds
5. 6 separate contexts with overlap

### 🔴 Critical Gaps
1. No feature modules (biggest deviation)
2. Large components mixing concerns
3. No API orchestration layer
4. Missing common abstractions

---

## Quick Wins (Fastest ROI)

1. **useBaseFeed hook** (2-3 hours) → Eliminates 300 lines
2. **Article transform utility** (1 hour) → Removes duplication
3. **useLatestRef hook** (30 min) → Cleaner code
4. **Split articleParsing.ts** (2-3 hours) → Better maintainability

---

## Migration Strategy

### Phase 1: Structure (Non-Breaking)
Create feature folders, move files incrementally

### Phase 2: Extract Hooks (Low Risk)
Create reusable hooks, components use new hooks alongside old code

### Phase 3: Refactor Components (Medium Risk)
Split large components one at a time with tests

### Phase 4: Consolidate (Low Risk)
Move contexts, update state management, clean up

---

## Resources

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Project Structure Guide](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)

---

## Conclusion

The WikiScape codebase has a solid foundation but would significantly benefit from:

1. **Feature-based organization** (biggest win)
2. **Component simplification** (break down 600+ line files)
3. **Hook extraction** (split complex hooks)
4. **Eliminate duplication** (useBaseFeed, transform utilities)
5. **API orchestration** (data fetching hooks)

Following these recommendations will create a more maintainable, scalable, and developer-friendly codebase aligned with industry best practices.

---

**Status:** ✅ Analysis Complete - Ready for Implementation  
**Next Step:** Review with team and prioritize based on current pain points  
**Quick Start:** Begin with P0 items for highest impact
