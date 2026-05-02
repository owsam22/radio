export default function SkeletonCard() {
  return (
    <div className="station-card" style={{ cursor: 'default' }}>
      <div className="station-thumb" style={{ background: 'var(--bg3)', animation: 'pulse 1.5s infinite' }}></div>
      <div className="station-info" style={{ flex: 1 }}>
        <div style={{ height: '14px', width: '60%', background: 'var(--bg4)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ height: '10px', width: '40%', background: 'var(--bg3)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
      </div>
      <div className="station-right">
        <div style={{ height: '16px', width: '24px', background: 'var(--bg3)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="stations-grid" style={{ overflow: 'hidden' }}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
