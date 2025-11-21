# Phase 2: Hybrid Approach - REVISED Implementation Plan

**Status:** Planning Complete - Adjusted Based on Phase 1 Learnings
**Strategy:** Local-first features with proper persistence, testing, and extensibility

**Revision Date:** November 2025
**Changes:** Incorporates all learnings from [PHASE_1_LEARNINGS.md](./PHASE_1_LEARNINGS.md)

---

## 🔄 What Changed from Original Plan

### Key Adjustments:

1. **Added Sprint 0 (Foundation)** - Fix technical debt and set up infrastructure BEFORE new features
2. **Zustand Persistence Required** - Not optional, implement reusable middleware pattern
3. **Test Infrastructure First** - Create test utilities before screen tests
4. **Action-Oriented Design** - Refactor StoryListItem for extensibility
5. **Clean Up Existing Code** - Delete unused hooks, wire up dead preferences
6. **Navigation Rethink** - Header actions instead of more tabs
7. **Coverage Goals Per Sprint** - Hit 80% for NEW code in each sprint

---

## 📋 Revised Sprint Breakdown

### **Sprint 0: Foundation & Technical Debt** (3 days) 🔧

**Goal:** Clean slate with proper infrastructure before adding features

#### Tasks:

**1. Clean Up Unused Code**
- Delete `src/hooks/useStories.ts` (replaced by useInfiniteStories)
- Remove or wire up `storiesPerPage` from preferences
- Audit for any other dead code

**2. Zustand Persistence Middleware**
- Create `src/store/middleware/persistence.ts`
- Implement AsyncStorage integration with versioning
- Add error handling and retry logic
- Write comprehensive tests

```typescript
// Pattern to implement:
import { persist } from './middleware/persistence';

export const useBookmarksStore = create(
  persist<BookmarksState>(
    (set) => ({
      bookmarks: [],
      addBookmark: (story) => set((state) => ({
        bookmarks: [...state.bookmarks, story]
      })),
      // ...
    }),
    {
      name: '@hacknews:bookmarks',
      version: 1,
      migrate: (persistedState, version) => {
        // Handle migrations
      }
    }
  )
);
```

**3. Add Persistence to Existing Stores**
- Update `themeStore.ts` to persist theme preference
- Update `preferencesStore.ts` to persist all preferences
- Test that data survives app restart

**4. Test Infrastructure**
- Create `src/__tests__/utils/testHelpers.tsx`
- Implement `renderWithProviders` for screen testing
- Implement `mockNavigation` for navigation mocking
- Implement `createMockStore` for isolated store testing
- Create fixture data generators

```typescript
// Example:
export function renderWithProviders(
  component: React.ReactElement,
  options?: {
    initialRoute?: string;
    initialStoreState?: Partial<StoreState>;
  }
) {
  const queryClient = new QueryClient({ /* test config */ });
  const mockNavigation = createMockNavigation(options?.initialRoute);

  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {component}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
```

**5. Refactor StoryListItem for Actions**
- Add flexible action slot system
- Maintain backward compatibility
- Update existing tests
- Design for bookmark, share, comments actions

```typescript
// New design:
interface StoryAction {
  icon: string;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  badge?: number | boolean;
}

interface StoryListItemProps {
  story: Story;
  index: number;
  onPress: () => void;
  actions?: StoryAction[];
  dimmed?: boolean; // for read stories
}
```

**6. Baseline Screen Tests**
- Add tests for FeedScreen (basic rendering)
- Add tests for StoryDetailScreen
- Add tests for ArticleScreen
- Target: 50% screen coverage as baseline

**Deliverables:**
- ✅ All unused code deleted
- ✅ Persistence middleware working and tested
- ✅ Existing stores persist data
- ✅ Test utilities ready to use
- ✅ StoryListItem refactored
- ✅ Baseline screen test coverage (50%)
- ✅ All tests passing (70+ tests expected)

**Success Criteria:**
- App preserves theme and preferences on restart
- Test coverage > 50%
- 0 TypeScript errors
- 0 ESLint errors
- Clean architecture ready for new features

---

### **Sprint 1: Core Persistence - Bookmarks & History** (5 days) 📚

**Goal:** Implement bookmark and history tracking with full persistence

#### Features:

**1. Bookmarks System**

