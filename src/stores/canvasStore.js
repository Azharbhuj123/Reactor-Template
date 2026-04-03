import { create } from 'zustand';

const HISTORY_LIMIT = 20;

const defaultTextProps = {
  text: 'Double-click to edit',
  fontFamily: 'Syne',
  fontSize: 32,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fill: '#ffffff',
  align: 'left',
  opacity: 1,
  strokeWidth: 0,
  stroke: '#000000',
  shadowColor: '#000000',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  letterSpacing: 0,
  lineHeight: 1.2,
  draggable: true,
};

const defaultIconProps = {
  iconName: 'Star',
  fill: '#ffffff',
  opacity: 1,
  draggable: true,
};

const defaultImageProps = {
  imageSrc: null,
  opacity: 1,
  draggable: true,
};

let layerIdCounter = 1;
const newId = () => `layer_${Date.now()}_${layerIdCounter++}`;

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

export const useStore = create((set, get) => ({
  // Canvas config
  canvasWidth: 1080,
  canvasHeight: 1080,
  canvasPreset: 'Instagram Post',
  bgColor: '#1a1a2e',
  bgGradient: null,
  bgImage: null,

  // Layers
  layers: [],
  selectedId: null,

  // History
  history: [],
  historyIndex: -1,

  // UI state
  darkMode: true,

  // --- Canvas ---
  setCanvas: (w, h, preset) => {
    set({ canvasWidth: w, canvasHeight: h, canvasPreset: preset });
    get()._pushHistory();
  },

  setBg: (color) => {
    set({ bgColor: color, bgGradient: null });
    get()._pushHistory();
  },

  setBgGradient: (gradient) => {
    set({ bgGradient: gradient });
    get()._pushHistory();
  },

  setBgImage: (img) => {
    set({ bgImage: img });
    get()._pushHistory();
  },

  // --- Layer ops ---
  addTextLayer: (x = 100, y = 100) => {
    const id = newId();
    const layer = { id, type: 'text', x, y, rotation: 0, locked: false, visible: true, ...defaultTextProps };
    set(s => ({ layers: [...s.layers, layer], selectedId: id }));
    get()._pushHistory();
    return id;
  },

  addIconLayer: (iconName = 'Star', x = 100, y = 100) => {
    const id = newId();
    const layer = { id, type: 'icon', x, y, width: 80, height: 80, rotation: 0, locked: false, visible: true, ...defaultIconProps, iconName };
    set(s => ({ layers: [...s.layers, layer], selectedId: id }));
    get()._pushHistory();
    return id;
  },

  addImageLayer: (imageSrc, width = 200, height = 200, x = 100, y = 100) => {
    const id = newId();
    const layer = { id, type: 'image', x, y, width, height, rotation: 0, locked: false, visible: true, ...defaultImageProps, imageSrc };
    set(s => ({ layers: [...s.layers, layer], selectedId: id }));
    get()._pushHistory();
    return id;
  },

  updateLayer: (id, props) => {
    set(s => ({ layers: s.layers.map(l => l.id === id ? { ...l, ...props } : l) }));
  },

  updateLayerAndHistory: (id, props) => {
    set(s => ({ layers: s.layers.map(l => l.id === id ? { ...l, ...props } : l) }));
    get()._pushHistory();
  },

  deleteLayer: (id) => {
    set(s => ({
      layers: s.layers.filter(l => l.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
    get()._pushHistory();
  },

  selectLayer: (id) => set({ selectedId: id }),

  moveLayerUp: (id) => {
    set(s => {
      const idx = s.layers.findIndex(l => l.id === id);
      if (idx >= s.layers.length - 1) return s;
      const next = [...s.layers];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return { layers: next };
    });
    get()._pushHistory();
  },

  moveLayerDown: (id) => {
    set(s => {
      const idx = s.layers.findIndex(l => l.id === id);
      if (idx <= 0) return s;
      const next = [...s.layers];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return { layers: next };
    });
    get()._pushHistory();
  },

  toggleLayerVisibility: (id) => {
    set(s => ({ layers: s.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l) }));
  },

  toggleLayerLock: (id) => {
    set(s => ({ layers: s.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l) }));
  },

  duplicateLayer: (id) => {
    const orig = get().layers.find(l => l.id === id);
    if (!orig) return;
    const newLayer = { ...orig, id: newId(), x: orig.x + 20, y: orig.y + 20 };
    set(s => ({ layers: [...s.layers, newLayer], selectedId: newLayer.id }));
    get()._pushHistory();
  },

  // --- History ---
  _pushHistory: () => {
    const { layers, bgColor, bgGradient, bgImage, canvasWidth, canvasHeight, history, historyIndex } = get();
    const snapshot = cloneState({ layers, bgColor, bgGradient, bgImage, canvasWidth, canvasHeight });
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > HISTORY_LIMIT) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const snap = history[historyIndex - 1];
    set({ ...snap, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const snap = history[historyIndex + 1];
    set({ ...snap, historyIndex: historyIndex + 1 });
  },

  // These are plain getters called at render time
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  selectedLayer: () => {
    const { layers, selectedId } = get();
    return layers.find(l => l.id === selectedId) || null;
  },
}));

export const CANVAS_PRESETS = [
  { name: 'Instagram Post', w: 1080, h: 1080 },
  { name: 'Instagram Story', w: 1080, h: 1920 },
  { name: 'Banner', w: 1920, h: 1080 },
  { name: 'Thumbnail', w: 1280, h: 720 },
  { name: 'Custom', w: null, h: null },
];

export const GOOGLE_FONTS = [
  'Syne', 'DM Sans', 'Playfair Display', 'Bebas Neue', 'Roboto Slab',
  'Oswald', 'Montserrat', 'Raleway', 'Pacifico', 'Lobster',
  'Dancing Script', 'Cinzel', 'Righteous', 'Alfa Slab One', 'Abril Fatface',
  'Permanent Marker', 'Comfortaa', 'Russo One', 'Patua One', 'Fredoka One',
];

export const ICON_LIST = [
  'Star', 'Heart', 'Zap', 'Sun', 'Moon', 'Cloud', 'Flame', 'Diamond',
  'Crown', 'Trophy', 'Rocket', 'Music', 'Camera', 'Smile', 'Globe',
  'Leaf', 'Flower2', 'Sparkles', 'Shield', 'Lock', 'Key',
  'Compass', 'Anchor', 'Feather', 'Eye', 'Bell', 'Bookmark', 'Coffee',
  'Gift', 'Home', 'Map', 'Flag', 'MessageCircle', 'Phone', 'Mail',
  'Search', 'Settings', 'User', 'Users', 'Layers', 'Layout', 'Grid',
  'Circle', 'Square', 'Triangle', 'Hexagon', 'Octagon', 'Pentagon',
  'ArrowRight', 'ChevronRight', 'Plus', 'Minus', 'X', 'Check',
];
