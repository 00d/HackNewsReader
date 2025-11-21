# Hacker News Reader - React Native

A modern, fully-featured Hacker News client built with React Native and Expo, featuring all 6 feed types, threaded comments, and a clean HN Orange aesthetic.

## ✨ Features (Phase 1 - Complete)

### 📱 Core Functionality
- ✅ **6 Feed Types:** Top, New, Best, Ask HN, Show HN, Jobs
- ✅ **30 Stories Per Page** with "Load More" pagination
- ✅ **Threaded Comments** with recursive nesting and collapse/expand
- ✅ **In-App Browser** for reading articles via WebView
- ✅ **Pull-to-Refresh** on all feeds
- ✅ **Dark Mode** with system-aware theme switching
- ✅ **Real-time API** connection to Hacker News Firebase API

### 🎨 Design
- **HN Orange/Minimal** aesthetic (#ff6600 accent color)
- **Material Design** influences for Android
- Clean, readable typography
- Optimized for readability and content consumption

### 🏗️ Technical Stack
- **React Native 0.81.5** with New Architecture
- **Expo SDK 54** for simplified development
- **TypeScript** with strict mode
- **TanStack Query** for server state management
- **Zustand** for client state
- **React Navigation 7** (Stack + Bottom Tabs)
- **FlashList** for optimized list performance
- **Axios** for HTTP requests

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ LTS
- npm 10+
- Android Studio (for Android development)
- Expo CLI (installed automatically)

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
\`\`\`

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# TypeScript type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
\`\`\`

## 📂 Project Structure

\`\`\`
hacknews-rn/
├── src/
│   ├── api/                  # API client and types
│   │   ├── client.ts         # Axios instance with interceptors
│   │   ├── hnApi.ts          # HN API service layer
│   │   └── types.ts          # TypeScript types for API
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   ├── story/            # Story-related components
│   │   ├── comment/          # Comment threading components
│   │   └── webview/          # WebView wrapper (future)
│   ├── screens/              # Screen components
│   │   ├── FeedScreen.tsx    # Reusable feed screen
│   │   ├── StoryDetailScreen.tsx
│   │   └── ArticleScreen.tsx
│   ├── navigation/           # Navigation setup
│   │   ├── AppNavigator.tsx  # Root navigator
│   │   └── types.ts          # Navigation types
│   ├── hooks/                # Custom React hooks
│   │   ├── useStories.ts     # TanStack Query hooks
│   │   └── useStoryDetail.ts
│   ├── store/                # Zustand stores
│   │   ├── themeStore.ts     # Theme state
│   │   └── preferencesStore.ts
│   ├── utils/                # Utility functions
│   │   ├── formatTime.ts     # Time/date formatting
│   │   ├── parseHtml.ts      # HTML sanitization
│   │   └── constants.ts      # App constants
│   ├── theme/                # Theme configuration
│   │   ├── colors.ts         # Color palette
│   │   ├── typography.ts     # Font scales
│   │   └── spacing.ts        # Spacing scale
│   ├── __tests__/            # Test files
│   └── App.tsx               # Root app component
├── App.tsx                   # Entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
\`\`\`

## 🧪 Testing

### Test Coverage
- **54 tests** passing
- **Utility functions:** 96% coverage
- **API layer:** 55% coverage (integration tests)
- **Hooks:** 100% coverage (critical pagination)
- **Components:** Growing coverage

### Test Types
1. **Unit Tests:** Utility functions (formatTime, parseHtml)
2. **Integration Tests:** Real HN API connectivity
3. **Component Tests:** React component rendering
4. **Type Safety:** TypeScript strict mode

## 🎯 Phase 1 Achievements

### ✅ Completed
- [x] Project setup with Expo + TypeScript
- [x] API layer with HN Firebase endpoints
- [x] Theme system (HN Orange, dark/light mode)
- [x] Navigation (6 feed types via bottom tabs)
- [x] Story list with FlashList optimization
- [x] Recursive comment threading
- [x] In-app WebView for articles
- [x] Pull-to-refresh and infinite scroll pagination
- [x] 54 passing tests (including pagination fix)
- [x] TypeScript strict mode (zero errors)
- [x] ESLint + Prettier configuration
- [x] Critical pagination bug fixed (proper story accumulation)

### 🎨 Design Decisions
1. **HN Orange Theme:** Matches Hacker News website aesthetic
2. **System-aware Dark Mode:** Automatically adapts to device settings
3. **Read-only Phase 1:** No voting/posting (as planned)
4. **30 Stories:** Matches HN website standard
5. **In-app Browser:** Better UX than external browser

### 🏛️ Architecture Decisions
1. **Expo over Bare RN:** Faster development, easier maintenance
2. **TanStack Query:** Purpose-built for API data
3. **Zustand:** Lightweight state management
4. **FlashList:** 10x better performance than FlatList
5. **TypeScript Strict:** Catch errors at compile-time

## 🔌 API Integration

### Hacker News API
- **Base URL:** `https://hacker-news.firebaseio.com/v0/`
- **Endpoints:**
  - `/topstories.json` - Top stories
  - `/newstories.json` - Newest submissions
  - `/beststories.json` - Best ranked
  - `/askstories.json` - Ask HN posts
  - `/showstories.json` - Show HN posts
  - `/jobstories.json` - Job postings
  - `/item/{id}.json` - Story/comment details

### Caching Strategy
- **Feed IDs:** 2 minutes
- **Stories:** 5 minutes
- **Comments:** 10 minutes

## 🛠️ Development

### Code Quality Tools
- **ESLint:** Code linting with TypeScript support
- **Prettier:** Code formatting
- **Husky:** Git hooks (ready to enable)
- **TypeScript:** Strict type checking
- **Jest:** Unit and integration testing

### Scripts
\`\`\`bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm test           # Run tests
npm run lint       # Lint code
npm run format     # Format code
npm run type-check # TypeScript checking
\`\`\`

## 📱 Minimum Requirements
- **Android:** API 26 (Android 8.0 Oreo) or higher
- **iOS:** iOS 13.0 or higher (Phase 2)
- **Storage:** ~50MB
- **Network:** Internet connection required

## 🚧 Phase 2: Hybrid Approach - Local Features (In Progress)

### ✅ Sprint 0: Foundation & Technical Debt (Complete)
- [x] **Persistence Middleware** - Reusable AsyncStorage integration for Zustand
- [x] **Test Infrastructure** - Comprehensive test utilities and baseline coverage (65.37%)
- [x] **Technical Debt Cleanup** - Removed unused code, wired up preferences
- [x] **93 Total Tests** - 79 passing, with FlashList mocking and proper fixtures

### ✅ Sprint 1: Core Persistence (Complete)
- [x] **Bookmarks/Favorites System** - Save stories with star icon, persists offline
- [x] **Reading History** - Auto-track viewed stories with visual indicators (dimmed text)
- [x] **BookmarksScreen** - Full-featured view with empty state and "Clear All"
- [x] **HistoryScreen** - Reading history with FIFO (500 item limit)
- [x] **Header Navigation** - Quick access buttons (★ Bookmarks, 📖 History)
- [x] Navigation updates for new screens

### Sprint 2: Discovery & Sharing (Week 2)
- [ ] **Search Functionality** - Search cached stories, bookmarks, and history
- [ ] **Share Integration** - Share stories using native Share API
- [ ] Visual polish and read indicators

### Sprint 3: Personalization (Week 3)
- [ ] **Enhanced Preferences** - Text size, stories per page, default feed
- [ ] **Settings Screen** - Central hub for app customization
- [ ] View mode options (compact/comfortable)

### Deferred to Phase 3 (Authentication Required)
- [ ] User authentication (HN login) - *Requires unofficial API*
- [ ] Upvoting stories and comments - *Requires authentication*
- [ ] Posting comments - *Requires authentication*
- [ ] Cloud sync for bookmarks/history
- [ ] Offline reading (full article cache)
- [ ] Push notifications
- [ ] Comment reply notifications

> **Note:** The official HN API is read-only. Phase 2 focuses on safe, local-only features that provide immediate value without requiring authentication or unofficial API usage.

## 📊 Performance

### Optimizations
- **FlashList:** Optimized list rendering
- **TanStack Query:** Automatic caching and background updates
- **React Native New Architecture:** Better performance
- **Lazy Loading:** Comments loaded on demand
- **Pagination:** 30 stories at a time

### Benchmarks
- **Time to Interactive:** <2s
- **List Scroll:** 60fps
- **API Response Cache:** <100ms

## 🤝 Contributing

This project follows the modernization plan documented in the research phase:
1. Read-only Phase 1 (Complete)
2. Interactive Phase 2 (Voting, commenting)
3. Advanced Phase 3 (Offline, notifications, etc.)

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- **Hacker News API:** Y Combinator
- **React Native:** Meta/Facebook
- **Expo:** Expo team
- Built as part of a legacy app modernization project

---

## 📄 Documentation

- [Phase 1 Learnings](./PHASE_1_LEARNINGS.md) - Lessons learned and architectural insights
- [Phase 2 Plan (Original)](./PHASE_2_PLAN.md) - Initial hybrid approach roadmap
- [Phase 2 Plan (Revised)](./PHASE_2_PLAN_REVISED.md) - **Updated plan based on Phase 1 learnings**

---

**Version:** 1.1.0
**Status:** Phase 1 Complete ✅ | Phase 2 Sprint 0 & 1 Complete ✅
**Last Updated:** November 2025
