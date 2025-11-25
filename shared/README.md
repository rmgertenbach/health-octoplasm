# Shared Design System - Payerset Healthcare Transparency Platform

This directory contains the unified design system for the Payerset platform, implementing Phase 1 of PLAN3.md.

## Structure

```
shared/
├── css/
│   ├── core.css          # Design tokens, reset, typography, utilities
│   └── components.css    # Reusable UI components (buttons, cards, etc.)
├── js/
│   └── component-loader.js  # Dynamically loads header/footer
├── components/
│   ├── header.html       # Unified site header with navigation
│   └── footer.html       # Unified site footer
├── templates/
│   └── page-template.html  # Example page template
└── data/
    └── (future: cpt-codes.json, pricing data, etc.)
```

## Usage

### 1. Include Shared Styles in Your Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title | Payerset</title>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Shared Styles -->
    <link rel="stylesheet" href="/shared/css/core.css">
    <link rel="stylesheet" href="/shared/css/components.css">
</head>
```

### 2. Add Header and Footer Placeholders

```html
<body>
    <!-- Header Placeholder -->
    <div id="header-placeholder"></div>

    <!-- Your Main Content -->
    <main class="main-content">
        <div class="container">
            <h1>Your Content Here</h1>
        </div>
    </main>

    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>

    <!-- Component Loader -->
    <script src="/shared/js/component-loader.js"></script>
</body>
```

### 3. Use Design System Components

#### Buttons
```html
<button class="btn btn-primary">
    <i class="fas fa-rocket"></i>
    Get Started
</button>

<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-danger">Delete</button>
```

#### Cards
```html
<div class="card">
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
</div>
```

#### Alerts
```html
<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Info:</strong> This is an informational message.
    </div>
</div>
```

#### Badges
```html
<span class="badge badge-success">
    <i class="fas fa-check"></i>
    Success
</span>
```

#### Form Elements
```html
<div class="form-group">
    <label class="form-label" for="name">Name</label>
    <input type="text" id="name" class="form-input" placeholder="Enter your name">
    <span class="form-hint">This is a helpful hint.</span>
</div>
```

#### Progress Indicators
```html
<div class="step-indicator">
    <div class="step-item completed">
        <div class="step-number">1</div>
        <div class="step-label">Step One</div>
    </div>
    <div class="step-item active">
        <div class="step-number">2</div>
        <div class="step-label">Step Two</div>
    </div>
    <div class="step-item">
        <div class="step-number">3</div>
        <div class="step-label">Step Three</div>
    </div>
</div>
```

## Design Tokens

All design tokens are CSS custom properties defined in `core.css`:

### Colors
- `--payerset-blue`: #0092CA (primary brand color)
- `--payerset-blue-light`: #33A9D6
- `--payerset-blue-dark`: #006B96
- `--success-green`: #10B981
- `--warning-orange`: #F59E0B
- `--danger-red`: #EF4444
- `--gray-50` through `--gray-900`: Neutral grays

### Spacing
- `--space-xs`: 8px
- `--space-sm`: 16px
- `--space-md`: 24px
- `--space-lg`: 32px
- `--space-xl`: 48px
- `--space-2xl`: 64px

### Border Radius
- `--radius-sm`: 8px
- `--radius-md`: 12px
- `--radius-lg`: 16px
- `--radius-xl`: 24px
- `--radius-pill`: 100px

### Shadows
- `--shadow-sm`: Subtle shadow
- `--shadow-md`: Medium shadow
- `--shadow-lg`: Large shadow
- `--shadow-xl`: Extra large shadow

### Transitions
- `--transition-fast`: 0.2s ease
- `--transition-normal`: 0.3s ease

## Utility Classes

### Layout
- `.container`: Max-width container with padding
- `.main-content`: Main content area with min-height

### Flexbox
- `.d-flex`: Display flex
- `.align-center`: Align items center
- `.justify-center`: Justify content center
- `.justify-between`: Space between
- `.gap-sm`, `.gap-md`, `.gap-lg`: Gap utilities

### Spacing
- `.mt-sm`, `.mb-sm`, `.pt-sm`, `.pb-sm`: Margin/padding utilities
- Use `-xs`, `-sm`, `-md`, `-lg`, `-xl` suffixes

### Text
- `.text-center`: Center align text
- `.text-left`: Left align text
- `.text-right`: Right align text

## Component Loader

The component loader automatically loads the header and footer when the page loads. You can also manually load components:

```javascript
// Load header only
await ComponentLoader.loadHeader();

// Load footer only
await ComponentLoader.loadFooter();

// Load both
await ComponentLoader.loadAll();

// Load into custom elements
await ComponentLoader.loadHeader('my-custom-header-id');
await ComponentLoader.loadFooter('my-custom-footer-id');
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties required
- ES6+ JavaScript required

## Development

To test locally, you need a local web server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## Next Steps (Future Phases)

- Phase 2: TurboTax-style bill analyzer with multi-step wizard
- Phase 3: OCR integration with Tesseract.js
- Phase 4: CPT code database and citations
- Phase 5: Web search integration
- Phase 6: Unified folder structure reorganization

## Notes

- All paths are absolute (start with `/`) for consistency
- Font Awesome 6.5.1 is used for icons
- Component loader includes retry logic for failed fetches
- Header is sticky positioned
- Mobile-responsive by default
