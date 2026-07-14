# HTML RULES

## Purpose

This file defines all rules for editing HTML files in this project.

These rules apply to:

- index.html
- all HTML files inside the products folder

---

# PRIMARY GOAL

Keep the rendered website 100% identical.

Improve code organization only.

Never redesign.

---

# BEFORE EDITING

Always read the entire HTML file.

Understand the current structure.

Understand how CSS and JavaScript reference the HTML.

Never edit blindly.

---

# ALLOWED

You MAY:

- Fix indentation.
- Remove unnecessary blank lines.
- Improve formatting.
- Add HTML comments.
- Group related code together.
- Reorder code only when the rendered result remains identical.
- Remove real duplicate HTML only when it has zero functional impact.

---

# NOT ALLOWED

Never:

- Change HTML structure.
- Change DOM hierarchy.
- Add new HTML elements.
- Remove existing HTML elements.
- Add new wrappers.
- Add new containers.
- Add new sections.
- Add new divs.
- Add new articles.
- Add new figures.
- Add new headers.
- Add new footers.
- Add new navigation blocks.

---

# CLASSES

Never:

Rename classes.

Remove classes.

Add classes.

Merge classes.

Split classes.

Reorder classes unless absolutely necessary.

---

# IDS

Never:

Rename ids.

Remove ids.

Add ids.

Duplicate ids.

---

# CONTENT

Never change:

Text.

Titles.

Descriptions.

Company information.

Phone numbers.

Email.

Address.

Links.

SEO content.

Meta information.

Unless explicitly requested.

---

# IMAGES

Never:

Rename image files.

Move images.

Change image paths.

Change image extensions.

Replace images.

---

# LINKS

Never modify:

href

src

target

rel

Unless explicitly instructed.

---

# JAVASCRIPT

Never change HTML used by JavaScript.

Do not modify:

data-folder

data-*

onclick

id

class

Selectors used by JavaScript.

---

# CSS

Never change HTML that CSS depends on.

Preserve:

class names

id names

element order

selector relationships

---

# COMMENTS

Allowed.

Use only simple comments.

Correct:

<!-- BANNER -->

<!-- ABOUT -->

<!-- PRODUCTS -->

<!-- CONTACT -->

Never use decorative separators.

---

# SEMANTIC TAGS

Never replace:

section

div

main

header

footer

article

figure

aside

Unless explicitly requested.

---

# FORMATTING

Allowed:

Consistent indentation.

Consistent spacing.

Consistent blank lines.

Readable formatting.

Nothing else.

---

# DUPLICATED HTML

Remove duplicated HTML only when:

It is truly duplicated.

It is unused.

It has zero impact.

Otherwise keep it.

---

# AFTER EDITING

Always verify:

Classes unchanged.

IDs unchanged.

Links unchanged.

Image paths unchanged.

Script references unchanged.

CSS references unchanged.

DOM unchanged.

Visual output unchanged.

---

# STOP CONDITIONS

Stop immediately if editing may affect:

Layout.

Responsive.

Animation.

Slider.

JavaScript.

SEO.

Accessibility.

Explain the risk.

Wait for instructions.

---

# HTML PHILOSOPHY

Readable HTML is important.

Stable HTML is more important.

The original HTML is always the source of truth.