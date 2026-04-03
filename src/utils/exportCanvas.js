import { jsPDF } from 'jspdf';

export async function exportCanvas(stageRef, canvasWidth, canvasHeight, format = 'png') {
  const stage = stageRef.current;
  if (!stage) throw new Error('No stage');

  // Current scale
  const currentScale = stage.width() / canvasWidth;

  // Temporarily scale up to full resolution
  stage.scale({ x: 1, y: 1 });
  stage.size({ width: canvasWidth, height: canvasHeight });
  stage.draw();

  try {
    const dataURL = stage.toDataURL({
      mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality: 1,
      pixelRatio: 1,
    });

    if (format === 'pdf') {
      const isLandscape = canvasWidth > canvasHeight;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvasWidth, canvasHeight],
      });
      pdf.addImage(dataURL, 'PNG', 0, 0, canvasWidth, canvasHeight);
      pdf.save('template-reactor-export.pdf');
    } else {
      const link = document.createElement('a');
      link.download = `template-reactor-export.${format}`;
      link.href = dataURL;
      link.click();
    }
  } finally {
    // Restore preview scale
    stage.scale({ x: currentScale, y: currentScale });
    stage.size({ width: canvasWidth * currentScale, height: canvasHeight * currentScale });
    stage.draw();
  }
}
