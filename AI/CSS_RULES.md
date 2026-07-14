# CSS RULES

## Purpose

This document defines all rules for editing CSS files.

These rules apply to:

- style.css
- any future CSS files

---

# PRIMARY GOAL

The website must remain visually identical.

Refactoring is allowed.

Redesign is forbidden.

---

# BEFORE EDITING

Always read the entire CSS file.

Understand:

- selector hierarchy
- specificity
- responsive rules
- animations
- transitions

Never edit blindly.

---

# ALLOWED

You MAY:

- Improve formatting.
- Fix indentation.
- Remove unnecessary blank lines.
- Add CSS comments.
- Group related selectors.
- Sort properties inside a selector only if it does not change behavior.
- Remove true duplicate declarations.
- Move CSS into better logical sections.
- Improve readability.

---

# NOT ALLOWED

Never:

Redesign.

Rewrite.

Modernize.

Simplify visual appearance.

Change architecture.

---

# VISUAL STYLE

Never change:

Colors.

Backgrounds.

Borders.

Border radius.

Box shadows.

Opacity.

Gradients.

Typography.

Letter spacing.

Line height.

Spacing.

Sizing.

Width.

Height.

Max width.

Min width.

Padding.

Margin.

Gap.

Display.

Position.

Z-index.

Overflow.

Visibility.

Unless explicitly requested.

---

# RESPONSIVE

Never change:

Breakpoints.

Media queries.

Responsive behavior.

Desktop layout.

Tablet layout.

Mobile layout.

---

# ANIMATIONS

Never change:

Animation names.

Animation duration.

Animation delay.

Animation timing.

Animation direction.

Animation fill mode.

Transition duration.

Transition timing.

Hover effects.

Focus effects.

Active effects.

---

# SELECTORS

Never:

Rename selectors.

Merge selectors.

Split selectors.

Increase specificity.

Decrease specificity.

Remove selectors.

Change selector hierarchy.

---

# VARIABLES

If CSS variables already exist:

Never rename them.

Never remove them.

Never change values.

If variables do not exist:

Do not introduce them unless explicitly requested.

---

# COMMENTS

Allowed.

Use only simple comments.

Example:

/* BANNER */

/* ABOUT */

/* PRODUCTS */

/* CONTACT */

Avoid decorative separators.

---

# ORDER

Maintain logical order.

Group similar selectors together.

Keep responsive rules close to the related section whenever possible.

Do not reorder if it changes cascade behavior.

---

# DUPLICATED CSS

Remove duplicate declarations only when:

They are truly identical.

Removing them has zero visual impact.

Otherwise keep them.

---

# AFTER EDITING

Verify:

No selector renamed.

No visual changes.

No spacing changes.

No typography changes.

No animation changes.

No responsive changes.

No layout changes.

Desktop identical.

Tablet identical.

Mobile identical.

---

# STOP CONDITIONS

Stop immediately if:

Specificity may change.

Cascade behavior may change.

Responsive behavior may change.

Visual appearance may change.

Animation may change.

Explain the risk.

Wait for instructions.

---

# CSS PHILOSOPHY

Readable CSS is important.

Stable CSS is more important.

The existing design is the source of truth.

Never sacrifice visual consistency for cleaner code.