**Data Layer:**
```typescript
// src/store/bookmarksStore.ts
interface Bookmark {
  id: string; // UUID
  storyId: number;
  story: Story; // Full story data for offline
  bookmarkedAt: number;
  tags?: string[]; // Future: categorization
}

interface BookmarksState {
  bookmarks: Bookmark[];
  addBookmark: (story: Story) => void;
  removeBookmark: (storyId: number) => void;
  isBookmarked: (storyId: number) => boolean;
  getBookmarkCount: () => number;
  clearAll: () => void;
}
```

**UI Updates:**
- Add bookmark icon to StoryListItem actions
- Add bookmark button to StoryDetailScreen header
- Create BookmarksScreen (similar to FeedScreen)
- Show bookmark count badge
- Support swipe-to-delete on BookmarksScreen
- Empty state with helpful message

**Navigation:**
- Add "Bookmarks" icon to header (top-right)
- Opens modal/stack screen with bookmarked stories
- Use same StoryList component for consistency

**Tests:**
- Bookmark CRUD operations
- Persistence across app restarts
- Multiple bookmark scenarios
- Empty states
- Target: 80%+ coverage for bookmark features

**2. Reading History**

**Data Layer:**
```typescript
// src/store/historyStore.ts
interface HistoryEntry {
  storyId: number;
  story: Story; // Cache story data
  readAt: number;
  readType: 'article' | 'comments';
}

interface HistoryState {
  history: HistoryEntry[]; // Max 500, FIFO
  markAsRead: (story: Story, type: 'article' | 'comments') => void;
  isRead: (storyId: number) => boolean;
  clearHistory: () => void;
  getRecentHistory: (limit: number) => HistoryEntry[];
}
```

**UI Updates:**
- Dim read stories in feed (70% opacity)
- Add "History" icon to header (next to bookmarks)
- Create HistoryScreen showing recent reads
- Show read timestamp
- Support filtering by type (article vs comments)
- Clear history button with confirmation

**Auto-Tracking:**
- Track when user opens StoryDetailScreen
- Track when user opens ArticleScreen
- Automatic, no user action required

**Tests:**
- History tracking on navigation
- FIFO with 500-item limit
- Read indicators visual regression
- Clear history functionality
- Target: 80%+ coverage

**Deliverables:**
- ✅ Bookmarks fully functional
- ✅ History tracking automatic
- ✅ Both persist across restarts
- ✅ Visual indicators working
- ✅ 2 new screens (Bookmarks, History)
- ✅ Header navigation updated
- ✅ 80%+ test coverage for new features
- ✅ All tests passing (90+ tests expected)

**Success Criteria:**
- Users can bookmark any story
- Bookmarks persist forever (until manually removed)
- Read stories are visually distinct
- History tracks last 500 stories
- Smooth UX (optimistic updates)

---

### **Sprint 2: Discovery - Search & Filters** (4 days) 🔍

**Goal:** Help users find stories across feeds, bookmarks, and history

#### Features:

**1. Search Functionality**

**Search Algorithm:**
```typescript
// src/utils/searchStories.ts
interface SearchOptions {
  query: string;
  sources: ('cache' | 'bookmarks' | 'history')[];
  filters?: {
    author?: string;
    dateFrom?: number;
    dateTo?: number;
    minScore?: number;
    feedType?: FeedType;
  };
  sortBy?: 'relevance' | 'date' | 'score';
}

interface SearchResult {
  story: Story;
  source: 'cache' | 'bookmarks' | 'history';
  relevance: number; // 0-1 score
  highlights: string[]; // matched terms
}

function searchStories(options: SearchOptions): SearchResult[];
```

**Search Scoring:**
- Title match: 1.0
- Author match: 0.7
- URL domain match: 0.5
- Case-insensitive
- Partial matching

**UI:**
- Add search icon to header
- Opens SearchScreen (modal or stack)
- Search input with debouncing (300ms)
- Filter chips (All, Bookmarks, History, Cache)
- Sort options (dropdown)
- Results in StoryList format
- Empty state for no results
- Search tips for empty initial state

**Performance:**
- Debounced input (avoid re-renders)
- Search on client-side (no API calls)
- Limit results to 100 max
- Virtual scrolling with FlashList

**Tests:**
- Search algorithm correctness
- Relevance scoring
- Filter combinations
- Empty results handling
- Performance with large datasets
- Target: 80%+ coverage

**Deliverables:**
- ✅ Search screen functional
- ✅ Multi-source search (cache, bookmarks, history)
- ✅ Filters and sorting
- ✅ Fast, responsive UX
- ✅ 80%+ test coverage
- ✅ All tests passing (100+ tests expected)

