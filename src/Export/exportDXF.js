// src/export/exportDXF.js
export function exportDXF(boxParams) {
  const { volume, slotWidth, slotHeight } = boxParams;

  // Basic DXF string header
  let dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

  // Example rectangle for front baffle
  const width = parseFloat(slotWidth) || 40;
  const height = parseFloat(slotHeight) || 30;

  dxf += rectToDXF(0, 0, width, height);

  // End of DXF file
  dxf += `0\nENDSEC\n0\nEOF`;

  return dxf;
}

function rectToDXF(x, y, w, h) {
  return `0\nLINE\n8\n0\n10\n${x}\n20\n${y}\n30\n0.0\n11\n${x + w}\n21\n${y}\n31\n0.0
0\nLINE\n8\n0\n10\n${x + w}\n20\n${y}\n30\n0.0\n11\n${x + w}\n21\n${y + h}\n31\n0.0
0\nLINE\n8\n0\n10\n${x + w}\n20\n${y + h}\n30\n0.0\n11\n${x}\n21\n${y + h}\n31\n0.0
0\nLINE\n8\n0\n10\n${x}\n20\n${y + h}\n30\n0.0\n11\n${x}\n21\n${y}\n31\n0.0\n`;
}
