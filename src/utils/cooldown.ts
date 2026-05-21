interface CooldownData {
  timestamp: number;
  duration: number;
}

class CooldownManager {
  private cooldowns: Map<string, CooldownData> = new Map();

  apply(key: string, duration: number): void {
    this.cooldowns.set(key, {
      timestamp: Date.now(),
      duration,
    });
  }

  getRemainingTime(key: string): number {
    const data = this.cooldowns.get(key);
    if (!data) return 0;
    const remaining = data.timestamp + data.duration - Date.now();
    return Math.max(0, remaining);
  }

  isOnCooldown(key: string): boolean {
    const remaining = this.getRemainingTime(key);
    return remaining > 0;
  }

  clear(key: string): void {
    this.cooldowns.delete(key);
  }
}

export const cooldownManager = new CooldownManager();
export default cooldownManager;
