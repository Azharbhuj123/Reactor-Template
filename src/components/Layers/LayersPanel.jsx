import React from 'react';
import { Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Trash2, Type, Box } from 'lucide-react';
import { useStore } from '../../stores/canvasStore';

export default function LayersPanel() {
  const {
    layers, selectedId, selectLayer,
    moveLayerUp, moveLayerDown, deleteLayer,
    toggleLayerVisibility, toggleLayerLock,
  } = useStore();

  const reversedLayers = [...layers].reverse();

  return (
    <div style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      height: 180,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '6px 12px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Layers ({layers.length})
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {reversedLayers.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
            No layers yet
          </div>
        )}
        {reversedLayers.map(layer => (
          <div
            key={layer.id}
            className={`layer-item ${selectedId === layer.id ? 'selected' : ''}`}
            onClick={() => selectLayer(layer.id)}
          >
            {/* Icon */}
            <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
              {layer.type === 'text' ? <Type size={12} /> : <Box size={12} />}
            </span>

            {/* Label */}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
              {layer.type === 'text' ? (layer.text?.slice(0, 18) || 'Text') : layer.iconName}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
              <button
                className="btn btn-ghost p-1"
                style={{ opacity: layer.visible ? 1 : 0.4 }}
                onClick={() => toggleLayerVisibility(layer.id)}
              >
                {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
              </button>
              <button
                className="btn btn-ghost p-1"
                style={{ opacity: layer.locked ? 1 : 0.4 }}
                onClick={() => toggleLayerLock(layer.id)}
              >
                {layer.locked ? <Lock size={11} /> : <Unlock size={11} />}
              </button>
              <button className="btn btn-ghost p-1" onClick={() => moveLayerUp(layer.id)}>
                <ChevronUp size={11} />
              </button>
              <button className="btn btn-ghost p-1" onClick={() => moveLayerDown(layer.id)}>
                <ChevronDown size={11} />
              </button>
              <button className="btn btn-ghost p-1" style={{ color: '#ef444480' }}
                onClick={() => deleteLayer(layer.id)}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
