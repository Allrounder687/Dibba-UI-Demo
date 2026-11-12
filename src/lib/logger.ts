export type LogLevel = "info" | "warn" | "error" | "audit";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  actor?: string;
  meta?: Record<string, unknown>;
}

export function logEvent(
  level: LogLevel,
  event: string,
  meta?: Record<string, unknown>,
  actor?: string
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(actor ? { actor } : {}),
    ...(meta ? { meta } : {}),
  };

  const payload = JSON.stringify(entry);
  if (level === "error") {
    console.error(payload);
  } else if (level === "warn") {
    console.warn(payload);
  } else {
    console.log(payload);
  }
}
