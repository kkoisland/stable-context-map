# stable-context-map

A React map application that preserves the user's viewing context. When searching for locations, the map maintains its current zoom level and center position, adding search results as markers without disrupting the user's viewport.

## Purpose
Searches do not change zoom or center - the displayed context is preserved. The user's viewpoint belongs to them, and search is information addition, not viewport manipulation.

## Resources

🚀 **Live Demo**: https://www.kkoisland.com/stable-context-map/

📊 **Presentation**: [Google Slides (Preview)](https://docs.google.com/presentation/d/1MoYldpw8Tli5Bh_0_DOKAi_oIHQ25wk4KlN6TwuClU4/preview)

## Features

### Map Interaction
- 🗺️ **Map Display**: OpenStreetMap via react-leaflet
- 🔍 **Stable Search**: Location search without changing zoom/center (Nominatim geocoding)
- 📍 **Click to Add**: Click anywhere on map to add markers manually

### Marker Management
- ✏️ **Editable Markers**: Edit labels and memos for each marker
- 📋 **Marker List**: View all markers with navigation and delete functions (top-right panel)
- 📊 **Marker Info Panel**: Detailed info for selected marker (bottom-right)
- 🔢 **Numbered Pins**: Auto-numbered markers on map

### View Controls
- 🔒 **Zoom Lock**: Lock/unlock zoom controls (prevents accidental zoom during presentations)
- 🌍 **Fit Bounds**: Auto-adjust view to show all markers at once
- 📏 **Zoom Selector**: 16 preset zoom levels (2–18), bottom-left, hidden when locked

### Data Persistence
- 💾 **Auto-save**: Automatic save to localStorage (persistent across sessions)
- 📥 **Import JSON**: Restore saved plans from JSON files
- 📤 **Export JSON**: Backup and share your marker data
- 🖨️ **Export PDF**: Generate PDF with map screenshot and marker list
- 🗑️ **Clear All**: Delete all markers and data with confirmation dialog

## Tech Stack
- Node.js: 22.21.1
- React (Functional Components)
- TypeScript (Type-safe development)
- Vite (Development environment and build tool)
- pnpm (Package manager)
- Biome (Formatter + Linter)
- Tailwind CSS (Styling with dark mode support)
- react-leaflet (Map display library)
- OpenStreetMap (Map tiles & data provider)
- Nominatim (OpenStreetMap geocoding API)
- jsPDF (PDF generation)
- html2canvas (Map screenshot capture)

## Data Structures
```typescript
interface Marker {
  id: string
  lat: number
  lng: number
  label: string
  memo?: string
  pinNumber: number
}

interface AppState {
  zoom: number
  markers: Marker[]
}

interface StorageState {
  markers: Marker[]
  zoom: number
  center: [number, number]
}

interface ExportData {
  version: string
  exportedAt: string
  markers: Marker[]
  zoom: number
  center: [number, number]
}

interface ExportOptions {
  includeMap: boolean
  includeMarkerList: boolean
}
```

## Setup
```bash
# Clone the repository
git clone git@github.com:kkoisland/stable-context-map.git
cd stable-context-map

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Deployment
<!-- TODO: Write about deployment method -->

## Project Structure
```
stable-context-map/
├── public/
├── src/
│   ├── components/
│   │   ├── Map.tsx              # Map component with ref support
│   │   ├── SearchBox.tsx        # Search UI overlay
│   │   ├── MarkerInfo.tsx       # Marker info panel (bottom-right)
│   │   ├── MarkerList.tsx       # Marker list panel (top-right)
│   │   ├── ExportButton.tsx     # PDF export button with panel
│   │   ├── FitBoundsButton.tsx  # Show all markers button
│   │   └── ZoomSelector.tsx     # Zoom level dropdown
│   ├── hooks/
│   │   └── useClickOutside.ts   # Custom hook for click-outside detection
│   ├── types.ts                 # Type definitions
│   ├── geocoding.ts             # Nominatim API calls
│   ├── storage.ts               # localStorage operations
│   ├── jsonIO.ts                # JSON export/import functions
│   ├── pdf.ts                   # PDF generation logic
│   ├── App.tsx                  # Main component (state management)
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── biome.json
```