**Success Criteria:**
- Search results appear in <100ms
- Accurate relevance scoring
- Useful filters (actually filter results)
- Good empty states

---

### **Sprint 3: Sharing & Settings** (3 days) 📤 ⚙️

**Goal:** Enable sharing and app customization

#### Features:

**1. Share Functionality**

**Implementation:**
```typescript
// src/utils/shareStory.ts
interface ShareOptions {
  story: Story;
  includeArticleUrl?: boolean;
  includeMetadata?: boolean;
}

async function shareStory(options: ShareOptions): Promise<void> {
  const message = formatShareMessage(options);
  await Share.share({
    message,
    title: options.story.title,
    url: options.story.url,
  });
}

function formatShareMessage(options: ShareOptions): string {
  // 📰 {Story Title}
  // 🗨️  Discussion: https://news.ycombinator.com/item?id={id}
  // {Article URL if included}
  //
  // Shared via Hacker News Reader
}
```

**UI:**
- Add share icon to StoryListItem actions
- Add share button to StoryDetailScreen header
- Add share button to ArticleScreen header
- Use native share sheet (iOS/Android)

**Analytics (Local):**
- Track share count (for sorting popular stories later)
- Store in preferences

**Tests:**
- Share message formatting
- Share sheet opening (mock Share API)
- Different share scenarios
- Target: 80%+ coverage

**2. Settings Screen**

**Settings Groups:**
```typescript
// Appearance
- Theme: System | Light | Dark
- Text Size: Small | Medium | Large | Extra Large
- View Mode: Compact | Comfortable

// Content
- Stories Per Page: 20 | 30 | 50
- Default Feed: Top | New | Best | Ask | Show | Jobs
- Auto-mark as Read: On | Off

// Privacy
- Clear History
- Clear Bookmarks (with confirmation)
- Reset All Settings

// About
- App Version
- Open Source Licenses
- GitHub Repository Link
```

**UI:**
- Grouped list (SectionList)
- Toggle switches for booleans
- Picker/dropdown for options
- Confirmation dialogs for destructive actions
- Preview area showing current settings

**Text Size Implementation:**
```typescript
// src/theme/typography.ts - Add scale multiplier
interface TypographyScale {
  small: number;   // 0.875
  medium: number;  // 1.0 (default)
  large: number;   // 1.125
  xlarge: number;  // 1.25
}

// Apply to all text components via theme
```

**View Mode:**
- Compact: Smaller padding, no domain on separate line
- Comfortable: Current design (default)

**Tests:**
- Settings CRUD
- Theme switching
- Text size scaling
- View mode toggle
- Destructive action confirmations
- Target: 80%+ coverage

**Deliverables:**
- ✅ Share working on all screens
- ✅ Settings screen complete
- ✅ All preferences functional
- ✅ Text size actually affects UI
- ✅ View mode toggle works
- ✅ 80%+ test coverage
- ✅ All tests passing (120+ tests expected)

**Success Criteria:**
- Users can share any story
- Settings persist across restarts
- Text size visibly changes UI
- Settings are discoverable and intuitive

---

## 🏗️ Updated Architecture

### Storage Schema:

```typescript
// AsyncStorage Keys
'@hacknews:theme'         → { mode: 'system' | 'light' | 'dark' }
'@hacknews:preferences'   → Preferences (textSize, storiesPerPage, etc.)
'@hacknews:bookmarks'     → Bookmark[] (no size limit)
'@hacknews:history'       → HistoryEntry[] (max 500)
```

### New Files Structure:

