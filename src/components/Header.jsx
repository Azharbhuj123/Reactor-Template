import React, { useState } from 'react';
import { Undo2, Redo2, Download, ChevronDown, Monitor, Smartphone, Image, Video } from 'lucide-react';
import { CANVAS_PRESETS, useStore } from '../stores/canvasStore';
import { exportCanvas } from '../utils/exportCanvas';
import toast from 'react-hot-toast';

export default function Header({ stageRef }) {
  const { canvasWidth, canvasHeight, canvasPreset, setCanvas, undo, redo, canUndo, canRedo } = useStore();
  const [showPresets, setShowPresets] = useState(false);
  const [customW, setCustomW] = useState(canvasWidth);
  const [customH, setCustomH] = useState(canvasHeight);
  const [showExport, setShowExport] = useState(false);

  const handlePreset = (p) => {
    if (p.w) {
      setCanvas(p.w, p.h, p.name);
      setCustomW(p.w);
      setCustomH(p.h);
    }
    setShowPresets(false);
  };

  const handleExport = async (format) => {
    setShowExport(false);
    const toastId = toast.loading(`Exporting ${format.toUpperCase()}...`);
    try {
      await exportCanvas(stageRef, canvasWidth, canvasHeight, format);
      toast.success(`${format.toUpperCase()} exported!`, { id: toastId });
    } catch (e) {
      toast.error('Export failed', { id: toastId });
    }
  };

  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        height: 52,
      }}
      className="flex items-center px-4 gap-3 flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <img src="/logo.png" alt="" width={200} height={150} borderRadius={8} />
        {/* <span className="font-display font-bold text-sm tracking-wide">Brandrevam</span> */}
      </div>

      {/* Canvas Size Preset */}
      <div className="relative">
        <button
          className="btn btn-ghost text-xs"
          onClick={() => setShowPresets(!showPresets)}
        >
          <Monitor size={14} />
          {canvasPreset}
          <span style={{ color: 'var(--text-muted)' }}>{canvasWidth}×{canvasHeight}</span>
          <ChevronDown size={12} />
        </button>
        {showPresets && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, zIndex: 100,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 8, minWidth: 220,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {CANVAS_PRESETS.filter(p => p.w).map(p => (
              <button
                key={p.name}
                className="btn btn-ghost w-full justify-between text-xs"
                onClick={() => handlePreset(p)}
              >
                <span>{p.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{p.w}×{p.h}</span>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0 4px' }} />
            <div className="flex items-center gap-2 px-2 py-1">
              <input
                type="number" value={customW} min={100} max={4000}
                onChange={e => setCustomW(+e.target.value)}
                style={{ width: 70 }}
              />
              <span style={{ color: 'var(--text-muted)' }}>×</span>
              <input
                type="number" value={customH} min={100} max={4000}
                onChange={e => setCustomH(+e.target.value)}
                style={{ width: 70 }}
              />
              <button
                className="btn btn-primary text-xs px-2 py-1"
                onClick={() => { setCanvas(customW, customH, 'Custom'); setShowPresets(false); }}
              >Apply</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Undo/Redo */}
      <button
        className="btn btn-ghost"
        onClick={undo}
        disabled={!canUndo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={15} />
      </button>
      <button
        className="btn btn-ghost"
        onClick={redo}
        disabled={!canRedo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={15} />
      </button>

      {/* Export */}
      <div className="relative">
        <button className="btn btn-primary text-xs" onClick={() => setShowExport(!showExport)}>
          <Download size={14} />
          Export
          <ChevronDown size={12} />
        </button>
        {showExport && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, zIndex: 100,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 8, minWidth: 140,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {['png', 'jpg', 'pdf'].map(fmt => (
              <button
                key={fmt}
                className="btn btn-ghost w-full justify-start text-xs uppercase"
                onClick={() => handleExport(fmt)}
              >
                {fmt === 'png' && <Image size={13} />}
                {fmt === 'jpg' && <Image size={13} />}
                {fmt === 'pdf' && <Download size={13} />}
                Export {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
