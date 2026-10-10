# 🌿 TOUCH GRASS — Testing & Quality Strategy

> **Testing Protocols, Verification Commands, and Quality Gate Criteria**

---

## 1. Test Architecture

TOUCH GRASS employs a multi-layered testing strategy to guarantee code reliability and visual accessibility.

- **Unit & Component Testing**: Vitest + `@testing-library/react` + JSDOM (`13 tests passing`).
- **TypeScript Static Verification**: `npx tsc --noEmit` (Strict Mode).
- **Production Asset Build Verification**: `npm run build`.

---

## 2. Test Commands & Quality Gate

Run all quality gate checks before pushing code or concluding a milestone:

```bash
# 1. Run unit & component tests
npm test

# 2. Check TypeScript types strictly
npx tsc --noEmit

# 3. Verify production bundle build
npm run build
```

---

## 3. Test Suites & Coverage

### 1. Navigation & Foundation Suite (`src/test/AppNavigation.test.tsx`)
- Verifies brand title rendering.
- Verifies presence of desktop and mobile bottom navigation links for all 4 sections.
- Verifies SVG mascot spirit accessibility role (`role="img"`).
- Verifies `<PixelButton>` CSS variant class output.

### 2. AI Friend Engine Suite (`src/test/AIFriendEngine.test.tsx`)
- Verifies `MockAIProvider` response generation, cancellation tokens, and error injection.
- Verifies `VoiceService` fallback handling when Speech API is unsupported.
- Verifies `AudioEngine` scene selection, volume adjustment, and mute toggling.
- Verifies `FriendChatPanel` name customization and `localStorage` persistence (`touch_grass_friend_name`).
- Verifies empty-message input validation and send action.
- Verifies `GuidedNatureSession` state machine transitions (`idle` &rarr; `playing` &rarr; `paused` &rarr; `completed`).
- Verifies resource cleanup on unmount/cancellation.
