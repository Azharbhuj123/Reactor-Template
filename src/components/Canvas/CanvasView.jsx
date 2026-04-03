import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';
import { useStore } from '../../stores/canvasStore';
import IconLayer from './IconLayer';
import ImageLayer from './ImageLayer';

const PREVIEW_MAX = 560;

export default function CanvasView({ stageRef }) {
  const {
    canvasWidth, canvasHeight, bgColor, bgGradient,
    layers, selectedId, selectLayer, updateLayer, updateLayerAndHistory,
    addTextLayer, addImageLayer,
  } = useStore();
  const transformerRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const containerRef = useRef(null);

  const scale = Math.min(PREVIEW_MAX / canvasWidth, PREVIEW_MAX / canvasHeight, 1);
  const stageW = canvasWidth * scale;
  const stageH = canvasHeight * scale;

  useEffect(() => {
    const tr = transformerRef.current;
    if (!tr || !stageRef.current) return;
    const stage = stageRef.current;
    const node = stage.findOne('#' + selectedId);
    if (node) {
      tr.nodes([node]);
      tr.getLayer().batchDraw();
    } else {
      tr.nodes([]);
    }
  }, [selectedId, layers]);

  const handleStageClick = useCallback((e) => {
    if (e.target === e.target.getStage() || e.target.name() === 'bg-rect') {
      selectLayer(null);
      setEditingId(null);
    }
  }, [selectLayer]);

  const handleStageDblClick = useCallback((e) => {
    if (e.target === e.target.getStage() || e.target.name() === 'bg-rect') {
      const pos = stageRef.current.getRelativePointerPosition();
      addTextLayer(pos.x / scale, pos.y / scale);
    }
  }, [addTextLayer, scale]);

  const handleTextDblClick = useCallback((id) => {
    setEditingId(id);
    const layer = useStore.getState().layers.find(l => l.id === id);
    if (!layer) return;

    const stage = stageRef.current;
    const textNode = stage.findOne('#' + id);
    if (!textNode) return;

    const textPos = textNode.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    const ta = document.createElement('textarea');
    ta.value = layer.text;
    ta.style.cssText = `
      position:fixed;
      top:${stageBox.top + textPos.y}px;
      left:${stageBox.left + textPos.x}px;
      width:${Math.max(textNode.width() * scale + 20, 120)}px;
      min-width:120px;
      font-size:${layer.fontSize * scale}px;
      font-family:${layer.fontFamily};
      color:${layer.fill};
      background:rgba(0,0,0,0.85);
      border:2px solid #7c6af7;
      border-radius:4px;
      padding:4px;
      z-index:9999;
      outline:none;
      resize:both;
      overflow:hidden;
      line-height:${layer.lineHeight};
    `;
    document.body.appendChild(ta);
    ta.focus();
    ta.select();

    const finish = () => {
      if (document.body.contains(ta)) {
        updateLayerAndHistory(id, { text: ta.value });
        document.body.removeChild(ta);
      }
      setEditingId(null);
    };

    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); finish(); }
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); finish(); }
      e.stopPropagation();
    });
    ta.addEventListener('blur', finish, { once: true });
  }, [scale, updateLayerAndHistory]);

  const handleDragEnd = useCallback((id, e) => {
    updateLayerAndHistory(id, {
      x: e.target.x() / scale,
      y: e.target.y() / scale,
    });
  }, [scale, updateLayerAndHistory]);

  const handleTransformEnd = useCallback((id, e) => {
    const node = e.target;
    const updates = {
      x: node.x() / scale,
      y: node.y() / scale,
      rotation: node.rotation(),
    };
    if (node.width) updates.width = (node.width() * node.scaleX()) / scale;
    if (node.height) updates.height = (node.height() * node.scaleY()) / scale;
    node.scaleX(1);
    node.scaleY(1);
    updateLayerAndHistory(id, updates);
  }, [scale, updateLayerAndHistory]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer?.files;
    if (!files) return;
    
    for (let file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result;
        if (typeof src === 'string') {
          addImageLayer(src, 200, 200, 100 + Math.random() * 50, 100 + Math.random() * 50);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [addImageLayer]);

  const bgFillProps = bgGradient?.type === 'linear' ? {
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: {
      x: stageW * Math.cos((bgGradient.angle * Math.PI) / 180),
      y: stageW * Math.sin((bgGradient.angle * Math.PI) / 180),
    },
    fillLinearGradientColorStops: bgGradient.stops.flatMap(s => [s.offset, s.color]),
  } : { fill: bgColor };

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%',
        backgroundColor: dragOver ? 'rgba(124, 106, 247, 0.1)' : 'transparent',
        transition: 'background-color 0.2s',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{
        boxShadow: '0 0 0 1px #2e2e38, 0 25px 60px rgba(0,0,0,0.6)',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'crosshair',
      }}>
        <Stage
          ref={stageRef}
          width={stageW}
          height={stageH}
          onClick={handleStageClick}
          onDblClick={handleStageDblClick}
          style={{ display: 'block' }}
        >
          <Layer>
            <Rect
              name="bg-rect"
              x={0} y={0}
              width={stageW} height={stageH}
              {...bgFillProps}
              listening={true}
            />

            {layers.filter(l => l.visible).map(layer => {
              if (layer.type === 'text') {
                return (
                  <Text
                    key={layer.id}
                    id={layer.id}
                    x={layer.x * scale}
                    y={layer.y * scale}
                    text={layer.text}
                    fontSize={layer.fontSize * scale}
                    fontFamily={layer.fontFamily}
                    fontStyle={`${layer.fontStyle || 'normal'} ${layer.fontWeight || 'normal'}`}
                    fill={editingId === layer.id ? 'transparent' : layer.fill}
                    align={layer.align}
                    opacity={layer.opacity}
                    stroke={layer.strokeWidth > 0 ? layer.stroke : undefined}
                    strokeWidth={layer.strokeWidth * scale}
                    shadowColor={layer.shadowBlur > 0 ? layer.shadowColor : undefined}
                    shadowBlur={layer.shadowBlur}
                    shadowOffsetX={layer.shadowOffsetX}
                    shadowOffsetY={layer.shadowOffsetY}
                    letterSpacing={layer.letterSpacing}
                    lineHeight={layer.lineHeight}
                    rotation={layer.rotation || 0}
                    draggable={!layer.locked}
                    onClick={() => selectLayer(layer.id)}
                    onTap={() => selectLayer(layer.id)}
                    onDblClick={() => handleTextDblClick(layer.id)}
                    onDblTap={() => handleTextDblClick(layer.id)}
                    onDragEnd={(e) => handleDragEnd(layer.id, e)}
                    onTransformEnd={(e) => handleTransformEnd(layer.id, e)}
                  />
                );
              }
              if (layer.type === 'icon') {
                return (
                  <IconLayer
                    key={layer.id}
                    layer={layer}
                    scale={scale}
                    selected={selectedId === layer.id}
                    onSelect={() => selectLayer(layer.id)}
                    onDragEnd={(e) => handleDragEnd(layer.id, e)}
                    onTransformEnd={(e) => handleTransformEnd(layer.id, e)}
                  />
                );
              }
              if (layer.type === 'image') {
                return (
                  <ImageLayer
                    key={layer.id}
                    layer={layer}
                    scale={scale}
                    selected={selectedId === layer.id}
                    onSelect={() => selectLayer(layer.id)}
                    onDragEnd={(e) => handleDragEnd(layer.id, e)}
                    onTransformEnd={(e) => handleTransformEnd(layer.id, e)}
                  />
                );
              }
              return null;
            })}

            <Transformer
              ref={transformerRef}
              borderStroke="#7c6af7"
              borderStrokeWidth={1.5}
              anchorFill="#7c6af7"
              anchorStroke="#fff"
              anchorSize={8}
              keepRatio={false}
              rotateAnchorOffset={24}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
