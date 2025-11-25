# Design Principles & Style Guide

**Last Updated:** November 21, 2024
**Status:** ✅ Active Guidelines

---

## Core Design Principles

### 1. Never Use Emojis

**Rule:** We NEVER use emoji icons in production code. Always use Font Awesome or similar icon libraries.

**Why:**
- **Consistency:** Emojis render differently across platforms (iOS, Android, Windows, browsers)
- **Professionalism:** Icon libraries provide cohesive, professional design language
- **Accessibility:** Font Awesome icons have better screen reader support and ARIA attributes
- **Customization:** Icon libraries allow color, size, and animation control
- **React-like Style:** Modern web apps use icon libraries, not emojis

**Examples:**

❌ **WRONG:**
```html
<h1>🛡️ Are You Overpaying?</h1>
<div class="upload-icon">📄</div>
<div class="verdict-icon">⚠️</div>
```

✅ **CORRECT:**
```html
<h1><i class="fas fa-shield-halved"></i> Are You Overpaying?</h1>
<div class="upload-icon"><i class="fas fa-file-medical"></i></div>
<div class="verdict-icon"><i class="fas fa-triangle-exclamation"></i></div>
```

**Font Awesome Icon Replacements:**

| Emoji | Font Awesome Replacement | Class |
|-------|-------------------------|-------|
| 🛡️ | Shield (halved) | `fa-shield-halved` |
| 📄 | Medical File | `fa-file-medical` |
| ⚠️ | Triangle Exclamation | `fa-triangle-exclamation` |
| ✅ | Circle Check | `fa-circle-check` |
| 🏥 | Hospital | `fa-hospital` |
| 🤝 | Handshake | `fa-handshake` |
| ⚖️ | Scale Balanced | `fa-scale-balanced` |
| 💰 | Money Bill | `fa-money-bill-wave` |
| 🔍 | Magnifying Glass | `fa-magnifying-glass` |
| 📊 | Chart Line | `fa-chart-line` |
| 📈 | Chart Trending Up | `fa-chart-line` |
| 💡 | Light Bulb | `fa-lightbulb` |
| 🎯 | Target | `fa-bullseye` |
| 🚀 | Rocket | `fa-rocket` |
| ⭐ | Star | `fa-star` |
| 📱 | Mobile | `fa-mobile-screen` |
| 💻 | Laptop | `fa-laptop` |
| 🌐 | Globe | `fa-globe` |

