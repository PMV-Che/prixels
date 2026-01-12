export default function polygonize(path, numPoints, scale, translateX, translateY) {
  const length = path.getTotalLength();
  return window.d3range(numPoints).map(function(i) {
    const point = path.getPointAtLength(length * i / numPoints);
    return [point.x * scale + translateX, point.y * scale + translateY];
  });
}
