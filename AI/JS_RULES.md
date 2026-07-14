# JAVASCRIPT RULES

## Purpose

This document defines all rules for editing JavaScript files.

These rules apply to:

- script.js
- all future JavaScript files

---

# PRIMARY GOAL

Keep every existing feature working exactly the same.

Refactor the code.

Do NOT change functionality.

---

# BEFORE EDITING

Always read the entire JavaScript file.

Understand:

- Event flow
- DOM interactions
- Function dependencies
- Variables
- Constants
- Existing logic

Never modify code before understanding it.

---

# ALLOWED

You MAY:

- Improve formatting.
- Fix indentation.
- Remove unnecessary blank lines.
- Add comments.
- Group related functions.
- Move functions into better logical sections.
- Improve readability.
- Rename local variables ONLY if explicitly requested.

---

# NOT ALLOWED

Never:

Rewrite the file.

Replace existing logic.

Modernize code.

Introduce frameworks.

Convert to TypeScript.

Split into modules.

Create new files.

Delete existing features.

---

# EVENTS

Never change:

click

touchstart

touchmove

touchend

mousedown

mousemove

mouseup

scroll

resize

DOMContentLoaded

load

Unless explicitly instructed.

---

# DOM

Never change:

Selectors.

class names.

id names.

data-* attributes.

HTML structure.

Element hierarchy.

Element relationships.

---

# FEATURES

Never change the behavior of:

Reveal animation.

Smooth scrolling.

Back To Top button.

Product slider.

Image zoom.

Desktop drag.

Mobile swipe.

Lazy loading.

IntersectionObserver.

requestAnimationFrame.

Image loading.

Navigation.

---

# ANIMATION

Never change:

Animation timing.

Transition timing.

Scrolling behavior.

Dragging behavior.

Swipe behavior.

Momentum.

Threshold values.

Unless explicitly requested.

---

# IMAGE LOADING

Never modify:

Folder names.

Image paths.

Image filenames.

Image format detection.

Loading sequence.

Lazy loading behavior.

Observer behavior.

---

# PERFORMANCE

Do not optimize unless explicitly requested.

Do not replace algorithms.

Do not introduce caching.

Do not rewrite loading logic.

---

# COMMENTS

Allowed.

Use simple comments only.

Example:

// SCROLL

// SLIDER

// ZOOM

// CONTACT

Avoid decorative separators.

---

# VARIABLES

Never rename:

Global variables.

Shared variables.

DOM references.

Configuration variables.

Unless explicitly instructed.

---

# FUNCTIONS

Never:

Rename public functions.

Remove functions.

Merge functions.

Split functions.

Change execution order.

Unless explicitly instructed.

---

# DEPENDENCIES

Never break dependencies between:

HTML

CSS

JavaScript

Keep every selector compatible.

---

# AFTER EDITING

Verify:

All features still work.

Slider works.

Zoom works.

Lazy loading works.

Animations work.

Scroll works.

Buttons work.

Touch works.

Desktop drag works.

No console errors.

---

# STOP CONDITIONS

Stop immediately if editing may affect:

Existing functionality.

Event flow.

Animation.

Performance.

DOM interaction.

User interaction.

Explain the risk.

Wait for further instructions.

---

# JAVASCRIPT PHILOSOPHY

Readable JavaScript is important.

Stable functionality is more important.

The current behavior is always the source of truth.

Never sacrifice stability for cleaner code.