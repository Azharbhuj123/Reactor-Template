import React, { useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import LeftSidebar from './components/Elements/LeftSidebar';
import RightSidebar from './components/Properties/RightSidebar';
import CanvasView from './components/Canvas/CanvasView';
import LayersPanel from './components/Layers/LayersPanel';
import { useStore } from './stores/canvasStore';

function loadGoogleFonts() {
  const GOOGLE_FONTS = [
    'Syne', 'DM+Sans', 'Playfair+Display', 'Bebas+Neue', 'Roboto+Slab',
    'Oswald', 'Montserrat', 'Raleway', 'Pacifico', 'Lobster',
    'Dancing+Script', 'Cinzel', 'Righteous', 'Alfa+Slab+One', 'Abril+Fatface',
    'Permanent+Marker', 'Comfortaa', 'Russo+One', 'Patua+One', 'Fredoka+One',
  ];
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(f => `family=${f}`).join('&')}&display=swap`;
  document.head.appendChild(link);
}

function Footer() {
  const { canvasWidth, canvasHeight, canvasPreset, layers, selectedId } = useStore();
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      height: 28,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 16,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        {canvasPreset} · {canvasWidth}×{canvasHeight}px
      </span>
      <span style={{ fontSize: 11, color: 'var(--border)' }}>|</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        {layers.length} layer{layers.length !== 1 ? 's' : ''}
      </span>
      {selectedId && (
        <>
          <span style={{ fontSize: 11, color: 'var(--border)' }}>|</span>
          <span style={{ fontSize: 11, color: 'var(--accent)' }}>
            Layer selected · Delete to remove
          </span>
        </>
      )}
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        Double-click canvas to add text · Ctrl+Z to undo
      </span>
    </footer>
  );
}

export default function App() {
  const stageRef = useRef(null);
  const { undo, redo } = useStore();

  useEffect(() => {
    loadGoogleFonts();

    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedId, deleteLayer } = useStore.getState();
        if (selectedId && document.activeElement === document.body) {
          deleteLayer(selectedId);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontSize: 13,
          },
        }}
      />

      <Header stageRef={stageRef} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftSidebar />

        <main style={{
          flex: 1,
          background: 'var(--canvas-bg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: 24 }}>
            <CanvasView stageRef={stageRef} />
          </div>
          <LayersPanel />
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
