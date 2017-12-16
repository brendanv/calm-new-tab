// @flow

export function getCurrentTimeDisplay(hour12?: boolean): string {
  return new Date().toLocaleString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  });
}

export function getCurrentDateDisplay(): string {
  return new Date().toLocaleString(navigator.language, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
