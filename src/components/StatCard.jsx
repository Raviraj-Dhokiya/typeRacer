export default function StatCard({ label, value, unit, cls }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${cls}`}>{value}</div>
      {unit && <div className="stat-unit">{unit}</div>}
    </div>
  )
}
