export function gardenLayout(w, h, p) {
  const scale = Math.max(w / p.plateWidth, h / p.plateHeight);
  const bw = p.plateWidth * scale, bh = p.plateHeight * scale;
  const mobile = w < p.mobileAt;
  const ox = (w - bw) * (mobile ? p.mobileCropX : p.cropX), oy = (h - bh) / 2;
  const px = mobile ? Math.min(p.wheelPixels * scale, w * p.mobileWheelFit) : p.wheelPixels * scale;
  const x = mobile ? w * p.mobileWheelX : ox + bw * p.wheelX;
  const y = mobile ? h * p.mobileWheelY : oy + bh * p.wheelY;
  return {x, y, px, vars: {"--wheel-x": x, "--wheel-y": y, "--wheel-size": px * p.radius * 2.15,
    "--lamp-x": ox + bw * p.lampX, "--lamp-y": oy + bh * p.lampY,
    "--plate-w": bw, "--plate-h": bh, "--plate-x": ox, "--plate-y": oy}};
}
