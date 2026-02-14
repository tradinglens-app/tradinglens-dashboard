// Pure utility functions for enum formatting — safe for client components.
// Server-only DB functions live in db-enums.service.ts

export function toLabel(value: string): string {
  return value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function toOptions(values: string[]) {
  return values.map((v) => ({ label: toLabel(v), value: v }));
}
