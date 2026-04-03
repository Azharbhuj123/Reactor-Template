import React, { useState, useRef, useEffect } from 'react';

const SWATCHES = [
  '#ffffff','#000000','#ef4444','#f59e0b','#22c55e',
  '#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f97316',
  '#7c6af7','#f76ac1','#10b981','#64748b','#1e1b4b',
];

export default function ColorPickerWidget({ color, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(color || '#ffffff');
  const ref = useRef(null);

  useEffect(() => {
    setHex(color || '#ffffff');
  }, [color]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleHex = (val) => {
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) onChange(val);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <p className="section-title">{label}</p>}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: color,
            border: '2px solid var(--border)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
        <input
          type="text" value={hex}
          onChange={e => handleHex(e.target.value)}
          style={{ flex: 1, fontFamily: 'monospace', fontSize: 12 }}
        />
        <input
          type="color" value={hex}
          onChange={e => { setHex(e.target.value); onChange(e.target.value); }}
          style={{ width: 32, height: 32, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 200,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10, padding: 10, marginTop: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minWidth: 180,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, marginBottom: 8 }}>
            {SWATCHES.map(s => (
              <button
                key={s}
                onClick={() => { onChange(s); setHex(s); setOpen(false); }}
                style={{
                  width: '100%', aspectRatio: '1', borderRadius: 5,
                  background: s, border: s === color ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <input
            type="color" value={hex}
            onChange={e => { setHex(e.target.value); onChange(e.target.value); }}
            style={{ width: '100%', height: 32, cursor: 'pointer', borderRadius: 6 }}
          />
        </div>
      )}
    </div>
  );
}