```
src/
├── store/
│   ├── middleware/
│   │   ├── persistence.ts          # NEW: Reusable persistence middleware
│   │   └── persistence.test.ts     # NEW
│   ├── bookmarksStore.ts           # NEW
│   ├── historyStore.ts             # NEW
│   ├── themeStore.ts               # UPDATED: Add persistence
│   └── preferencesStore.ts         # UPDATED: Add more preferences + persistence
├── screens/
│   ├── BookmarksScreen.tsx         # NEW
│   ├── HistoryScreen.tsx           # NEW
│   ├── SearchScreen.tsx            # NEW
│   ├── SettingsScreen.tsx          # NEW
│   └── [existing screens...]       # UPDATED: Add share buttons
├── components/
│   ├── story/
│   │   ├── StoryListItem.tsx       # UPDATED: Action slots
│   │   └── StoryActions.tsx        # NEW: Action icons component
│   └── [existing components...]
├── utils/
│   ├── searchStories.ts            # NEW
│   ├── shareStory.ts               # NEW
│   └── [existing utils...]
├── hooks/
│   ├── useBookmarks.ts             # NEW
│   ├── useHistory.ts               # NEW
│   ├── useSearch.ts                # NEW
│   └── [existing hooks...]         # DELETE: useStories.ts
├── __tests__/
│   ├── utils/
│   │   ├── testHelpers.tsx         # NEW: Test infrastructure
│   │   ├── fixtures.ts             # NEW: Test data generators
│   │   ├── searchStories.test.ts   # NEW
│   │   └── shareStory.test.ts      # NEW
│   ├── store/
│   │   ├── persistence.test.ts     # NEW
│   │   ├── bookmarksStore.test.ts  # NEW
│   │   └── historyStore.test.ts    # NEW
│   ├── screens/
│   │   ├── FeedScreen.test.tsx     # NEW: Baseline tests
│   │   ├── BookmarksScreen.test.tsx # NEW
│   │   ├── HistoryScreen.test.tsx  # NEW
│   │   ├── SearchScreen.test.tsx   # NEW
│   │   └── SettingsScreen.test.tsx # NEW
│   └── [existing test files...]
└── navigation/
    ├── AppNavigator.tsx            # UPDATED: Add header actions
    └── types.ts                    # UPDATED: New screen types
```

### Navigation Structure:

```
Stack Navigator (Root)
├── Home (Bottom Tabs)
│   ├── Top Feed
│   ├── New Feed
│   ├── Best Feed
│   ├── Ask Feed
│   ├── Show Feed
│   └── Jobs Feed
├── StoryDetail (existing)
├── Article (existing)
├── Bookmarks (NEW - modal)
├── History (NEW - modal)
├── Search (NEW - modal)
└── Settings (NEW - modal)

Header Actions (on Home screen):
- Left: [none]
- Right: [Search Icon] [Bookmarks Icon] [Settings Icon]
```

---

## 📊 Phase 2 Metrics & Goals

### Code Metrics:

**Estimated Lines of Code:**
- Sprint 0: +400 lines (infrastructure)
- Sprint 1: +800 lines (bookmarks + history)
- Sprint 2: +500 lines (search)
- Sprint 3: +400 lines (share + settings)
- **Total: ~2,100 new lines**

**Test Coverage Goals:**
- Sprint 0: 50% overall (up from 38%)
- Sprint 1: 65% overall
- Sprint 2: 75% overall
- Sprint 3: 80% overall ✅
- **Each new feature: 80%+ coverage**

**Test Count:**
- Current: 54 tests
- Sprint 0: +20 tests (74 total)
- Sprint 1: +25 tests (99 total)
- Sprint 2: +15 tests (114 total)
- Sprint 3: +15 tests (129 total)
- **Final: 129+ tests**

### Quality Gates (Every Sprint):

- ✅ TypeScript: 0 errors (strict mode)
- ✅ ESLint: 0 errors
- ✅ All tests passing
- ✅ New code: 80%+ coverage
- ✅ No unused code
- ✅ No console warnings
- ✅ Performance: 60fps scrolling maintained

---

## 🧪 Testing Strategy (Updated)

### Test Infrastructure (Sprint 0):

```typescript
// src/__tests__/utils/testHelpers.tsx

export const renderWithProviders = (
  component: React.ReactElement,
  options?: RenderOptions
) => { /* ... */ };

export const mockNavigation = (options?: NavOptions) => { /* ... */ };

export const createMockStore = <T>(
  initialState: T,
  storeName: string
) => { /* ... */ };

export const waitForAsync = () => new Promise(resolve =>
  setTimeout(resolve, 0)
);

// Fixture generators
export const createMockStory = (overrides?: Partial<Story>): Story => { /* ... */ };
export const createMockComment = (overrides?: Partial<Comment>): Comment => { /* ... */ };
```

### Test Categories:

**Unit Tests:** (80%+ coverage)
- Store actions and selectors
- Utility functions (search, share, format)
- Hooks (useBookmarks, useHistory, useSearch)
- Components (isolated rendering)

**Integration Tests:** (60%+ coverage)
- Store persistence (write → restart → read)
- Navigation flows (feed → detail → bookmark)
- Search across multiple sources
- Theme and preference changes

**Component Tests:** (70%+ coverage)
- Screen rendering with providers
- User interactions (press, swipe, type)
- Visual states (empty, loading, error)

