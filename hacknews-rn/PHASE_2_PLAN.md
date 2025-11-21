# Phase 2: Hybrid Approach - Local Features

**Status:** Planning Complete - Ready for Implementation
**Strategy:** Implement safe, local-only features while keeping architecture open for future authentication

---

## 🎯 Phase 2 Goals

Enhance user experience with valuable local features that don't require HN API authentication:
- Bookmarks/Favorites system
- Reading history tracking
- Search within cached stories
- Share functionality
- Enhanced user preferences

---

## 📋 Feature Breakdown

### 1. Bookmarks/Favorites System ⭐ **HIGH PRIORITY**

**User Story:** As a user, I want to save interesting stories for later reading.

**Technical Implementation:**
- Store bookmarked story IDs in AsyncStorage
- Key: `@hacknews:bookmarks` → JSON array of story IDs
- Add bookmark icon to StoryListItem and StoryDetail screens
- Create new "Bookmarks" tab in bottom navigation
- Sync full story data for offline viewing
- Support unbookmarking from any screen

**Data Structure:**
```typescript
interface Bookmark {
  id: number;
  storyId: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  descendants: number;
  bookmarkedAt: number; // timestamp
}

// Storage key: @hacknews:bookmarks
// Value: Bookmark[]
```

**UI Changes:**
- Add bookmark icon (star/bookmark) to StoryListItem (right side)
- Add bookmark button to StoryDetailScreen header
- Create new BookmarksScreen component
- Add "Bookmarks" to bottom tab navigation
- Show empty state when no bookmarks

**Estimated LOC:** ~300 lines
**Files to Create:**
- `src/store/bookmarksStore.ts` (Zustand store)
- `src/screens/BookmarksScreen.tsx`
- `src/hooks/useBookmarks.ts`
- `src/__tests__/bookmarks.test.ts`

---

### 2. Reading History 📖 **HIGH PRIORITY**

**User Story:** As a user, I want to see which stories I've already read.

**Technical Implementation:**
- Track when user opens story details or article
- Store in AsyncStorage with timestamp
- Key: `@hacknews:history` → JSON array with limit (last 500 stories)
- Visual indicator on StoryListItem (opacity change or badge)
- Create "History" screen to review past reads
- Support clearing history

**Data Structure:**
```typescript
interface HistoryEntry {
  storyId: number;
  title: string;
  url?: string;
  readAt: number; // timestamp
  readType: 'article' | 'comments'; // what they viewed
}

// Storage key: @hacknews:history
// Value: HistoryEntry[] (max 500, FIFO)
```

**UI Changes:**
- Dim/change color of read stories in feed
- Add "History" screen (accessible from profile/settings)
- Show "Clear History" button
- Add read indicator badge

**Estimated LOC:** ~250 lines
**Files to Create:**
- `src/store/historyStore.ts`
- `src/screens/HistoryScreen.tsx`
- `src/hooks/useHistory.ts`
- `src/__tests__/history.test.ts`

---

### 3. Search Functionality 🔍 **MEDIUM PRIORITY**

**User Story:** As a user, I want to search through cached stories and my bookmarks.

**Technical Implementation:**
- Search through TanStack Query cache (in-memory stories)
- Search through bookmarks
- Search through history
- Filter by: title, author, date range
- Sort by: relevance, date, score

**Search Algorithm:**
- Simple text matching (case-insensitive)
- Search fields: title, author (by), URL domain
- Rank by relevance: title match > author match > URL match

**UI Changes:**
- Add search icon to header
- Create SearchScreen with input and filters
- Show results in StoryList format
- Empty state for no results

**Estimated LOC:** ~200 lines
**Files to Create:**
- `src/screens/SearchScreen.tsx`
- `src/utils/searchStories.ts`
- `src/__tests__/search.test.ts`

---

### 4. Share Functionality 📤 **MEDIUM PRIORITY**

**User Story:** As a user, I want to share interesting stories with others.

**Technical Implementation:**
- Use React Native's built-in Share API (no extra dependencies)
- Share story with: title + HN link + (optional) article URL
- Support sharing from StoryListItem and StoryDetailScreen
- Format: "Story Title - https://news.ycombinator.com/item?id=123"

**Share Format:**
```
📰 {Story Title}
🗨️ Discussion: https://news.ycombinator.com/item?id={id}
{Article URL if exists}
```

**UI Changes:**
- Add share icon to StoryListItem (in action row)
- Add share button to StoryDetailScreen header
- Add share button to ArticleScreen header

**Estimated LOC:** ~100 lines
**Files to Create:**
- `src/utils/shareStory.ts`
- `src/__tests__/shareStory.test.ts`

---

### 5. Enhanced User Preferences 🎨 **LOW PRIORITY**

**User Story:** As a user, I want to customize my reading experience.

**Technical Implementation:**
- Expand existing preferencesStore.ts
- Store in AsyncStorage: `@hacknews:preferences`
- Preferences to add:
  - Text size (small, medium, large)
  - Stories per page (20, 30, 50)
  - Default feed (Top, New, Best, etc.)
  - Auto-mark as read
  - Compact/comfortable view mode

