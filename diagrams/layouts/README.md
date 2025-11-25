# Payerset Diagram Layout System

This folder contains default layout JSON files for the Payerset interactive diagrams. The layout system provides a three-tier fallback approach for loading diagram layouts.

## How It Works

When a diagram loads, it attempts to load layout data in the following priority order:

1. **User's Saved Layout** (localStorage) - If the user has manually arranged nodes and saved the layout, this takes priority
2. **Default Layout File** (this folder) - If no user layout exists, the system loads a default layout from a JSON file
3. **Algorithmic Layout** (Cytoscape) - If no default file exists, the diagram uses automatic layout algorithms (COSE, breadthfirst, or preset)

This approach allows:
- Users to save and restore their custom arrangements
- Developers to provide optimized default layouts
- Graceful fallback when no layouts are available

## File Naming Conventions

Layout files must follow these naming patterns based on the diagram parameters:

### Diagram 1: Healthcare Ecosystem Map
**Parameters:** Layer (0-2)

**Naming:**
- `diagram1-layer0.json` - Simple layer
- `diagram1-layer1.json` - Standard layer
- `diagram1-layer2.json` - Complete layer

### Diagram 2: Money Flows
**Parameters:** Layer (0-2)

**Naming:**
- `diagram2-layer0.json` - Simple flow
- `diagram2-layer1.json` - Standard flow
- `diagram2-layer2.json` - Complete flow

### Diagram 3: Power Map
**Parameters:** Layer (0-2), View (current|transparency)

**Naming:**
- `diagram3-layer0-current.json` - Simple layer, current state
- `diagram3-layer0-transparency.json` - Simple layer, with transparency
- `diagram3-layer1-current.json` - Standard layer, current state
- `diagram3-layer1-transparency.json` - Standard layer, with transparency
- `diagram3-layer2-current.json` - Complete layer, current state
- `diagram3-layer2-transparency.json` - Complete layer, with transparency

### Diagram 4: Conflicts Map
**Parameters:** Conflict ID (all|0-6), View (current|transparency)

**Naming:**
- `diagram4-conflictall-current.json` - All conflicts, current state
- `diagram4-conflictall-transparency.json` - All conflicts, with transparency
- `diagram4-conflict0-current.json` - Conflict 0, current state
- `diagram4-conflict0-transparency.json` - Conflict 0, with transparency
- `diagram4-conflict1-current.json` through `diagram4-conflict6-current.json`
- `diagram4-conflict1-transparency.json` through `diagram4-conflict6-transparency.json`

### Diagram 5: Transformation
**Parameters:** Layer (0-2), View (before|after|split)

**Naming:**
- `diagram5-layer0-before.json` - Simple layer, before state
- `diagram5-layer0-after.json` - Simple layer, after state
- `diagram5-layer0-split.json` - Simple layer, split view
- `diagram5-layer1-before.json` - Standard layer, before state
- `diagram5-layer1-after.json` - Standard layer, after state
- `diagram5-layer1-split.json` - Standard layer, split view
- `diagram5-layer2-before.json` - Complete layer, before state
- `diagram5-layer2-after.json` - Complete layer, after state
- `diagram5-layer2-split.json` - Complete layer, split view

## JSON File Structure

Each layout JSON file must contain the following structure:

```json
{
  "diagram": "diagram1",
  "layer": 0,
  "positions": {
    "node-id-1": { "x": 100, "y": 200 },
    "node-id-2": { "x": 300, "y": 400 }
  },
  "zoom": 1,
  "pan": { "x": 0, "y": 0 },
  "exportDate": "2024-01-15T10:30:00.000Z"
}
```

### Required Fields

- **diagram** (string): The diagram identifier (e.g., "diagram1", "diagram2")
- **layer** (number): The layer number (0-2)
- **positions** (object): Key-value pairs where keys are node IDs and values are position objects with x and y coordinates
- **zoom** (number): The zoom level (typically 0.5 to 2.0)
- **pan** (object): The pan position with x and y coordinates

### Optional Fields

- **view** (string): For diagrams 3-5, the view parameter (current/transparency, before/after/split)
- **conflict** (string|number): For diagram 4, the conflict ID
- **exportDate** (string): ISO timestamp of when the layout was exported

## Creating Default Layouts

To create a default layout file for a diagram:

### Step 1: Open the Diagram
Navigate to the diagram in your browser:
```
http://localhost:3000/diagrams/diagram1.html
```

### Step 2: Arrange Nodes
- Select the appropriate layer and view using the control buttons
- Drag nodes to optimal positions
- Adjust zoom and pan for the best initial view
- Consider readability, flow direction, and visual hierarchy

