# Glossary Tooltip System Reference

**Implementation:** timeline.html
**Purpose:** Subtle hover-over definitions for healthcare terms
**Status:** ✅ Production Ready

---

## Architecture Overview

```
glossary-data.js  →  GlossaryTerm Component  →  processGlossaryTerms()  →  Slide Components
     (Terms)            (UI Component)           (Text Processing)          (Integration)
```

---

## 1. Data Layer: glossary-data.js

### Structure
```javascript
const glossaryTerms = {
    "ERISA": "Employee Retirement Income Security Act of 1974...",
    "HIPAA": "Health Insurance Portability and Accountability Act...",
    "CAA": "Consolidated Appropriations Act of 2020...",
    "Gag Clause": "Contractual provisions that prevent disclosure...",
    "TPA": "Third-Party Administrator. Company that processes claims...",
    // ... 30+ terms
};
```

### Key Design Decisions
- **Object not Array:** Fast O(1) lookup by term name
- **Both acronyms and full phrases:** "ERISA", "Gag Clause", "Medical Loss Ratio"
- **Plural variants:** "Gag Clause" and "Gag Clauses" both included
- **Export for browser:** `module.exports` for Node, direct global for browser

### Adding New Terms
```javascript
// In glossary-data.js
"New Term": "Full definition here. Can be multiple sentences.",
"Acronym": "What the acronym stands for and what it means.",
```

---

## 2. UI Component: GlossaryTerm

### React Component
```javascript
const GlossaryTerm = ({ term, definition, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);

    return (
        <span
            className="glossary-term"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ position: 'relative' }}
        >
            {children}
            {showTooltip && (
                <span className="glossary-tooltip" ref={tooltipRef}>
                    <strong>{term}</strong>
                    <p>{definition}</p>
                </span>
            )}
        </span>
    );
};
```

### Props
- **term** (string): The glossary term name (e.g., "CAA")
- **definition** (string): The full definition from glossary-data.js
- **children** (ReactNode): The actual text to display (preserves original case)

### State Management
- **showTooltip** (boolean): Controls tooltip visibility
- **tooltipRef** (ref): Reference to tooltip DOM element (for future positioning)

### Why This Design
- ✅ **Hover-based:** No clicks needed, feels like native browser tooltips
- ✅ **Preserves text:** Children passed through unchanged
- ✅ **Conditional render:** Tooltip only in DOM when visible (performance)
- ✅ **Accessible:** Uses semantic HTML, can add ARIA later

---

## 3. Text Processing: processGlossaryTerms()

### Algorithm

```javascript
const processGlossaryTerms = (text) => {
    // 1. Guard: Return early if invalid input
    if (!text || typeof text !== 'string' || typeof glossaryTerms === 'undefined') {
        return text;
    }

    // 2. Sort terms by length (longest first)
    const terms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);

    // 3. Find all matches with position
    const matches = [];
    terms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                term: term,
                originalText: match[0],  // Preserves case
                index: match.index,
                length: match[0].length
            });
        }
    });

    // 4. Sort matches by position
    matches.sort((a, b) => a.index - b.index);

    // 5. Remove overlapping matches (keep first)
    const filteredMatches = [];
    let lastEnd = -1;
    matches.forEach(match => {
        if (match.index >= lastEnd) {
            filteredMatches.push(match);
            lastEnd = match.index + match.length;
        }
    });

    // 6. Build React element array
    if (filteredMatches.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    filteredMatches.forEach((match, idx) => {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        // Add glossary term with tooltip
        parts.push(
            <GlossaryTerm
                key={`term-${idx}`}
                term={match.term}
                definition={glossaryTerms[match.term]}
            >
                {match.originalText}
            </GlossaryTerm>
        );

        lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
};
```

### Step-by-Step Example

**Input:** `"The CAA made gag clauses illegal."`

1. **Terms sorted:** `["Gag Clause", "CAA"]` (longest first)
2. **Matches found:**
   - "CAA" at index 4
   - "gag clauses" at index 14 (matches "Gag Clauses" case-insensitive)
