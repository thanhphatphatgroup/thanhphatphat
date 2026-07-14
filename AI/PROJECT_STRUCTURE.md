# PROJECT STRUCTURE

## Project Root

The project is organized as a simple static website.

Main directory:

/
│
├── AI/
├── icons/
├── images/
├── products/
│
├── index.html
├── style.css
├── script.js
│
├── robots.txt
├── sitemap.xml
│
├── update-gallery.py
└── update-gallery.bat

---

# AI Folder

Purpose:

Contains documentation and rules for AI.

AI must always read these files before editing code.

Files:

AI_RULES.md

PROJECT_CONTEXT.md

PROJECT_STRUCTURE.md

HTML_RULES.md

CSS_RULES.md

JS_RULES.md

CODING_STYLE.md

CHANGELOG.md

TODO.md

---

# index.html

Purpose:

Main homepage.

Responsibilities:

- Website structure
- Company information
- Product sections
- Contact section
- Load style.css
- Load script.js

Rules:

Do not redesign.

Do not change layout.

Do not change HTML structure unless requested.

---

# style.css

Purpose:

Controls every visual element.

Includes:

Typography

Spacing

Colors

Responsive

Animation

Slider style

Buttons

Rules:

Never change appearance unless requested.

Only reorganize when refactoring.

---

# script.js

Purpose:

Controls website behavior.

Includes:

Reveal animation

Smooth scroll

Slider

Image zoom

Drag

Touch support

Back to top button

Rules:

Never change behavior unless requested.

---

# images/

Purpose:

Store all website images.

Contains:

Banner

Founder

Partner

Contact

Products

Rules:

Never rename files.

Never change paths.

Never move images unless requested.

---

# products/

Purpose:

Contains product-related pages.

Each page follows the same visual style.

Rules:

Maintain consistency.

---

# icons/

Purpose:

Store icons used by the website.

Rules:

Do not rename.

Do not replace.

---

# robots.txt

Purpose:

SEO.

Rules:

Modify only when requested.

---

# sitemap.xml

Purpose:

SEO.

Rules:

Modify only when requested.

---

# update-gallery.py

Purpose:

Automatically generate gallery.json files.

Rules:

Do not modify unless requested.

---

# update-gallery.bat

Purpose:

Runs update-gallery.py.

Rules:

Do not modify unless requested.

---

# Editing Strategy

Before editing any file:

Understand its purpose.

Understand how it connects to the project.

Only modify the requested file.

Never modify unrelated files.

---

# Refactoring Strategy

Allowed:

Improve readability.

Improve organization.

Improve formatting.

Add comments.

Group related code.

Remove real duplicate code.

Not Allowed:

Change appearance.

Change behavior.

Change structure.

Change project architecture.

---

# Project Priority

Priority 1

Keep website identical.

Priority 2

Keep functionality identical.

Priority 3

Improve readability.

Priority 4

Improve maintainability.

Priority 5

Optimize only when requested.