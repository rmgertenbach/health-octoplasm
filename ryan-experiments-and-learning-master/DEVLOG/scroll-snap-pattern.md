# Scroll-Snap Pattern Reference

**Pattern Source:** timeline.html
**Applied To:** 2025-11/index.html
**Status:** ✅ Working

---

## The Pattern That Works

### 1. HTML Structure
```html
<body>
  <div class="container-with-snap">
    <section class="slide">...</section>
    <section class="slide">...</section>
    <section class="slide">...</section>
  </div>
</body>
```

**Key Points:**
- Body has NO scroll styles
- Container div handles scrolling
- Sections are direct children of container

### 2. Container CSS
```css
.container-with-snap {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
    scroll-behavior: smooth;
}
```

**Why This Works:**
- `scroll-snap-type: y mandatory` - Forces snap on vertical axis
- `overflow-y: scroll` - Makes container scrollable
- `height: 100vh` - Full viewport height
- `scroll-behavior: smooth` - Smooth scroll transitions

### 3. Slide CSS
```css
.slide {
    min-height: 100vh;
    scroll-snap-align: start;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

**Why This Works:**
- `min-height: 100vh` - Each slide fills viewport
- `scroll-snap-align: start` - Snap to top of slide
- `display: flex` + centering - Content centered in viewport

---

## What Doesn't Work

### ❌ Scroll-Snap on `<html>` or `<body>`
```css
/* DON'T DO THIS */
html {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
}
```

**Why It Fails:**
- Browser compatibility issues
- Conflicts with native scrolling
- Inconsistent behavior across devices

### ❌ Scroll-Snap Without Container
```html
<!-- DON'T DO THIS -->
<body>
  <section class="slide">...</section>
  <section class="slide">...</section>
</body>
```

**Why It Fails:**
- No dedicated scroll context
- Can't control overflow properly
- Hard to disable for mobile

---

## Implementation Checklist

When implementing scroll-snap:

- [ ] Create container div (NOT on html/body)
- [ ] Set container: `scroll-snap-type: y mandatory`
- [ ] Set container: `overflow-y: scroll`
- [ ] Set container: `height: 100vh`
- [ ] Set slides: `min-height: 100vh`
- [ ] Set slides: `scroll-snap-align: start`
- [ ] Set body: `overflow: hidden` (prevents double scrollbars)
- [ ] Mobile: Disable snap (`scroll-snap-type: none`)

---

## Class Naming Convention

### timeline.html
```css
.timeline-app { /* container */ }
.timeline-slide { /* slides */ }
```

### 2025-11/index.html
```css
.presentation-app { /* container */ }
.presentation-slide { /* slides */ }
```

**Pattern:** `{purpose}-app` for container, `{purpose}-slide` for sections

---

## Mobile Considerations

```css
@media (max-width: 768px) {
    .container-with-snap {
        scroll-snap-type: none;  /* Disable snap */
    }

    .slide {
        min-height: auto;  /* Allow natural height */
    }
}
```

**Why:**
- Small screens: Snap can feel restrictive
- Content might not fit in viewport
- Users expect natural scroll

---

## JavaScript Integration

**Scroll to specific slide:**
```javascript
const slides = document.querySelectorAll('.slide');
slides[index].scrollIntoView({ behavior: 'smooth' });
```

**Detect current slide:**
```javascript
container.addEventListener('scroll', () => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        if (Math.abs(rect.top) < 10) {
            // This is the active slide
        }
    });
});
```

---

## Common Pitfalls

1. **Forgetting container div** → Put scroll-snap on dedicated wrapper
2. **Wrong overflow property** → Use `overflow-y: scroll`, not `auto`
3. **Missing height** → Container must have `height: 100vh`
4. **Body overflow** → Set `overflow: hidden` on body
5. **Mobile testing** → Always test with snap disabled

---

## Browser Support

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (iOS 11+)
- ⚠️  Older browsers: Graceful degradation (still scrollable)

---

## Example: Minimal Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }

        .snap-container {
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            height: 100vh;
            scroll-behavior: smooth;
        }

        .snap-section {
            min-height: 100vh;
            scroll-snap-align: start;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="snap-container">
        <section class="snap-section">Slide 1</section>
        <section class="snap-section">Slide 2</section>
        <section class="snap-section">Slide 3</section>
    </div>
</body>
</html>
```

**That's it. 18 lines. Works perfectly.**

---

## Debugging Scroll-Snap

If snap isn't working:

1. **Check container height:** `height: 100vh` set?
2. **Check overflow:** `overflow-y: scroll` set?
3. **Check slide height:** `min-height: 100vh` set?
4. **Check nesting:** Slides direct children of container?
5. **Check body:** `overflow: hidden` to prevent double scroll?
6. **Check mobile:** Is snap disabled on small screens?

---

## References

- [MDN: CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)
- [timeline.html](../timeline.html) - Working implementation
- [2025-11/index.html](../2025-11/index.html) - Second working implementation

---

**Last Updated:** November 20, 2024
**Pattern Status:** ✅ Proven & Tested