**Data Structure:**
```typescript
interface Preferences {
  textSize: 'small' | 'medium' | 'large';
  storiesPerPage: 20 | 30 | 50;
  defaultFeed: FeedType;
  autoMarkAsRead: boolean;
  viewMode: 'compact' | 'comfortable';
}
```

**UI Changes:**
- Create SettingsScreen
- Add settings icon to header
- Group settings by category
- Show preview of changes

**Estimated LOC:** ~200 lines
**Files to Create:**
- `src/screens/SettingsScreen.tsx`
- Update `src/store/preferencesStore.ts`
- `src/__tests__/preferences.test.ts`

---

## 🏗️ Architecture Changes

### New Stores (Zustand)
1. **bookmarksStore.ts** - Manage bookmarks with AsyncStorage persistence
2. **historyStore.ts** - Manage reading history with AsyncStorage persistence
3. Expand **preferencesStore.ts** - Add more user preferences

### Storage Keys Convention
```
@hacknews:bookmarks    → Bookmark[]
@hacknews:history      → HistoryEntry[] (max 500)
@hacknews:preferences  → Preferences
```

### Navigation Updates
Add new screens to RootStackParamList:
- BookmarksScreen
- HistoryScreen
- SearchScreen
- SettingsScreen

### Storage Best Practices
- **Error handling:** Try-catch all AsyncStorage operations
- **Data validation:** Validate on read, sanitize on write
- **Size limits:** History max 500 entries, bookmarks unlimited
- **Serialization:** Use JSON.stringify/parse
- **Cleanup:** Implement data pruning for history

---

## 📊 Implementation Priority

### Sprint 1: Core Persistence (Week 1)
1. ✅ Bookmarks system (full CRUD)
2. ✅ Reading history tracking
3. ✅ Update navigation with new tabs

### Sprint 2: Discovery & Sharing (Week 2)
1. ✅ Search functionality
2. ✅ Share integration
3. ✅ Visual indicators for read stories

### Sprint 3: Personalization (Week 3)
1. ✅ Enhanced preferences
2. ✅ Settings screen
3. ✅ Text size adjustment
4. ✅ View mode options

---

## 🧪 Testing Strategy

### Unit Tests
- AsyncStorage mocking for all stores
- Search algorithm correctness
- Data validation and sanitization
- Storage limits enforcement

### Integration Tests
- Bookmark add/remove workflow
- History tracking across screens
- Search across multiple data sources
- Share functionality

### Target Coverage
- Maintain 80%+ overall coverage
- 100% coverage for critical paths (storage operations)

---

## 📈 Success Metrics

**User Engagement:**
- % of users who bookmark stories
- Average bookmarks per user
- Search usage frequency
- Share action frequency

**Technical:**
- AsyncStorage read/write performance
- Memory usage with large bookmark lists
- Search performance (aim for <100ms)

---

## 🚀 Future Authentication Hook-ins

**Keep these hooks for Phase 3:**
- Bookmarks → Sync with HN favorites API (if available)
- History → Sync across devices
- Preferences → Cloud sync
- Architecture: Local-first, sync when authenticated

**Storage migration path:**
```typescript
// Phase 2: Local only
bookmarks: Bookmark[]

// Phase 3: Add sync metadata
bookmarks: {
  local: Bookmark[],
  synced: Bookmark[],
  lastSync: number
}
```

---

## 📦 Dependencies

**Already Installed:**
- ✅ `@react-native-async-storage/async-storage@^2.2.0`
- ✅ `zustand@^5.0.8`

**No New Dependencies Needed:**
- Share: Use React Native's built-in `Share` API
- Search: Implement custom logic
- Icons: Use existing icon library or Unicode

---

## 🎯 Phase 2 Deliverables

### Code
- 5 new screens (Bookmarks, History, Search, Settings + updates)
- 3 new Zustand stores
- 5+ new hooks
- 1,000+ new lines of code
- 30+ new tests

### Documentation
- Update README with Phase 2 features
- Storage architecture documentation
- User guide for new features

### Quality
- All tests passing
- TypeScript strict mode: 0 errors
- ESLint: 0 errors
- 80%+ test coverage maintained

---

## ⏱️ Estimated Timeline

**Total:** 3 weeks (assuming dedicated development)

- **Week 1:** Bookmarks + History (core persistence)
- **Week 2:** Search + Share (discovery & sharing)
- **Week 3:** Preferences + Settings (personalization)
- **Buffer:** Polish, testing, bug fixes

---

## ✅ Next Steps

1. Review and approve this plan
2. Start with Sprint 1: Bookmarks system
3. Iterate with user feedback
4. Monitor performance metrics
5. Plan Phase 3 based on Phase 2 learnings

---

**Version:** 1.0
**Created:** November 2025
**Status:** Ready for Implementation
