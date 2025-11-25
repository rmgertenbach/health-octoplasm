# 2025-11 Experimental Site

**The "Explain it to Mom" Version**

## What This Is

A radically simplified, single-page site that explains healthcare price transparency in plain English. No jargon. No complexity. Just the core message:

> "You're overpaying. Here's why. Here's the solution."

## Design Philosophy

**Target Audience:** Someone with zero healthcare knowledge
- Your mom
- A friend at a party
- An elevator pitch
- A 30-second explanation

**Key Principles:**
1. **One Big Number:** $5,000/year overpayment
2. **One Clear Example:** MRI costs $2,800 vs $425
3. **One Simple Solution:** Make prices visible
4. **One Call-to-Action:** Explore the platform

**Design Approach:**
- **Scroll-snap navigation** - Like a presentation slide deck, borrowed from timeline.html
- **Payerset blue (#0092CA)** - Consistent brand colors throughout
- **Soft, approachable aesthetic** - Rounded corners (24px+), gentle shadows, smooth gradients
- **Fade-in animations** - Cards appear as you scroll, with staggered timing
- **Glass-morphism effects** - Backdrop blur on feature cards for modern feel

## What Makes This Different

### From the Main Site
The main site ([../index.html](../index.html)) is comprehensive:
- Full navigation system
- Multiple use cases
- Detailed diagrams
- Glossary of terms
- Timeline presentation

This site is **focused**:
- Single scroll experience
- No navigation needed
- Visual storytelling
- Emotion-driven messaging

### From the Experiments Site
The experiments site ([../experiments/](../experiments/)) is interactive:
- Search tools
- Calculators
- Multiple personas
- Mock data integration

This site is **explanatory**:
- No tools (yet)
- Pure storytelling
- Clear value prop
- Conceptual, not functional

## Structure

### 1. Hero: The Hook
**Message:** "You're paying $5,000/year too much"
- Big, bold number
- Emotional impact
- Scroll indicator to pull you in

### 2. The Problem
**Message:** "Same service, wildly different prices"
- Three shocking statistics
- 5x price variation
- 30% overpayment
- $2.3M hidden fees

### 3. Interactive Demo
**Message:** "Here's what we mean"
- Side-by-side comparison
- MRI: $2,800 vs $425
- Better quality, closer, cheaper
- Real, tangible example

### 4. The Solution
**Message:** "We make transparency simple"
- Three clear benefits
- Know before you go
- Stop overpaying
- Catch hidden fees

### 5. Call to Action
**Message:** "Ready to stop overpaying?"
- Link to main platform
- Link to timeline (the story)
- Clear next steps

## Technical Details

### Single File, Modern Approach
- **No dependencies** - Pure HTML/CSS/JS
- **No build step** - Open and it works
- **Modern CSS** - Grid, Flexbox, CSS Variables, Animations
- **Responsive** - Mobile-first, works on any device
- **Accessible** - Semantic HTML, good contrast, clear hierarchy

### Design System
```css
Colors:
- Blue: #3B82F6 (trust, calm)
- Green: #10B981 (success, savings)
- Red: #EF4444 (problem, alert)
- Orange: #F59E0B (emphasis)

Typography:
- System fonts (-apple-system, etc.)
- Responsive sizing (clamp())
- Clear hierarchy (4rem → 3rem → 2rem → 1.25rem)

Layout:
- Full-height sections
- Centered content (max-width: 1200px)
- Generous whitespace
- Card-based components
```

### Animations
- Smooth scroll behavior
- Fade-in on scroll (Intersection Observer)
- Hover effects on cards
- Pulse animation on key numbers
- Floating background pattern

## Use Cases

### 1. Quick Demo
Open this when someone asks "What does Payerset do?"
- 30 seconds to scroll through
- No explanation needed
- Visual storytelling does the work

### 2. Email Landing Page
Link to this from:
- Investor emails
- Partnership outreach
- Job postings
- Social media

### 3. Conference Presentation
Show on screen while talking:
- No clicking needed
- Auto-advances with your talk
- Big, readable text
- Clear visuals

### 4. Integration Testing
Use this to test:
- CTA button integration
- Analytics tracking
- A/B testing
- Lead capture forms

## How to Customize

### Change the Numbers
The key statistics are in the HTML:
```html
<div class="price-tag">$5,000/year</div>  <!-- Hero overpayment -->
<div class="stat-number">5x</div>          <!-- Price variation -->
<div class="price-amount">$2,800</div>     <!-- Expensive option -->
<div class="price-amount">$425</div>       <!-- Fair option -->
```

### Add Interactivity
The structure supports:
- Email capture form (add before CTA)
- Live search demo (replace static comparison)
- Animated data visualization
- Video embed (hero or demo section)

### Change the Flow
Sections are independent:
- Reorder by moving `<section>` blocks
- Add new sections (copy existing structure)
- Remove sections (delete the block)
- Change colors (update CSS variables)

## Next Steps (If You Want to Expand)

### Add a Simple Tool
Replace the static MRI comparison with:
```html
<input type="text" placeholder="Enter your ZIP code">
<select>
  <option>MRI Scan</option>
  <option>Hip Replacement</option>
  <option>Colonoscopy</option>
</select>
<button>See Prices</button>
```

### Add Email Capture
Before the CTA section:
```html
<section class="email-signup">
  <h2>Get Early Access</h2>
  <form>
    <input type="email" placeholder="your@email.com">
    <button>Join Waitlist</button>
  </form>
</section>
```

### Connect to Real Data
The comparison section could call:
```javascript
fetch('/api/search?procedure=mri&zip=78701')
  .then(r => r.json())
  .then(data => updateComparison(data));
```

### A/B Testing
Test different versions:
- Different headlines
- Different numbers ($5K vs $10K)
- Different CTAs
- Different color schemes

## Embedding in Other Sites

### As an iframe
```html
<iframe src="https://yoursite.com/2025-11/"
        style="width: 100%; height: 100vh; border: none;">
</iframe>
```

### As a component
Copy sections into existing pages:
```html
<!-- Just the hero -->
<section class="hero">...</section>

<!-- Just the comparison -->
<section class="demo">...</section>
```

### As a template
Extract the CSS:
```html
<link rel="stylesheet" href="2025-11/styles.css">
```

Then reuse the card components:
```html
<div class="stat-card">
  <div class="stat-number">5x</div>
  <div class="stat-label">Price Variation</div>
</div>
```

## Success Metrics

If you use this as a landing page, track:
- **Scroll depth** - Do people make it to the CTA?
- **Time on page** - Are they reading or bouncing?
- **CTA click rate** - Are they taking action?
- **Share rate** - Are they sending to others?

Goals:
- 80%+ scroll to bottom
- 60s+ average time on page
- 15%+ click on CTA
- 5%+ share with others

## Files

```
2025-11/
├── index.html                  # Main presentation site
├── bill-checker.html           # Patient bill checking tool ✨ NEW
├── README.md                   # You're reading it
└── BILL-CHECKER-README.md      # Bill Checker documentation
```

### New: Bill Shield (Bill Checker)

**[bill-checker.html](bill-checker.html)** - A patient-focused tool that answers: **"Am I being overcharged?"**

**Features:**
- Upload or manually enter medical bill details
- Compare against real negotiated rates from insurance companies
- Get specific savings amounts (e.g., "You could save $2,375")
- Learn how to dispute overcharges

**Sample Results:**
- MRI: Charged $2,800 → Fair price $425 = **$2,375 savings (559% overcharge)**
- Colonoscopy: Charged $3,800 → Fair price $1,120 = **$2,680 savings (239% overcharge)**
- Blood work: Charged $450 → Fair price $12 = **$438 savings (3,650% overcharge!)**

See [BILL-CHECKER-README.md](BILL-CHECKER-README.md) for full documentation.

---

## Philosophy

> "If you can't explain it to your mom, you don't understand it well enough."

This site is proof that healthcare transparency can be simple.

The industry makes it complicated to hide the truth.
We make it simple to reveal it.

---

**Built:** November 2024
**Purpose:** Radical simplification
**Audience:** Everyone
**Message:** You're overpaying. We can help.
**Next Step:** [Explore the platform](../index.html)
