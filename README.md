# stable-context-map

A React map application that preserves the user's viewing context. When searching for locations, the map maintains its current zoom level and center position, adding search results as markers without disrupting the user's viewport.

## Purpose
Searches do not change zoom or center - the displayed context is preserved. The user's viewpoint belongs to them, and search is information addition, not viewport manipulation.

## Features (MVP)
- Map display with OpenStreetMap (via react-leaflet)
- Search box overlay for location search (Nominatim geocoding)
- Add search results as markers without moving the map
- Marker info panel (fixed at bottom-left)
- PDF export (map + marker list)

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

## Data Structures
```typescript
interface Marker {
  id: string
  lat: number
  lng: number
  label: string
  address?: string
  memo?: string
}

interface AppState {
  zoom: number  // Changed only by user interaction
  markers: Marker[]
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
│   │   ├── Map.tsx              # Map component
│   │   ├── SearchBox.tsx        # Search UI overlay
│   │   ├── MarkerInfo.tsx       # Marker info panel (bottom-left)
│   │   └── ExportButton.tsx     # PDF export button
│   ├── types.ts                 # Type definitions
│   ├── geocoding.ts             # Nominatim API calls
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