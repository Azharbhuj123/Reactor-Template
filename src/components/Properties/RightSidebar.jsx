import React from 'react';
import { Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import { useStore, GOOGLE_FONTS } from '../../stores/canvasStore';
import ColorPickerWidget from './ColorPickerWidget';

function Slider({ label, value, min, max, step = 1, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text)' }}>{typeof value === 'number' ? (step < 1 ? value.toFixed(2) : Math.round(value)) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
      <p className="section-title mb-2">{title}</p>
      {children}
    </div>
  );
}

export default function RightSidebar() {
  const { selectedId, layers, updateLayer, updateLayerAndHistory, deleteLayer, duplicateLayer } = useStore();
  const layer = layers.find(l => l.id === selectedId);

  const u = (props) => updateLayer(selectedId, props);
  const uh = (props) => updateLayerAndHistory(selectedId, props);

  if (!layer) {
    return (
      <aside className="panel flex flex-col items-center justify-center" style={{ width: 230, flexShrink: 0 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>✦</p>
          <p style={{ fontSize: 12 }}>Select a layer to edit its properties</p>
          <p style={{ fontSize: 11, marginTop: 6, color: 'var(--border)' }}>Double-click canvas to add text</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="panel flex flex-col" style={{ width: 230, flexShrink: 0 }}>
      {/* Layer actions */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {layer.type === 'text' ? '🔤' : '🎨'} {layer.type === 'text' ? layer.text?.slice(0, 16) : layer.iconName}
        </span>
        <button className="btn btn-ghost p-1" onClick={() => duplicateLayer(selectedId)} title="Duplicate">
          <Copy size={13} />
        </button>
        <button className="btn btn-ghost p-1" style={{ color: '#ef4444' }} onClick={() => deleteLayer(selectedId)} title="Delete">
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {/* TRANSFORM */}
        <Section title="Transform">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>X</span>
                <input type="number" value={Math.round(layer.x)} onChange={e => uh({ x: +e.target.value })} style={{ width: '100%' }} />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Y</span>
                <input type="number" value={Math.round(layer.y)} onChange={e => uh({ y: +e.target.value })} style={{ width: '100%' }} />
              </div>
            </div>
            <Slider label="Opacity" value={layer.opacity} min={0} max={1} step={0.01}
              onChange={v => u({ opacity: v })}
            />
            <Slider label="Rotation" value={layer.rotation || 0} min={-180} max={180}
              onChange={v => u({ rotation: v })}
            />
          </div>
        </Section>

        {/* TEXT SPECIFIC */}
        {layer.type === 'text' && (
          <>
            <Section title="Font">
              <div className="flex flex-col gap-2">
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Font Family</span>
                  <select value={layer.fontFamily} onChange={e => uh({ fontFamily: e.target.value })} style={{ width: '100%' }}>
                    {GOOGLE_FONTS.map(f => (
                      <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                    ))}
                  </select>
                </div>

                <Slider label="Size" value={layer.fontSize} min={8} max={200}
                  onChange={v => u({ fontSize: v })}
                />
                <Slider label="Line Height" value={layer.lineHeight} min={0.8} max={3} step={0.1}
                  onChange={v => u({ lineHeight: v })}
                />
                <Slider label="Letter Spacing" value={layer.letterSpacing} min={-5} max={30}
                  onChange={v => u({ letterSpacing: v })}
                />

                {/* Style buttons */}
                <div className="flex gap-1">
                  <button
                    className="btn btn-ghost flex-1 justify-center py-1"
                    style={{ background: layer.fontWeight === 'bold' ? 'var(--accent)' : '', color: layer.fontWeight === 'bold' ? '#fff' : '' }}
                    onClick={() => uh({ fontWeight: layer.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  ><Bold size={13} /></button>
                  <button
                    className="btn btn-ghost flex-1 justify-center py-1"
                    style={{ background: layer.fontStyle === 'italic' ? 'var(--accent)' : '', color: layer.fontStyle === 'italic' ? '#fff' : '' }}
                    onClick={() => uh({ fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  ><Italic size={13} /></button>
                  {[
                    { val: 'left', Icon: AlignLeft },
                    { val: 'center', Icon: AlignCenter },
                    { val: 'right', Icon: AlignRight },
                  ].map(({ val, Icon }) => (
                    <button
                      key={val}
                      className="btn btn-ghost flex-1 justify-center py-1"
                      style={{ background: layer.align === val ? 'var(--accent)' : '', color: layer.align === val ? '#fff' : '' }}
                      onClick={() => uh({ align: val })}
                    ><Icon size={13} /></button>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Fill Color">
              <ColorPickerWidget color={layer.fill} onChange={c => u({ fill: c })} />
            </Section>

            <Section title="Stroke">
              <ColorPickerWidget color={layer.stroke} onChange={c => u({ stroke: c })} />
              <div className="mt-2">
                <Slider label="Stroke Width" value={layer.strokeWidth} min={0} max={20}
                  onChange={v => u({ strokeWidth: v })}
                />
              </div>
            </Section>

            <Section title="Shadow">
              <ColorPickerWidget color={layer.shadowColor} onChange={c => u({ shadowColor: c })} />
              <div className="mt-2 flex flex-col gap-2">
                <Slider label="Blur" value={layer.shadowBlur} min={0} max={50}
                  onChange={v => u({ shadowBlur: v })}
                />
                <Slider label="Offset X" value={layer.shadowOffsetX} min={-30} max={30}
                  onChange={v => u({ shadowOffsetX: v })}
                />
                <Slider label="Offset Y" value={layer.shadowOffsetY} min={-30} max={30}
                  onChange={v => u({ shadowOffsetY: v })}
                />
              </div>
            </Section>
          </>
        )}

        {/* ICON SPECIFIC */}
        {layer.type === 'icon' && (
          <>
            <Section title="Icon Color">
              <ColorPickerWidget color={layer.fill} onChange={c => u({ fill: c })} />
            </Section>
            <Section title="Size">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>W</span>
                  <input type="number" value={Math.round(layer.width || 80)} onChange={e => uh({ width: +e.target.value })} style={{ width: '100%' }} />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>H</span>
                  <input type="number" value={Math.round(layer.height || 80)} onChange={e => uh({ height: +e.target.value })} style={{ width: '100%' }} />
                </div>
              </div>
            </Section>
          </>
        )}
      </div>
    </aside>
  );
}
