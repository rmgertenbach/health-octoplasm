# Icon Reference - Font Awesome Mappings

All emojis have been replaced with Font Awesome 6 icons for a more professional, React-like appearance.

## Installation

Add to the `<head>` of all HTML files:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

## Icon Mappings

### General/Navigation
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| 🏥 | `fa-solid fa-hospital` | Patient/Healthcare |
| 💼 | `fa-solid fa-briefcase` | Employer/Business |
| ⚕️ | `fa-solid fa-user-doctor` | Provider/Medical Professional |
| 🔍 | `fa-solid fa-magnifying-glass` | Search |
| 📊 | `fa-solid fa-chart-line` | Analytics/Benchmarking |
| 📈 | `fa-solid fa-chart-simple` | Market data/Growth |
| 🎯 | `fa-solid fa-bullseye` | Target/Goal |
| 💡 | `fa-solid fa-lightbulb` | Idea/Insight |
| 📚 | `fa-solid fa-book` | Education/Learning |
| 📋 | `fa-solid fa-clipboard-check` | Compliance/Checklist |
| 📄 | `fa-solid fa-file-lines` | Document |
| 📍 | `fa-solid fa-location-dot` | Location/Maps |

### Actions
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| ⭐ | `fa-solid fa-star` | Quality/Featured |
| 💰 | `fa-solid fa-dollar-sign` | Money/Cost |
| 🤝 | `fa-solid fa-handshake` | Partnership/Contract |
| ⚖️ | `fa-solid fa-scale-balanced` | Justice/Fair pricing |
| 🏆 | `fa-solid fa-trophy` | Quality/Award |
| ✅ | `fa-solid fa-circle-check` | Success/Checkmark |
| ❌ | `fa-solid fa-circle-xmark` | Error/Problem |
| ⚠️ | `fa-solid fa-triangle-exclamation` | Warning |
| 🚨 | `fa-solid fa-siren` | Alert/Urgent |

### Specific Use Cases
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| 🔬 | `fa-solid fa-microscope` | Lab/Testing |
| 🧲 | `fa-solid fa-magnet` | MRI |
| 📷 | `fa-solid fa-camera` | CT Scan/Imaging |
| 📡 | `fa-solid fa-signal` | Ultrasound |
| 🦴 | `fa-solid fa-bone` | Orthopedics |
| 🦵 | `fa-solid fa-person-walking` | Mobility/Knee |
| 💊 | `fa-solid fa-pills` | Pharmacy |
| 💉 | `fa-solid fa-syringe` | Injection |
| 🏥 | `fa-solid fa-hospital-user` | Hospital visit |
| 🚑 | `fa-solid fa-ambulance` | Emergency |

### Numbers/Indicators
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| 1️⃣ | `<span class="icon-badge">1</span>` | Step numbers |
| 2️⃣ | `<span class="icon-badge">2</span>` | Step numbers |
| 3️⃣ | `<span class="icon-badge">3</span>` | Step numbers |

### Emotions/Reactions
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| 😤 | `fa-solid fa-face-angry` | Frustration |
| 😊 | `fa-solid fa-face-smile` | Happy |
| 🤔 | `fa-solid fa-face-thinking` | Consideration |
| 🤷 | `fa-solid fa-person-shrugging` | Confusion/Unknown |

### Charts & Data
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| 📊 | `fa-solid fa-chart-line` | Line chart/Trending |
| 📈 | `fa-solid fa-chart-area` | Area chart/Growth |
| 📉 | `fa-solid fa-chart-line-down` | Decline |
| 🔍 | `fa-solid fa-magnifying-glass-chart` | Data analysis |
| 📱 | `fa-solid fa-mobile-screen` | Mobile device |
| 💻 | `fa-solid fa-laptop` | Desktop/Computing |
| 📞 | `fa-solid fa-phone` | Contact |
| ⏱️ | `fa-solid fa-clock` | Time/Schedule |

### Education
| Emoji | Icon Class | Usage |
|-------|------------|-------|
| 📚 | `fa-solid fa-book` | General education |
| 🎓 | `fa-solid fa-graduation-cap` | Academic/Learning |
| 📖 | `fa-solid fa-book-open` | Reading/Guide |
| 💬 | `fa-solid fa-comments` | Discussion |
| ❓ | `fa-solid fa-circle-question` | Help/FAQ |

## Usage Examples

### Basic Icon
```html
<i class="fa-solid fa-hospital"></i>
```

### Icon with Color
```html
<i class="fa-solid fa-hospital" style="color: var(--color-patient-primary);"></i>
```

### Icon in List Item
```html
<li style="padding-left: 24px; position: relative;">
  <i class="fa-solid fa-check" style="position: absolute; left: 0; color: var(--color-success);"></i>
  List item text
</li>
```

### Large Icon
```html
<div style="font-size: 48px; color: var(--color-patient-primary);">
  <i class="fa-solid fa-hospital"></i>
</div>
```

### Icon in Gradient Circle
```html
<div style="
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-patient-primary), var(--color-patient-secondary));
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
">
  <i class="fa-solid fa-lightbulb"></i>
</div>
```

## Custom CSS for Number Badges

Add to your CSS for numbered steps:

```css
.icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--color-patient-primary);
  color: white;
  border-radius: var(--radius-xl);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}
```

## Benefits of Font Awesome Over Emojis

1. **Consistent Rendering** - Same appearance across all browsers and devices
2. **Scalable** - Vector-based, scales perfectly at any size
3. **Customizable** - Easy to change color, size, rotation, animation
4. **Professional** - More polished, React-like appearance
5. **Accessibility** - Better screen reader support with proper aria labels
6. **Performance** - Single font file vs. multiple emoji images

## Files Updated

✅ experiments/index.html - Complete
✅ experiments/patients/index.html - Complete
✅ experiments/patients/search.html - Complete
✅ experiments/patients/learn.html - Already uses numbered badges, no emojis
✅ experiments/employers/index.html - Complete
✅ experiments/employers/benchmark.html - Complete
✅ experiments/employers/spread-calculator.html - Complete
✅ experiments/providers/index.html - Complete
✅ experiments/providers/market-intel.html - Complete

**All files updated successfully!** 🎉

## Quick Find & Replace Patterns

For bulk updates, use these patterns:

```
🏥  → <i class="fa-solid fa-hospital"></i>
🔍  → <i class="fa-solid fa-magnifying-glass"></i>
⭐  → <i class="fa-solid fa-star"></i>
💰  → <i class="fa-solid fa-dollar-sign"></i>
📚  → <i class="fa-solid fa-book"></i>
💼  → <i class="fa-solid fa-briefcase"></i>
📊  → <i class="fa-solid fa-chart-line"></i>
🎯  → <i class="fa-solid fa-bullseye"></i>
📋  → <i class="fa-solid fa-clipboard-check"></i>
⚕️  → <i class="fa-solid fa-user-doctor"></i>
```

Remember to add colors inline where needed to match the persona theme!