3. **No overlaps** (both are valid)
4. **Build result:**
   ```javascript
   [
       "The ",
       <GlossaryTerm term="CAA">CAA</GlossaryTerm>,
       " made ",
       <GlossaryTerm term="Gag Clauses">gag clauses</GlossaryTerm>,
       " illegal."
   ]
   ```

### Why This Algorithm

**Longest First:**
- Prevents "Medical Loss Ratio" from matching just "Medical"
- Ensures "Gag Clause" matched before "Gag"

**Overlap Prevention:**
- If "Medical Loss Ratio" matches at index 10-30
- Don't also match "Medical" at index 10-17
- Keeps first match, discards overlapping ones

**Case Preservation:**
- Input: "The CAA and the caa both work"
- Output: Both wrapped, but original case preserved
- Uses `match[0]` (actual matched text) not `term` (lookup key)

**Regex with Word Boundaries:**
- `\b${term}\b` ensures whole words only
- "CAA" won't match "CAAB" or "BCAA"

---

## 4. CSS Styling: timeline.css

### Glossary Term (Wrapper)
```css
.glossary-term {
    position: relative;
    cursor: help;
    transition: all 0.2s ease;
}
```

**Why:**
- `position: relative` - Creates positioning context for tooltip
- `cursor: help` - Subtle hint that hover does something
- No underlines or colors - stays subtle

### Tooltip (Popup)
```css
.glossary-tooltip {
    position: absolute;
    bottom: calc(100% + 12px);  /* 12px above term */
    left: 50%;
    transform: translateX(-50%);  /* Center horizontally */

    background: white;
    border: 2px solid var(--payerset-blue);
    border-radius: 8px;
    padding: 16px 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

    min-width: 280px;
    max-width: 400px;
    z-index: 10000;

    text-align: left;
    white-space: normal;

    animation: tooltipFadeIn 0.2s ease-out;
    pointer-events: none;  /* Don't block clicks */
}
```

### Tooltip Content
```css
.glossary-tooltip strong {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: var(--payerset-blue);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.glossary-tooltip p {
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-primary);
    margin: 0;
}
```

### Tooltip Arrow
```css
/* Bottom pointing arrow (border trick) */
.glossary-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;  /* At bottom of tooltip */
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: var(--payerset-blue);  /* Blue outline */
}

.glossary-tooltip::before {
    content: '';
    position: absolute;
    top: calc(100% - 2px);  /* Slightly up */
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: white;  /* White fill */
    z-index: 1;
}
```

**How It Works:**
- `::after` creates blue triangle pointing down
- `::before` creates white triangle on top (fills center)
- Result: Arrow with blue outline matching tooltip border

### Fade-In Animation
```css
@keyframes tooltipFadeIn {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(4px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}
```

**Effect:** Tooltip fades in and slides up slightly

---

## 5. Integration: Slide Components

### Before (No Tooltips)
```javascript
const EventSlide = ({ data }) => (
    <div className="timeline-slide">
        <div className="slide-title">{data.title}</div>
        <div className="slide-subtitle">{data.subtitle}</div>
        <p>{data.body}</p>
    </div>
);
```

### After (With Tooltips)
```javascript
const EventSlide = ({ data }) => (
    <div className="timeline-slide">
        <div className="slide-title">{processGlossaryTerms(data.title)}</div>
        <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>
        <p>{processGlossaryTerms(data.body)}</p>
    </div>
);
```

**Change:** Wrap every text field in `processGlossaryTerms()`

### Which Fields to Process
```javascript
// ✅ Process these
processGlossaryTerms(data.title)
processGlossaryTerms(data.subtitle)
processGlossaryTerms(data.body)
processGlossaryTerms(data.quote)
processGlossaryTerms(data.insight)
processGlossaryTerms(point)  // In lists
processGlossaryTerms(stat.label)
processGlossaryTerms(stat.description)

// ❌ Don't process these
data.year  // Numbers
stat.number  // Numbers
data.id  // IDs
```

**Rule:** Process user-facing text, not data/IDs/numbers

---

## 6. HTML Integration: timeline.html

