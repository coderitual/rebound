export const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

export const vecDot = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

export const vecSub = (v1, v2) => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

export const vecLength = v => Math.sqrt(vecDot(v, v));

export const vecFromAngle = radians => ({
  x: Math.cos(radians),
  y: Math.sin(radians),
});

export const vecMultScalar = (v1, scalar) => ({
  x: v1.x * scalar,
  y: v1.y * scalar,
});

// r=d−2(d⋅n)n
export const vecReflect = (v1, normal) => {
  const dot = vecDot(v1, normal);
  let result = vecMultScalar(normal, dot);
  result = vecMultScalar(result, 2);
  return vecSub(v1, result);
};

export const toRadians = angle => angle * (Math.PI / 180);
