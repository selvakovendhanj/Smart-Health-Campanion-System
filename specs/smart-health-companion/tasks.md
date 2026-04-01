# Implementation Plan: Smart Health Companion

## Overview

Build a single-page web application with vanilla JavaScript ES6+ modules, Bootstrap 5, and Chart.js. All logic is client-side; data is persisted via localStorage. Implementation proceeds module-by-module, wiring everything together in the final step.

## Tasks

- [-] 1. Project scaffold and Storage module
  - Create `index.html` SPA shell with Bootstrap 5, Chart.js, and Bootstrap Icons CDNs loaded
  - Create `js/storage.js` implementing `Storage.set()`, `Storage.get()`, `Storage.remove()`, and `Storage.isAvailable()` with `shc_` namespace prefix
  - Add loading spinner overlay (hidden after 800ms) and localStorage unavailability warning banner
  - _Requirements: 7.1, 7.6, 9.1, 9.3, 9.4_

  - [-] 1.1 Write property test for Storage key namespace (Property 18)
    - **Property 18: Storage keys are namespaced**
    - **Validates: Requirements 9.3**

  - [~] 1.2 Write unit tests for Storage module
    - Test `isAvailable()` when localStorage is mocked unavailable
    - Test corrupt JSON handling in `Storage.get()`
    - _Requirements: 9.1, 9.4_

- [~] 2. Auth_UI module
  - Create `js/auth.js` implementing `AuthUI.showSignup()`, `showLogin()`, `handleSignup()`, `handleLogin()`, `isLoggedIn()`, `logout()`
  - Add signup form (username, email, password) and login form (username/email, password) to `index.html` `#auth` section
  - Implement inline error display and loading animation during form submission
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [~] 2.1 Write property test for signup stores credentials (Property 1)
    - **Property 1: Signup stores credentials**
    - **Validates: Requirements 1.3**

  - [~] 2.2 Write property test for signup→login round-trip (Property 2)
    - **Property 2: Signup → Login round-trip creates session**
    - **Validates: Requirements 1.3, 1.4**

  - [~] 2.3 Write property test for invalid login returns error (Property 3)
    - **Property 3: Invalid login returns error**
    - **Validates: Requirements 1.5**

  - [~] 2.4 Write property test for duplicate email signup (Property 4)
    - **Property 4: Duplicate email signup returns error**
    - **Validates: Requirements 1.6**

- [~] 3. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [~] 4. Homepage, navigation, and footer
  - Add `<nav>` with links to Home, Features, Tracker, Mental Wellness, and Contact sections
  - Add `#home` hero section with tagline, "Get Started" and "Track Now" CTA buttons
  - Add `#contact` footer with contact info placeholders, social media icon links (Facebook, Twitter, Instagram opening in new tab), and About text
  - Implement smooth scroll animations and hamburger menu collapse below 768px
  - Apply blue/green gradient theme and CSS transition animations to buttons and cards
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.3, 7.5, 8.1, 8.2, 8.3, 8.4_

  - [~] 4.1 Write unit tests for DOM structure
    - Verify nav links, hero tagline text, CTA buttons, footer social links, and About section exist in the DOM
    - _Requirements: 2.1, 2.2, 8.1, 8.2, 8.3_

- [~] 5. Health_Tracker and Chart_Renderer modules
  - Create `js/health-tracker.js` implementing `HealthTracker.submitEntry()` and `getHistory()` with field-level validation (all fields numeric > 0)
  - Create `js/chart-renderer.js` implementing `ChartRenderer.init()` and `update()` using Chart.js for four charts: Steps (bar), Water (line), Sleep (line), Calories (bar) showing last 7 days
  - Add `#tracker` section to `index.html` with metric input form (steps, water, sleep, calories), chart canvases, and AI recommendations card
  - Wire `submitEntry()` to call `Storage`, `ChartRenderer.update()`, and `AIEngine.evaluate()` without full page reload
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 7.2_

  - [~] 5.1 Write property test for invalid health entry rejected (Property 5)
    - **Property 5: Health entry validation rejects invalid inputs and does not persist them**
    - **Validates: Requirements 3.2, 3.3**

  - [~] 5.2 Write property test for valid health entry persisted (Property 6)
    - **Property 6: Valid health entry is persisted with a date timestamp**
    - **Validates: Requirements 3.4**

  - [~] 5.3 Write unit tests for Health_Tracker
    - Test end-to-end submit: verify Storage write, chart update call, and AI suggestions render
    - Test chart canvas missing degrades gracefully
    - _Requirements: 3.4, 3.5, 3.7_

