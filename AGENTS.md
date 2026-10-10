# 🌿 AGENTS.md — Engineering Rules & Anti-Hallucination Protocol for TOUCH GRASS

## 1. Project Principles

1. **Independent Architecture**: TOUCH GRASS is built as a clean, stand-alone React TypeScript application.
2. **Strict Scope Control**: Implement only the features specified for the current milestone. Do not inject mock APIs, credentials, or unverified third-party services ahead of time.
3. **TypeScript Strictness**: Strictly typed components with explicit prop interfaces. Avoid `any`.
4. **Visual Consistency**: Adhere to `variables.css` design tokens and pixel-art rendering rules across all pages.
5. **Quality Gate**: Before concluding any milestone:
   - Run unit tests (`npm test`)
   - Verify TypeScript compilation (`npx tsc --noEmit`)
   - Build production assets (`npm run build`)

---

## 2. Anti-Hallucination & Execution Protocol

Every AI agent and developer working on TOUCH GRASS must adhere strictly to this 10-step protocol:

1. **Inspect before modifying**: Inspect relevant existing files in the repository before making edits.
2. **Read documentation**: Review relevant architectural documents (`docs/ARCHITECTURE.md`, `docs/CURRENT_STATE.md`, etc.).
3. **Verify feature existence**: Confirm whether a requested feature already exists before starting implementation.
4. **Explicit feature status labeling**: Clearly distinguish between **Implemented**, **Planned**, **Mocked**, **Partially Implemented**, and **Unverified** functionality.
5. **No false artifacts or invented claims**: Never invent API responses, backend credentials, fictitious image paths, mock endpoints, or false test results.
6. **Mandatory verification after changes**: Run `npm test`, `npx tsc --noEmit`, and `npm run build` after editing code.
7. **Transparent reporting**: Report exact execution commands, empirical outputs, modified files, and remaining limitations.
8. **Documentation synchronization**: Update [`docs/CURRENT_STATE.md`](file:///d:/TouchGrass/docs/CURRENT_STATE.md) and relevant specifications whenever meaningful changes occur.
9. **Clarify ambiguities**: Stop and ask the user for guidance whenever a product feature or design choice is ambiguous.
10. **Milestone boundary enforcement**: Restrict all edits strictly to the scope of the assigned milestone. Do not proceed to future milestone tasks prematurely.
