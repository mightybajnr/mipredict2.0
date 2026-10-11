import { format } from "date-fns";

function toDate(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatKickoff(value) {
  const date = toDate(value);

  return date ? format(date, "EEE d MMM · HH:mm") : "—";
}

export function formatDate(value) {
  const date = toDate(value);

  return date ? format(date, "d MMM yyyy") : "—";
}

export function formatRelative(value) {
  const date = toDate(value);

  return date ? format(date, "d MMM yyyy · HH:mm") : "—";
}

export default formatKickoff;