// pages/Review.jsx

import { useState } from "react";
import {
  StatusBadge, ScopeBadge, ReviewModal,
  getRowClass, fmtCO2, fmtDate, fmtNum,
} from "../components/Shared";

const FILTERS = ["ALL", "PENDING", "FLAGGED", "APPROVED", "REJECTED"];

export default function Review({ records, onReview, onBulkApprove }) {
  const [filter, setFilter]     = useState("ALL");
  const [modal, setModal]       = useState(null); // { record, action }

  const filtered =
    filter === "ALL" ? records : records.filter((r) => r.review_status === filter);

  const pendingCount = records.filter((r) => r.review_status === "PENDING").length;

  function handleConfirm(recordId, action, notes) {
    onReview(recordId, action, notes);
    setModal(null);
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <div style={{ flex: 1, fontSize: 13, color: "#64748b" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""} shown
        </div>
        {pendingCount > 0 && (
          <button className="btn btn-approve" onClick={onBulkApprove}>
            ✓ Approve all pending ({pendingCount})
          </button>
        )}
      </div>

      <div className="card">
        {/* Filter Tabs */}
        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
              {f !== "ALL" && (
                <span style={{ marginLeft: 4, opacity: 0.6 }}>
                  ({records.filter((r) => r.review_status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <div>No records with this status</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Row ID</th>
                <th>Source</th>
                <th>Scope</th>
                <th>Category</th>
                <th>Activity</th>
                <th>CO₂e</th>
                <th>Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className={getRowClass(r.review_status)}>
                  <td className="mono text-xs text-muted">{r.source_row_id}</td>
                  <td className="text-sm">{r.source_type}</td>
                  <td><ScopeBadge scope={r.scope} /></td>
                  <td style={{ textTransform: "capitalize" }}>
                    {r.category.replace(/_/g, " ")}
                  </td>
                  <td className="text-sm">
                    {fmtNum(r.activity_value)} {r.activity_unit}
                  </td>
                  <td style={{ fontWeight: 600 }}>{fmtCO2(r.co2e_kg)}</td>
                  <td className="text-muted text-sm">{fmtDate(r.period_start)}</td>
                  <td><StatusBadge status={r.review_status} /></td>
                  <td>
                    {r.review_status === "APPROVED" ? (
                      <span className="locked-label">🔒 Locked</span>
                    ) : (
                      <div className="btn-row">
                        {r.review_status !== "APPROVED" && (
                          <button
                            className="btn btn-approve"
                            onClick={() => setModal({ record: r, action: "APPROVED" })}
                          >
                            ✓
                          </button>
                        )}
                        {r.review_status !== "REJECTED" && (
                          <button
                            className="btn btn-reject"
                            onClick={() => setModal({ record: r, action: "REJECTED" })}
                          >
                            ✗
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approve / Reject Modal */}
      {modal && (
        <ReviewModal
          record={modal.record}
          action={modal.action}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
