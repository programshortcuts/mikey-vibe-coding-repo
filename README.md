# Technical Debt

A running list of known quirks, workarounds, and areas to revisit when time allows.

---

## TD-001: Sidebar Hiding Quirk

* **Location**: `playPauseVideos-colorCode.js` → `togglePlayVidSize`
* **Description**: Enlarging videos inadvertently toggles the sidebar’s `.deactive` class, hiding it in non-`step`/`step-float` contexts.
* **Current Behavior**: This behavior enhances video focus but also causes an unintended sidebar hide when interacting with `<video>` elements outside core steps.
* **Temporary Workaround**: Retain current functionality until core features are shipped.
* **Future Action**:

  1. Scope sidebar toggling by checking `element.closest('.step, .step-float')` before applying classes.
  2. Refactor `toggleImg` and `togglePlayVidSize` to separate video enlargement from sidebar logic.
  3. Write tests or manual reproduction steps to validate fixes.
* **Date Logged**: 2025-05-15

---

## How to Add New Technical Debt Items

Use the template below to log future debts. Replace placeholders with relevant details:

### TD-XXX: Short Title Here

* **Location**: `path/to/file.js` → `functionName`
* **Description**: Briefly describe the issue and conditions under which it occurs.
* **Current Behavior**: Explain how it behaves now, including any side effects.
* **Temporary Workaround**: Note how you’re working around the issue today.
* **Future Action**:

  1. Step one to resolve.
  2. Step two.
  3. etc.
* **Date Logged**: YYYY-MM-DD

---

> *Keep this file updated* as your codebase evolves. Tracking technical debt helps you prioritize refactors and ensures you don’t lose sight of known quirks.