### Script Loading Order
```html
<head>
    <!-- React -->
    <script src="react.production.min.js"></script>
    <script src="react-dom.production.min.js"></script>
    <script src="babel.min.js"></script>
</head>
<body>
    <div id="timeline-root"></div>

    <!-- CRITICAL ORDER -->
    <script src="js/glossary-data.js"></script>  <!-- 1. Data first -->
    <script type="text/babel" src="js/timeline.js"></script>  <!-- 2. Components second -->
</body>
```

**Why This Order:**
- glossary-data.js defines global `glossaryTerms` object
- timeline.js references `glossaryTerms` in `processGlossaryTerms()`
- If reversed, timeline.js runs before terms are defined → error

---

## Performance Considerations

### Regex Performance
- **Pattern:** `\b${term}\b` with `g` and `i` flags
- **Cost:** O(n) per term, where n = text length
- **Optimization:** Sort by length descending (match fewer times)
- **Result:** ~30 terms × ~100 char text = negligible

### React Re-renders
- **GlossaryTerm:** Pure functional component, only re-renders on prop change
- **Tooltip:** Conditional render (only when `showTooltip === true`)
- **Memory:** Tooltip DOM created/destroyed on hover (not kept in memory)

### DOM Size
- **No tooltips:** ~20 slides × ~500 elements = 10,000 DOM nodes
- **With tooltips:** Same (tooltips only added on hover, removed on leave)
- **Impact:** Zero DOM size increase

### Scroll Performance
- **No scroll listeners:** Tooltips don't track scroll
- **CSS-only positioning:** No JavaScript calculations
- **Result:** No scroll jank

---

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️  IE11: Needs Babel transpilation (already included)

---

## Testing Checklist

When adding glossary tooltips to new page:

- [ ] Import glossary-data.js before main script
- [ ] Add GlossaryTerm component
- [ ] Add processGlossaryTerms function
- [ ] Add CSS for `.glossary-term` and `.glossary-tooltip`
- [ ] Wrap text fields in `processGlossaryTerms()`
- [ ] Test: Hover shows tooltip
- [ ] Test: Multiple terms on same text
- [ ] Test: Case insensitive matching works
- [ ] Test: Tooltip positioned correctly
- [ ] Test: No overlap with page content

---

## Common Issues & Solutions

### Issue: Tooltip Cut Off at Top
**Cause:** Tooltip rendered near top of viewport
**Solution:** Check if `bottom: calc(100% + 12px)` fits, fallback to `top`

### Issue: Terms Not Matching
**Cause:** Term not in glossary-data.js
**Solution:** Add term to glossaryTerms object

### Issue: Overlapping Matches
**Cause:** Algorithm bug in overlap detection
**Solution:** Verify `lastEnd` tracking in filteredMatches

### Issue: Wrong Case in Tooltip
**Cause:** Using `match.term` instead of `match.originalText`
**Solution:** Pass `match.originalText` as children

---

## Future Enhancements

### Keyboard Accessibility
```javascript
// Add keyboard support
<span
    className="glossary-term"
    tabIndex={0}  // Make focusable
    onFocus={() => setShowTooltip(true)}
    onBlur={() => setShowTooltip(false)}
    onKeyDown={(e) => e.key === 'Escape' && setShowTooltip(false)}
>
```

### Analytics
```javascript
// Track term hovers
onMouseEnter={() => {
    setShowTooltip(true);
    analytics.track('glossary_term_hover', { term });
}}
```

### Smart Positioning
```javascript
// Flip tooltip if near edge
useEffect(() => {
    if (tooltipRef.current) {
        const rect = tooltipRef.current.getBoundingClientRect();
        if (rect.top < 0) {
            // Flip to bottom
            tooltipRef.current.style.bottom = 'auto';
            tooltipRef.current.style.top = 'calc(100% + 12px)';
        }
    }
}, [showTooltip]);
```

---

## References

- [glossary-data.js](../js/glossary-data.js) - Term definitions
- [timeline.js](../js/timeline.js) - Component implementation
- [timeline.css](../css/timeline.css) - Tooltip styles
- [timeline.html](../timeline.html) - Integration example

---

**Last Updated:** November 20, 2024
**System Status:** ✅ Production Ready
