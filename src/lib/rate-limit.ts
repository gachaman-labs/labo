// 단순 메모리 기반 제한. 서버리스 인스턴스마다 따로 동작하므로 어디까지나 1차 방어이다.
// 트래픽이 늘면 Upstash 등 외부 저장소 기반으로 교체할 것.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
