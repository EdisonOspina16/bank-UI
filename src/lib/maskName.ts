function maskPart(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '***';
  const visible = trimmed.slice(0, 3);
  const hiddenLen = Math.max(trimmed.length - 3, 1);
  return visible + '*'.repeat(hiddenLen);
}

export function maskFullName(firstName: string, lastName: string): string {
  return `${maskPart(firstName)} ${maskPart(lastName)}`;
}

export const HIDDEN_BALANCE = '*****';
