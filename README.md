# Template Reactor — Canva-like Design Editor

A production-grade React design editor with drag-and-drop canvas, text engine, icons, gradients, and PNG/PDF export.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- **Canvas**: Instagram Post, Story, Banner, Thumbnail, or custom px
- **Text Engine**: Add/drag/resize/rotate text, 20 Google Fonts, stroke, shadow, letter-spacing
- **Icons**: 50+ Lucide icons, drag/resize/recolor
- **Backgrounds**: Solid colors, gradient presets, custom gradient builder
- **Layers**: Reorder, lock, hide/show, duplicate, delete
- **Export**: PNG / JPG / PDF at full canvas resolution
- **Undo/Redo**: 20-step history (Ctrl+Z / Ctrl+Shift+Z)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Delete / Backspace | Delete selected layer |
| Double-click canvas | Add new text layer |

## Tech Stack

- React 18 + Vite
- Zustand (state)
- react-konva (canvas)
- Tailwind CSS
- lucide-react (icons)
- jsPDF (PDF export)
- react-hot-toast (notifications)

## Project Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── Canvas/
│   │   ├── CanvasView.jsx     # react-konva stage
│   │   └── IconLayer.jsx      # SVG icon renderer
│   ├── Elements/
│   │   └── LeftSidebar.jsx    # Text, Icons, Background tabs
│   ├── Layers/
│   │   └── LayersPanel.jsx    # Layer list with controls
│   ├── Properties/
│   │   ├── RightSidebar.jsx   # Font, color, shadow, stroke
│   │   └── ColorPickerWidget.jsx
│   └── Header.jsx             # Canvas size, export, undo/redo
├── stores/
│   └── canvasStore.js         # Zustand store + history
└── utils/
    └── exportCanvas.js        # PNG/JPG/PDF export
```
