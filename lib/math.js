export const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

export const vecDot = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

export const vecLength = v => Math.sqrt(vecDot(v, v));

export const vecCross = (v1, v2) => v1.x * v2.y - v1.y * v2.x;

export const vecAngleTo = (v1, v2) => {
  Math.acos(vecDot(v1, v2) / (vecLength(v1) * vecLength(v2)));
};

export const vecAngle = v1 => -Math.atan2(-v1.y, v1.x);

export const vecFromAngle = radians => ({
  x: Math.cos(radians),
  y: Math.sin(radians),
});

export const toRadians = angle => angle * (Math.PI / 180);

export const fromRadians = radians => radians * (180 / Math.PI);
