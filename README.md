# stable-context-map

A React map application that preserves the user's viewing context. When searching for locations, the map maintains its current zoom level and center position, adding search results as markers without disrupting the user's viewport.

## Purpose
Searches do not change zoom or center - the displayed context is preserved. The user's viewpoint belongs to them, and search is information addition, not viewport manipulation.

## Features
- Map display with OpenStreetMap (via react-leaflet)
- Search box overlay for location search (Nominatim geocoding)
- Add search results as markers without moving the map
- Click on map to add markers manually
- Marker info panel with editable labels and memos (bottom-right)
- Marker list with navigation and delete functions (top-right panel)
- Zoom level selector with 6 presets (bottom-left, hidden when locked)
- Zoom lock/unlock toggle (prevents accidental zoom changes)
- Fit bounds button to show all markers at once (top-right)
- PDF export with customizable options (map + marker list)
- JSON export/import for data backup and sharing (top-right buttons)
- Auto-save to localStorage (persistent across sessions)
- Clear all data with confirmation dialog

## Tech Stack
- Node.js: 22.21.1
- React (Functional Components)
- TypeScript (Type-safe development)
- Vite (Development environment and build tool)
- pnpm (Package manager)
- Biome (Formatter + Linter)
- Tailwind CSS (Styling with dark mode support)
- react-leaflet (Map display)
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
│   │   ├── ZoomSelector.tsx     # Zoom level dropdown
│   │   └── ZoomLockButton.tsx   # Zoom lock toggle
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