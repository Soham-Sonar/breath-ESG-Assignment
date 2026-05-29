// pages/FailedRows.jsx

export default function FailedRows({ failedRows }) {
  if (failedRows.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <div>No failed rows — all data parsed successfully</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
        These rows could not be parsed. Fix the source file and re-upload,
        or manually correct the issue.
      </p>
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            {failedRows.length} failed row{failedRows.length !== 1 ? "s" : ""}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Row #</th>
              <th>Raw Content</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {failedRows.map((f) => (
              <tr key={f.id}>
                <td style={{ fontWeight: 600 }}>#{f.row_number}</td>
                <td>
                  {/* raw_content can be object or string from backend */}
                  <div
                    className="mono"
                    style={{
                      fontSize: 10, color: "#64748b",
                      background: "#f8fafc", padding: "5px 8px",
                      borderRadius: 4, maxWidth: 300,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                    title={
                      typeof f.raw_content === "object"
                        ? JSON.stringify(f.raw_content)
                        : f.raw_content
                    }
                  >
                    {typeof f.raw_content === "object"
                      ? JSON.stringify(f.raw_content)
                      : f.raw_content}
                  </div>
                </td>
                <td style={{ color: "#dc2626", fontSize: 12 }}>{f.error_message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
