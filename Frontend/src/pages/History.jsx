// pages/History.jsx

import { StatusBadge, fmtDate } from "../components/Shared";

const SOURCE_COLOR = {
  SAP:     "#059669",
  UTILITY: "#3b82f6",
  TRAVEL:  "#8b5cf6",
};

export default function History({ uploads }) {
  if (uploads.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <div>No uploads yet. Go to Upload Data to get started.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{uploads.length} upload{uploads.length !== 1 ? "s" : ""}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>File</th>
            <th>Uploaded By</th>
            <th>Date</th>
            <th>Processed</th>
            <th>Failed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((u) => (
            <tr key={u.id}>
              <td>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: SOURCE_COLOR[u.source_type] || "#64748b",
                  }}
                >
                  {u.source_type}
                </span>
              </td>
              <td className="mono text-xs text-muted">{u.file?.split("/").pop() || u.file}</td>
              <td className="text-muted text-sm">{u.uploaded_by}</td>
              <td className="text-muted text-sm">{fmtDate(u.created_at)}</td>
              <td style={{ color: "#059669", fontWeight: 600 }}>
                {u.rows_processed}
              </td>
              <td
                style={{
                  color: u.rows_failed > 0 ? "#dc2626" : "#94a3b8",
                  fontWeight: u.rows_failed > 0 ? 600 : 400,
                }}
              >
                {u.rows_failed}
              </td>
              <td>
                <StatusBadge status={u.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
