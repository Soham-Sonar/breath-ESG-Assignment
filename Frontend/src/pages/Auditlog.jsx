import { fmtDate } from "../components/Shared";

const ACTION_COLOR = {
  APPROVE: "#059669",
  REJECT:  "#dc2626",
  EDIT:    "#f59e0b",
  UPLOAD:  "#3b82f6",
};

export default function AuditLog({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div>No audit activity yet. Actions will appear here after records are reviewed.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{logs.length} audit entries</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Performed By</th>
            <th>Record ID</th>
            <th>Notes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>
                <span style={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: ACTION_COLOR[log.action] || "#64748b",
                }}>
                  {log.action}
                </span>
              </td>
              <td className="text-sm">{log.performed_by}</td>
              <td className="mono text-xs text-muted">
                {log.record_number || "—"}
              </td>
              <td className="text-sm text-muted">{log.notes || "—"}</td>
              <td className="text-muted text-sm">{fmtDate(log.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}