**End-to-End Flows:** (manual, for now)
- Complete user journey: browse → read → bookmark → search → find
- Theme switching affects all screens
- Settings persist across app restarts

---

## ⏱️ Revised Timeline

### Total: 15 days (3 weeks)

**Sprint 0: Foundation** (3 days)
- Day 1: Clean up code, implement persistence middleware
- Day 2: Add persistence to existing stores, refactor StoryListItem
- Day 3: Test infrastructure, baseline screen tests

**Sprint 1: Bookmarks & History** (5 days)
- Day 1-2: Bookmarks store, UI, BookmarksScreen
- Day 3-4: History store, tracking, HistoryScreen, visual indicators
- Day 5: Testing, polish, integration

**Sprint 2: Search** (4 days)
- Day 1-2: Search algorithm, scoring, filters
- Day 3: SearchScreen UI, integration
- Day 4: Testing, performance optimization

**Sprint 3: Share & Settings** (3 days)
- Day 1: Share functionality across screens
- Day 2: Settings screen, all preferences wired up
- Day 3: Testing, polish, final QA

**Buffer:** Weekend for polish, bug fixes, documentation

---

## ✅ Sprint 0 Checklist (Start Here)

**Before Sprint 1 Begins:**

- [ ] Delete `src/hooks/useStories.ts`
- [ ] Wire up or remove `storiesPerPage` preference
- [ ] Create `src/store/middleware/persistence.ts`
- [ ] Write tests for persistence middleware (80%+)
- [ ] Add persistence to `themeStore.ts`
- [ ] Add persistence to `preferencesStore.ts`
- [ ] Verify preferences persist across app restarts
- [ ] Create `src/__tests__/utils/testHelpers.tsx`
- [ ] Implement `renderWithProviders` utility
- [ ] Implement `mockNavigation` utility
- [ ] Implement `createMockStore` utility
- [ ] Create fixture generators (createMockStory, etc.)
- [ ] Refactor StoryListItem for action slots
- [ ] Update StoryListItem tests
- [ ] Add basic FeedScreen tests (rendering, feed type)
- [ ] Add basic StoryDetailScreen tests
- [ ] Add basic ArticleScreen tests
- [ ] Reach 50% overall test coverage
- [ ] All tests passing (70+ tests)
- [ ] 0 TypeScript errors
- [ ] 0 ESLint errors
- [ ] Update documentation (README, architecture docs)
- [ ] Code review and approval

**Success Criteria:**
- Clean codebase ready for new features
- Solid test infrastructure
- Persistence working and tested
- 50%+ coverage baseline

---

## 📚 Documentation Updates

**Files to Update:**
- README.md - Phase 2 progress
- PHASE_1_LEARNINGS.md - Final learnings doc
- PHASE_2_PLAN_REVISED.md - This document
- Architecture diagrams (if created)

**New Documentation:**
- Persistence middleware guide
- Testing best practices
- Search algorithm documentation
- Component action slot pattern guide

---

## 🎯 Success Metrics for Phase 2

### User Experience:
- ✅ Bookmarks persist forever (until removed)
- ✅ History tracks last 500 reads automatically
- ✅ Search returns results in <100ms
- ✅ Share works with all native apps
- ✅ Settings changes apply immediately
- ✅ All features work offline (for cached data)

### Code Quality:
- ✅ 80%+ test coverage
- ✅ 129+ tests passing
- ✅ 0 TypeScript errors
- ✅ 0 ESLint errors
- ✅ No unused code
- ✅ Clean architecture patterns

### Performance:
- ✅ 60fps scrolling maintained
- ✅ Search <100ms response time
- ✅ AsyncStorage reads <10ms
- ✅ Optimistic UI updates (bookmarks, etc.)
- ✅ No memory leaks

### Maintainability:
- ✅ Reusable persistence pattern
- ✅ Reusable test utilities
- ✅ Clear component patterns
- ✅ Good documentation
- ✅ Easy to extend for Phase 3

---

## 🚀 Next Steps

1. **Review this revised plan** - Approve or adjust
2. **Start Sprint 0** - Foundation work
3. **Daily check-ins** - Track progress, adjust as needed
4. **Sprint reviews** - Demo features, gather feedback
5. **Iterate** - Improve based on learnings

---

**Version:** 2.0 (Revised)
**Created:** November 2025
**Status:** Ready for Sprint 0 Implementation
**Based On:** Phase 1 Learnings + User Feedback
