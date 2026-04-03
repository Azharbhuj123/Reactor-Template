import React, { useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';

function useImageData(src) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.onload = () => {
      if (!cancelled) setImg(image);
    };
    image.onerror = () => {
      console.error('Failed to load image:', src);
    };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);

  return img;
}

export default function ImageLayer({ layer, scale, onSelect, onDragEnd, onTransformEnd }) {
  const w = (layer.width || 200) * scale;
  const h = (layer.height || 200) * scale;
  const img = useImageData(layer.imageSrc);

  if (!img) return null;

  return (
    <KonvaImage
      id={layer.id}
      image={img}
      x={layer.x * scale}
      y={layer.y * scale}
      width={w}
      height={h}
      rotation={layer.rotation || 0}
      opacity={layer.opacity ?? 1}
      draggable={!layer.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}
