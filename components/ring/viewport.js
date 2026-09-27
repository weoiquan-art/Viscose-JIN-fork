// Share the viewport split between CSS clipping, card fitting and pointer math.
export function ringViewport(width, height, p) {
  const mobile = width < p.mobileAt;
  return {
    mobile,
    navWidth: mobile ? p.mobileNavWidth : p.navWidth,
    navFront: mobile ? p.mobileNavFront : p.navFront,
    radius: mobile ? Math.min(width * p.mobileRadiusWidth, height * p.mobileRadiusHeight) : null,
    dpr: mobile ? p.mobileDpr : 2,
  };
}
