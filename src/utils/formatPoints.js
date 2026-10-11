export function formatPoints(value) {
  const points = Number(value);

  if (!Number.isFinite(points)) {
    return "0";
  }

  return points.toLocaleString();
}

export function formatPercent(value) {
  const percent = Number(value);

  if (!Number.isFinite(percent)) {
    return "—";
  }

  return `${percent}%`;
}

export default formatPoints;