- [~] 6. AI_Engine module
  - Create `js/ai-engine.js` implementing `AIEngine.evaluate()`, `getDailyExerciseTip()`, and `getDailyDietTip()` with threshold constants (steps < 8000, water < 2.0, sleep < 7.0, calories > 2500)
  - Render all suggestions in the recommendations card in `#tracker` section
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [~] 6.1 Write property test for AI threshold suggestions (Property 7)
    - **Property 7: AI threshold suggestions fire correctly**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [~] 6.2 Write property test for AI tips always non-empty (Property 8)
    - **Property 8: AI tips are always non-empty**
    - **Validates: Requirements 4.5, 4.6**

- [~] 7. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [~] 8. Wellness_Module
  - Create `js/wellness.js` implementing `WellnessModule.selectMood()`, `getDailyQuote()`, `sendChatMessage()`, and `getChatHistory()`
  - Add `#wellness` section to `index.html` with mood selector buttons (Happy, Calm, Sad, Stressed, Anxious), motivational quote display, and chatbot UI (text input, send button, conversation history)
  - Implement keyword → response map with default fallback; ensure response is returned within 500ms
  - Seed quote pool with at least 10 quotes; display a new quote on each page load
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [~] 8.1 Write property test for mood persisted with timestamp (Property 9)
    - **Property 9: Mood selection is persisted with a date timestamp**
    - **Validates: Requirements 5.2**

  - [~] 8.2 Write property test for mood quote contextual (Property 10)
    - **Property 10: Mood quote is non-empty and contextual**
    - **Validates: Requirements 5.3**

  - [~] 8.3 Write property test for chatbot always responds (Property 11)
    - **Property 11: Chatbot always responds with a non-empty message**
    - **Validates: Requirements 5.6, 5.7**

  - [~] 8.4 Write property test for chat history grows monotonically (Property 12)
    - **Property 12: Chat history grows monotonically**
    - **Validates: Requirements 5.8**

  - [~] 8.5 Write unit tests for Wellness_Module
    - Test each defined chatbot keyword returns a non-default response
    - Test quote pool contains ≥ 10 entries
    - _Requirements: 5.4, 5.6_

- [~] 9. Daily_Planner module
  - Create `js/daily-planner.js` implementing `DailyPlanner.addTask()`, `toggleTask()`, `deleteTask()`, `getTasks()`, and `getProgress()`
  - Add `#planner` section to `index.html` with task input field, "Add Task" button, task list with checkboxes and delete buttons, and progress indicator
  - Validate non-empty input; display inline error for empty/whitespace-only input
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [~] 9.1 Write property test for task addition round-trip (Property 13)
    - **Property 13: Task addition round-trip**
    - **Validates: Requirements 6.2**

  - [~] 9.2 Write property test for empty task rejected (Property 14)
    - **Property 14: Empty task is rejected and not persisted**
    - **Validates: Requirements 6.3**

  - [~] 9.3 Write property test for task toggle involution (Property 15)
    - **Property 15: Task toggle is an involution**
    - **Validates: Requirements 6.5**

  - [~] 9.4 Write property test for task deletion removes from Storage (Property 16)
    - **Property 16: Task deletion removes from Storage**
    - **Validates: Requirements 6.6**

  - [~] 9.5 Write property test for progress ratio accurate (Property 17)
    - **Property 17: Progress ratio is accurate**
    - **Validates: Requirements 6.7**

- [~] 10. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [~] 11. State restoration and integration wiring
  - Implement on-load initialization: read all Storage keys and restore Health_Tracker history, mood entries, tasks, and session into each module's in-memory state
  - Wire Auth_UI session check to gate access to tracker, wellness, and planner sections
  - Verify responsive layout renders correctly at 320px, 768px, and 1280px (no horizontal overflow)
  - _Requirements: 2.5, 7.4, 9.2_

  - [~] 11.1 Write property test for state restored on re-initialization (Property 19)
    - **Property 19: State is restored on module re-initialization**
    - **Validates: Requirements 9.2**

  - [~] 11.2 Write unit tests for integration
    - Test full submit-entry flow: Storage write + chart update + AI card render all fire together
    - _Requirements: 3.5, 3.7_

- [~] 12. Final checkpoint — Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with a minimum of 100 iterations per test
- Unit tests use Vitest with jsdom for DOM assertions
- All modules call `Storage.isAvailable()` on init and skip writes (not crashes) if unavailable
