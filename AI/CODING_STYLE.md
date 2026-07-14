# CODING STYLE

## Purpose

This document defines the coding style for this project.

It does NOT define functionality.

It only defines how the code should look.

Every file must follow the same style.

---

# GENERAL STYLE

Write clean code.

Write readable code.

Write consistent code.

Never write code only because it is shorter.

Readability is always more important.

---

# INDENTATION

Use 4 spaces.

Never mix tabs and spaces.

Keep indentation consistent throughout the file.

---

# LINE BREAKS

Use one blank line between logical blocks.

Do not add unnecessary blank lines.

Do not leave trailing whitespace.

---

# COMMENTS

Use short comments.

Use uppercase.

Examples:

<!-- BANNER -->

<!-- ABOUT -->

<!-- PRODUCTS -->

<!-- CONTACT -->

CSS:

/* BANNER */

/* PRODUCTS */

JavaScript:

// BANNER

// PRODUCTS

Avoid decorative comments.

Never use:

=====================

*********************

#####################

---

# HTML STYLE

Group related elements together.

Keep nesting clean.

Align closing tags correctly.

Do not over-indent.

Keep attributes readable.

When an element has many attributes,
place each attribute on a new line only if readability improves.

---

# CSS STYLE

Group selectors by section.

Keep properties in a logical order.

Example order:

Position

Display

Box Model

Typography

Visual

Animation

Misc

Use consistent spacing.

Do not align properties with extra spaces.

---

# JAVASCRIPT STYLE

Group related functions.

Keep related variables together.

Separate logical blocks with comments.

Keep event listeners close to the feature they belong to.

Avoid unnecessary nesting.

Avoid unnecessary empty lines.

---

# NAMING

Never rename existing:

Classes

IDs

Functions

Variables

Files

Folders

Unless explicitly instructed.

---

# ORDER

Try to keep this order.

HTML

↓

CSS

↓

JavaScript

Inside each file:

Imports

↓

Constants

↓

Variables

↓

Functions

↓

Event Listeners

↓

Initialization

---

# READABILITY

Prioritize readability over clever code.

Avoid unnecessary complexity.

Keep code easy to scan.

Keep similar code together.

---

# FILE ORGANIZATION

Large files should be divided into logical sections.

Each section should begin with a simple comment.

Example:

<!-- PRODUCTS -->

or

/* PRODUCTS */

or

// PRODUCTS

---

# DUPLICATED CODE

Do not remove duplicate code unless:

It is truly duplicated.

It is unused.

It is safe to remove.

Otherwise keep it.

---

# FINAL CHECK

Before finishing:

Check indentation.

Check comments.

Check formatting.

Check readability.

Ensure consistency across the entire file.

---

# CODING PHILOSOPHY

Consistency is more important than perfection.

Readable code is better than clever code.

The project should always look like it was written by one developer.