### Step 3: Export Layout
Click the **"Export"** button in the Layout controls. This will download a JSON file named according to the naming convention (e.g., `payerset-diagram1-layout-layer0.json`).

### Step 4: Rename and Place File
1. Rename the exported file to match the exact naming convention:
   - Remove the "payerset-" prefix
   - Remove "-layout" from the name
   - Ensure it matches the pattern exactly (e.g., `diagram1-layer0.json`)

2. Place the file in this directory (`/diagrams/layouts/`)

### Step 5: Test
1. Clear your browser's localStorage (or use an incognito window)
2. Reload the diagram page
3. Verify the layout loads automatically with your arranged positions

## User Layout Management

End users can manage their own layouts using the controls on each diagram page:

### Save Layout
Saves the current node positions, zoom, and pan to the browser's localStorage. This will take priority over default layouts on subsequent visits.

### Reset Layout
Clears the saved user layout from localStorage. On the next load, the diagram will attempt to load the default layout file, or fall back to algorithmic layout.

### Export Layout
Downloads the current layout as a JSON file. Users can share layouts with others or back them up.

### Import Layout
Loads a layout from a previously exported JSON file. This saves it to localStorage and applies it immediately.

## Development Notes

### Layout Priority Logic

The layout loading is handled in the `loadSavedLayout()` function in each diagram HTML file:

```javascript
async function loadSavedLayout(layerNum, view) {
    // 1. Check localStorage (user's saved layout)
    const savedData = localStorage.getItem(`diagram_layout_${layerNum}_${view}`);
    if (savedData) {
        return JSON.parse(savedData);
    }

    // 2. Try to load default layout file
    const response = await fetch(`layouts/diagram-layer${layerNum}-${view}.json`);
    if (response.ok) {
        return await response.json();
    }

    // 3. Return null to trigger algorithmic layout
    return null;
}
```

### Adding New Layout Files

When adding new default layout files:

1. Ensure the file name exactly matches the naming convention
2. Validate the JSON structure includes all required fields
3. Test that node IDs in the positions object match the actual node IDs in the diagram data
4. Verify zoom level provides good visibility (typically 0.8 to 1.2)
5. Test in a clean browser session (no localStorage data)

### Updating Diagram Data

If you add or remove nodes from a diagram's data structure:

1. Update or recreate the default layout files for affected layers/views
2. Users' saved layouts with obsolete node IDs will gracefully ignore missing nodes
3. New nodes not in saved layouts will be positioned by Cytoscape's algorithm

## Troubleshooting

### Layout Not Loading

**Problem:** Default layout file exists but diagram uses algorithmic layout

**Solutions:**
- Check browser console for errors (F12 → Console)
- Verify file name matches exactly (case-sensitive)
- Validate JSON structure using a JSON validator
- Ensure file is in the correct directory (`/diagrams/layouts/`)
- Check that fetch request isn't blocked by CORS policy

### Nodes in Wrong Positions

**Problem:** Layout loads but nodes appear in unexpected positions

**Solutions:**
- Verify node IDs in JSON match the actual node IDs in diagram data
- Check that the correct layer/view parameter is being passed
- Ensure positions have valid x and y numeric values
- Clear localStorage and test with default layout only

### User Layout Persists After Reset

**Problem:** "Reset Layout" doesn't clear the layout

**Solutions:**
- Check browser's localStorage manually (F12 → Application → Local Storage)
- Clear entire localStorage for the site
- Verify the correct key is being removed (check naming pattern)

## Best Practices

1. **Consistent Spacing**: Maintain similar spacing between related nodes
2. **Flow Direction**: Arrange flows left-to-right or top-to-bottom for readability
3. **Hierarchy**: Position more important/central nodes prominently
4. **Avoid Overlaps**: Ensure nodes and labels don't overlap
5. **Balanced Zoom**: Default zoom should show most/all content without scrolling
6. **Centered Pan**: Pan should center the main content in the viewport
7. **Version Control**: Commit layout files to git for team collaboration
8. **Documentation**: Update this README if you change naming conventions

## Related Files

- `/diagrams/diagram1.html` - Diagram 1 implementation
- `/diagrams/diagram2.html` - Diagram 2 implementation
- `/diagrams/diagram3.html` - Diagram 3 implementation
- `/diagrams/diagram4.html` - Diagram 4 implementation
- `/diagrams/diagram5.html` - Diagram 5 implementation
- `/js/app.js` - Main app with navigation to diagrams
- `/index.html` - Main landing page

## Support

For issues or questions about the layout system, please refer to the main project documentation or contact the development team.
