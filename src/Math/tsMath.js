// src/math/tsMath.js
export function calculateEnclosure(driver, box) {
  const Vas = parseFloat(driver.Vas);
  const Qts = parseFloat(driver.Qts);
  const Fs = parseFloat(driver.Fs);
  const Qes = parseFloat(driver.Qes);
  const Sd = parseFloat(driver.Sd) / 10000; // convert cm² to m²
  const Xmax = parseFloat(driver.Xmax) / 1000; // mm to meters
  const d = parseFloat(box.portDiameter) || 10; // cm
  const warnings = [];

  let Vb, Fb;
  if (box.type === "ported") {
    Vb = 15 * Math.pow(Qts, 2.87) * Vas;
    Fb = 0.42 * Fs * Math.pow(Qts, -0.9);
  } else if (box.type === "sealed") {
    Vb = Vas; // simplified, no Q adjustment
    Fb = null;
  } else {
    // Default
    Vb = Vas;
    Fb = Fs;
  }

  let Lv = null;
  if (Fb && box.type === "ported") {
    Lv = (23562.5 * Math.pow(d, 2)) / (Math.pow(Fb, 2) * Vb) - (0.732 * d);
  }

  // SPL & Velocity Curves
  const splCurve = [];
  const velocityCurve = [];
  for (let f = 10; f <= 200; f += 1) {
    const spl = 85 + 10 * Math.log10(Sd) + Math.random() * 0.5; // placeholder
    const velocity = (Sd > 0) ? (Math.abs(Math.sin(f / Fb)) * 20) : 0;

    splCurve.push({ freq: f, spl });
    velocityCurve.push({ freq: f, velocity });

    if (velocity > 17) warnings.push(`High port velocity at ${f} Hz`);
  }

  return { Vb, Fb, Lv, splCurve, velocityCurve, warnings };
}
// Extra calculation helpers (expandable for bandpass, etc.)

export function calcPorted(Vas, Qts, Fs, portDiameterCm) {
  const Vb = 15 * Math.pow(Qts, 2.87) * Vas;
  const Fb = 0.42 * Fs * Math.pow(Qts, -0.9);
  const Lv = (23562.5 * Math.pow(portDiameterCm, 2)) / (Math.pow(Fb, 2) * Vb) - (0.732 * portDiameterCm);
  return { Vb, Fb, Lv };
}

export function calcSealed(Vas) {
  // Basic sealed: Vb = Vas
  return { Vb: Vas, Fb: null, Lv: null };
}

export function calc4thOrder(Vas, Qts, Fs, Qes, portDiameterCm) {
  // Simple Butterworth approximation
  const QL = 7; // Loaded Q
  const Vb1 = Vas / QL * ((1 / Qes) - 1);
  const Vb2 = Vas / ((Qes * 0.707) - Qes);
  const Fc = Fs * Math.sqrt(1 + Vas / Vb1);
  const Fb = Math.sqrt(Fs * Fc);
  const Lv = (23562.5 * Math.pow(portDiameterCm, 2)) / (Math.pow(Fb, 2) * Vb2) - (0.732 * portDiameterCm);
  return { Vb1, Vb2, Fb, Lv };
}

export function calc6thOrderSeries(Vas, Qes, Fs, portDiameterCm) {
  const Vb1 = Vas / ((Qes) ** 2 - 1);
  const Vb2 = Vb1;
  const Fb = Fs;
  const Lv1 = (23562.5 * Math.pow(portDiameterCm, 2)) / (Math.pow(Fb, 2) * Vb1) - (0.732 * portDiameterCm);
  const Lv2 = (23562.5 * Math.pow(portDiameterCm, 2)) / (Math.pow(Fb, 2) * Vb2) - (0.732 * portDiameterCm);
  return { Vb1, Vb2, Fb, Lv1, Lv2 };
}

