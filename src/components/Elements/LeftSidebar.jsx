import React, { useState } from 'react';
import { Type, Box, Image, Palette, Layout, ChevronDown, Plus, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useStore, ICON_LIST, GOOGLE_FONTS } from '../../stores/canvasStore';
import ColorPickerWidget from '../Properties/ColorPickerWidget';

const TABS = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'icons', label: 'Icons', icon: Box },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'bg', label: 'Background', icon: Palette },
];

export default function LeftSidebar() {
  const [tab, setTab] = useState('text');
  const [iconSearch, setIconSearch] = useState('');
  const { addTextLayer, addIconLayer, addImageLayer, setBg, setBgGradient, bgColor, bgGradient } = useStore();

  const filteredIcons = ICON_LIST.filter(n =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <aside className="panel flex flex-col" style={{ width: 220, flexShrink: 0 }}>
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-all"
            style={{
              color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {/* TEXT TAB */}
        {tab === 'text' && (
          <div className="flex flex-col gap-2">
            <p className="section-title">Add Text</p>
            {[
              { label: 'Heading', size: 48, weight: 'bold', font: 'Syne' },
              { label: 'Subheading', size: 28, weight: '600', font: 'Syne' },
              { label: 'Body Text', size: 18, weight: 'normal', font: 'DM Sans' },
              { label: 'Caption', size: 13, weight: 'normal', font: 'DM Sans' },
            ].map(style => (
              <button
                key={style.label}
                onClick={() => {
                  const { layers } = useStore.getState();
                  const id = addTextLayer(60, 60 + layers.length * 60);
                  setTimeout(() => {
                    useStore.getState().updateLayerAndHistory(id, {
                      text: style.label,
                      fontSize: style.size,
                      fontWeight: style.weight,
                      fontFamily: style.font,
                    });
                  }, 10);
                }}
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text)',
                  fontFamily: style.font,
                  fontSize: Math.min(style.size / 2, 18),
                  fontWeight: style.weight,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
              >
                {style.label}
              </button>
            ))}
            <button
              className="btn btn-primary w-full justify-center mt-1 text-xs"
              onClick={() => addTextLayer(80, 80)}
            >
              <Plus size={13} /> Add Text Layer
            </button>
          </div>
        )}

        {/* ICONS TAB */}
        {tab === 'icons' && (
          <div className="flex flex-col gap-2">
            <p className="section-title">Lucide Icons</p>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="text" placeholder="Search icons..."
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                style={{ paddingLeft: 28, width: '100%' }}
              />
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6, maxHeight: 320, overflowY: 'auto',
            }}>
              {filteredIcons.map(name => {
                const Icon = LucideIcons[name];
                if (!Icon) return null;
                return (
                  <button
                    key={name}
                    title={name}
                    onClick={() => addIconLayer(name, 80, 80)}
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* IMAGES TAB */}
        {tab === 'images' && (
          <div className="flex flex-col gap-2">
            <p className="section-title">Upload Image</p>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const src = event.target?.result;
                  if (typeof src === 'string') {
                    const { layers } = useStore.getState();
                    addImageLayer(src, 200, 200, 60, 60 + layers.length * 60);
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <button
              className="btn btn-primary w-full justify-center text-xs"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Plus size={13} /> Upload Image
            </button>
            <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Drag and drop images onto the canvas or upload them here. You can resize, rotate, and reposition them just like icons.
            </p>
          </div>
        )}

        {/* BACKGROUND TAB */}
        {tab === 'bg' && (
          <div className="flex flex-col gap-3">
            <p className="section-title">Background Color</p>
            <ColorPickerWidget
              color={bgColor}
              onChange={setBg}
            />

            <p className="section-title mt-2">Quick Colors</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {[
                '#0f0f11','#1a1a2e','#16213e','#0d1117',
                '#1e1b4b','#134e4a','#4a044e','#1c1917',
                '#ffffff','#f8fafc','#fef9c3','#fce7f3',
                '#7c6af7','#f76ac1','#06b6d4','#22c55e',
                '#f59e0b','#ef4444','#ec4899','#8b5cf6',
                '#10b981','#3b82f6','#f97316','#64748b',
              ].map(c => (
                <button
                  key={c}
                  onClick={() => setBg(c)}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 6,
                    background: c,
                    border: bgColor === c ? '2px solid var(--accent)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            <p className="section-title mt-2">Gradient Presets</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[
                { stops: [{ color: '#7c6af7', offset: 0 }, { color: '#f76ac1', offset: 1 }], angle: 135, label: 'Violet Pink' },
                { stops: [{ color: '#06b6d4', offset: 0 }, { color: '#8b5cf6', offset: 1 }], angle: 135, label: 'Cyan Purple' },
                { stops: [{ color: '#22c55e', offset: 0 }, { color: '#06b6d4', offset: 1 }], angle: 135, label: 'Green Cyan' },
                { stops: [{ color: '#f59e0b', offset: 0 }, { color: '#ef4444', offset: 1 }], angle: 135, label: 'Amber Red' },
                { stops: [{ color: '#1a1a2e', offset: 0 }, { color: '#7c6af7', offset: 1 }], angle: 180, label: 'Dark Violet' },
                { stops: [{ color: '#134e4a', offset: 0 }, { color: '#0d1117', offset: 1 }], angle: 135, label: 'Forest Dark' },
              ].map((g, i) => (
                <button
                  key={i}
                  title={g.label}
                  onClick={() => setBgGradient({ type: 'linear', ...g })}
                  style={{
                    height: 40, borderRadius: 8, cursor: 'pointer',
                    background: `linear-gradient(${g.angle}deg, ${g.stops.map(s => s.color).join(', ')})`,
                    border: '2px solid var(--border)',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
