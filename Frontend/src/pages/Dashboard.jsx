// pages/Dashboard.jsx

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { StatusBadge, ScopeBadge, fmtCO2, fmtDate } from "../components/Shared";

export default function Dashboard({ summary, records, loading, onNavigate }) {
  // Backend returns scope1_total_kg / scope2_total_kg / scope3_total_kg
  const s1 = ((parseFloat(summary.scope1_total_kg) || 0) / 1000).toFixed(1);
  const s2 = ((parseFloat(summary.scope2_total_kg) || 0) / 1000).toFixed(1);
  const s3 = ((parseFloat(summary.scope3_total_kg) || 0) / 1000).toFixed(1);

  const chartData = [
    { name: "Scope 1 (Fuel)",        value: parseFloat(s1), fill: "#059669" },
    { name: "Scope 2 (Electricity)", value: parseFloat(s2), fill: "#3b82f6" },
    { name: "Scope 3 (Travel)",      value: parseFloat(s3), fill: "#8b5cf6" },
  ];

  const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid-4">
        <div className="metric-card m-total">
          <div className="metric-label">Total Records</div>
          <div className="metric-value">{summary.total_records ?? "—"}</div>
          <div className="metric-sub">across all sources</div>
        </div>
        <div className="metric-card m-pending">
          <div className="metric-label">Pending Review</div>
          <div className="metric-value">{summary.pending ?? "—"}</div>
          <div className="metric-sub">awaiting analyst</div>
        </div>
        <div className="metric-card m-flagged">
          <div className="metric-label">Flagged</div>
          <div className="metric-value">{summary.flagged ?? "—"}</div>
          <div className="metric-sub">suspicious values</div>
        </div>
        <div className="metric-card m-approved">
          <div className="metric-label">Approved</div>
          <div className="metric-value">{summary.approved ?? "—"}</div>
          <div className="metric-sub">locked for audit</div>
        </div>
      </div>

      {/* Scope Totals */}
      <div className="grid-3">
        <div className="scope-card scope-1">
          <div className="scope-label">⬤ Scope 1 — Direct</div>
          <div className="scope-value">{s1} tCO₂e</div>
          <div className="scope-desc">Fuel combustion (diesel, petrol, gas)</div>
        </div>
        <div className="scope-card scope-2">
          <div className="scope-label">⬤ Scope 2 — Electricity</div>
          <div className="scope-value">{s2} tCO₂e</div>
          <div className="scope-desc">Grid electricity consumption</div>
        </div>
        <div className="scope-card scope-3">
          <div className="scope-label">⬤ Scope 3 — Travel</div>
          <div className="scope-value">{s3} tCO₂e</div>
          <div className="scope-desc">Business flights & ground transport</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Emissions by Scope (tCO₂e)</span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}t`}
              />
              <Tooltip
                formatter={(v) => [`${v} tCO₂e`, "Emissions"]}
                contentStyle={{
                  fontSize: 12,
                  border: "0.5px solid #e2e8f0",
                  borderRadius: 6,
                  boxShadow: "none",
                }}
              />
              <Bar dataKey="value" shape={<CustomBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Records */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Records</span>
          <button className="btn" onClick={() => onNavigate("review")}>
            View all →
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Scope</th>
              <th>Category</th>
              <th>Period</th>
              <th>CO₂e</th>
              <th>Status</th>
              <th>Flag Reason</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 6).map((r) => (
              <tr key={r.id}>
                {/* Backend: r.source_type (not r.upload.source_type) */}
                <td className="text-muted text-sm">{r.source_type}</td>
                {/* Backend: scope is "SCOPE_1" string */}
                <td>
                  <ScopeBadge scope={r.scope} />
                </td>
                <td style={{ textTransform: "capitalize" }}>
                  {r.category}
                </td>
                <td className="text-muted text-sm">{fmtDate(r.period_start)}</td>
                <td style={{ fontWeight: 500 }}>{fmtCO2(r.co2e_kg)}</td>
                <td><StatusBadge status={r.review_status} /></td>
                <td className="text-xs text-muted">{r.flag_reason || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