**Reference:** [Font Awesome Icon Gallery](https://fontawesome.com/icons)

---

### 2. Always Search for Modern React-like Icons

**Rule:** Before implementing any icon, search Font Awesome first. If not found, check other modern icon libraries.

**Icon Libraries Priority:**
1. **Font Awesome** (primary) - [fontawesome.com](https://fontawesome.com)
2. **Heroicons** (secondary) - [heroicons.com](https://heroicons.com)
3. **Lucide** (tertiary) - [lucide.dev](https://lucide.dev)

**Search Process:**
1. Identify the concept (e.g., "protection", "medical", "warning")
2. Search Font Awesome gallery: https://fontawesome.com/search?o=r&m=free
3. Try multiple keywords (e.g., "shield" → "protection" → "security")
4. Pick the icon that best represents the concept visually
5. Test at different sizes to ensure clarity

**Example Search:**
```
Need: "Bill protection" icon

Search attempts:
1. "bill" → fa-file-invoice ✓
2. "protection" → fa-shield ✓
3. "shield" → fa-shield-halved ✓ (chosen - more interesting)

Selected: fa-shield-halved
```

---

### 3. Payerset Brand Colors

**Rule:** Always use Payerset blue (#0092CA) as the primary brand color throughout the site.

**Color Palette:**
```css
:root {
    /* Primary Brand */
    --payerset-blue: #0092CA;
    --payerset-blue-light: #33A9D6;
    --payerset-blue-dark: #006B96;
    --payerset-blue-soft: rgba(0, 146, 202, 0.1);

    /* Semantic Colors */
    --success-green: #10B981;
    --warning-orange: #F59E0B;
    --danger-red: #EF4444;

    /* Neutral Palette */
    --gray-50: #F9FAFB;
    --gray-100: #F3F4F6;
    --gray-200: #E5E7EB;
    --gray-600: #4B5563;
    --gray-900: #111827;
    --white: #FFFFFF;
}
```

**Usage:**
- **Primary Actions:** Payerset blue (`--payerset-blue`)
- **Links & Accents:** Payerset blue light (`--payerset-blue-light`)
- **Backgrounds:** Payerset blue soft (`--payerset-blue-soft`)
- **Success States:** Green (`--success-green`)
- **Warnings:** Orange (`--warning-orange`)
- **Errors/Overcharges:** Red (`--danger-red`)

---

### 4. Scroll-Snap Pattern (from timeline.html)

**Rule:** When creating full-screen presentation experiences, always use the container-based scroll-snap pattern.

**The Pattern That Works:**
```html
<body>
    <div class="presentation-app">
        <section class="presentation-slide">Content 1</section>
        <section class="presentation-slide">Content 2</section>
    </div>
</body>
```

```css
body {
    overflow: hidden;
}

.presentation-app {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
    scroll-behavior: smooth;
}

.presentation-slide {
    min-height: 100vh;
    scroll-snap-align: start;
}
```

**Reference:** [DEVLOG/scroll-snap-pattern.md](scroll-snap-pattern.md)

---

### 5. Glossary Tooltips (from timeline.html)

**Rule:** When displaying healthcare jargon, wrap terms in GlossaryTerm component for hover definitions.

**Pattern:**
```javascript
const processGlossaryTerms = (text) => {
    // Returns array of strings and <GlossaryTerm> components
    // Automatically detects and wraps terms like "CAA", "TPA", "PBM"
};

// Usage in components:
<div className="slide-title">
    {processGlossaryTerms(data.title)}
</div>
```

**Reference:** [DEVLOG/glossary-tooltip-system.md](glossary-tooltip-system.md)

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             Oxygen, Ubuntu, Cantarell, sans-serif;
```

**Why:** System fonts for performance and native feel

### Sizing Scale (clamp for responsive)
```css
h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }
p  { font-size: clamp(1.125rem, 2vw, 1.25rem); }
```

**Why:** Fluid typography that scales smoothly across devices

### Weights
- **800:** Hero headlines, big numbers
- **700:** Section titles, strong emphasis
- **600:** Subtitles, labels
- **400:** Body text

---

## Layout & Spacing

### Grid System
Use CSS Grid for card layouts:
```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}
```

### Spacing Scale (8px base unit)
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
```

### Border Radius
- **Small elements:** 8-12px
- **Cards:** 16-24px
- **Large sections:** 24-32px

**Why:** Soft, approachable aesthetic

---

## Animation & Transitions

### Standard Transitions
```css
transition: all 0.2s ease;  /* Buttons, links */
transition: all 0.3s ease;  /* Cards, modals */
```

### Fade-In on Scroll
```javascript
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
```

### Button Hover Effects
```css
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}
```

---

## Component Patterns

### Cards
```css
.card {
    background: var(--white);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
```

### Buttons
```css
.btn {
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
}

.btn-primary {
    background: var(--payerset-blue);
    color: var(--white);
}
```

### Alerts
```css
.alert {
    padding: 1.5rem;
    border-radius: 12px;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.alert-info {
    background: var(--patient-light);
    border: 1px solid var(--patient-primary);
}
```

---

## Accessibility

### Color Contrast
- **Text on white:** Minimum #4B5563 (gray-600) for WCAG AA
- **Important text:** #111827 (gray-900)
- **Links:** Underline or sufficient contrast (4.5:1 ratio)

### Focus States
```css
*:focus {
    outline: 2px solid var(--payerset-blue);
    outline-offset: 2px;
}
```

### Screen Reader Text
```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

---

## Mobile-First Responsive

### Breakpoints
```css
/* Mobile: < 768px (default) */
/* Tablet: 768px - 1024px */
@media (min-width: 768px) { }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { }
```

### Touch Targets
**Minimum size:** 44px × 44px for all interactive elements

---

## Performance

### Load Order
1. Critical CSS (inline or in `<head>`)
2. HTML structure
3. Fonts (async/swap)
4. JavaScript (defer)
5. Icons (CDN with integrity hash)

### CSS Structure
```html
<style>
    /* 1. CSS Reset */
    /* 2. CSS Variables */
    /* 3. Base Styles */
    /* 4. Layout */
    /* 5. Components */
    /* 6. Utilities */
    /* 7. Media Queries */
</style>
```

---

## File Organization

### Single-File Prototypes
For experiments (like 2025-11 folder):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Page Title</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        /* All CSS here */
    </style>
</head>
<body>
    <!-- All HTML here -->
    <script>
        // All JavaScript here
    </script>
</body>
</html>
```

**Why:** Zero dependencies, instant deployment, easy to share

### Production Structure
```
src/
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   └── Alert.jsx
├── styles/
│   ├── variables.css
│   ├── base.css
│   └── components.css
├── utils/
│   └── icons.js
└── pages/
    └── bill-checker.jsx
```

---

## Documentation

### Code Comments
```javascript
// Component: GlossaryTerm
// Purpose: Subtle hover tooltip for healthcare terms
// Status: ✅ Production Ready

const GlossaryTerm = ({ term, definition, children }) => {
    // Implementation
};
```

### File Headers
```javascript
//================================================
// Healthcare Transparency Timeline Presentation
// React-based scroll presentation
//================================================
```

---

## Testing Checklist

Before deploying any new page:

- [ ] All emojis replaced with Font Awesome icons
- [ ] Payerset blue used for primary brand elements
- [ ] Responsive on mobile (test at 375px, 768px, 1024px)
- [ ] Touch targets minimum 44px × 44px
- [ ] Color contrast meets WCAG AA (4.5:1 ratio)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] No console errors or warnings
- [ ] Links open correctly (internal vs. external)
- [ ] Forms validate properly
- [ ] Loading states show for async actions

---

## Examples in Codebase

### ✅ Good Examples
- [timeline.html](../timeline.html) - Scroll-snap pattern, glossary tooltips
- [2025-11/index.html](../2025-11/index.html) - Clean presentation, Payerset branding
- [2025-11/bill-checker.html](../2025-11/bill-checker.html) - Font Awesome icons, patient-focused UX
- [experiments/patients/search.html](../experiments/patients/search.html) - Search UI patterns

### 📚 Reference Documents
- [scroll-snap-pattern.md](scroll-snap-pattern.md) - Scroll-snap technical guide
- [glossary-tooltip-system.md](glossary-tooltip-system.md) - Tooltip implementation
- [2024-11-20-session-summary.md](2024-11-20-session-summary.md) - Development history

---

## Quick Reference: Icon Search Flow

```
1. Identify concept → "medical bill"
2. Search Font Awesome → "file medical" or "invoice"
3. Preview icon → fa-file-medical
4. Implement → <i class="fas fa-file-medical"></i>
5. Test sizes → font-size: 1.5rem, 2rem, 3rem
6. ✅ Done
```

**Never:**
- Use emojis (❌)
- Mix icon libraries in same project (❌)
- Use icon without testing at target size (❌)

**Always:**
- Search Font Awesome first (✅)
- Use semantic icon names (✅)
- Test on multiple devices (✅)

---

**Last Review:** November 21, 2024
**Next Review:** When adding major new features
**Status:** ✅ Active and enforced across all new development
