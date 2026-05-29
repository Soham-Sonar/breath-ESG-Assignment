// components/Shared.jsx
import { useState } from "react";

// ── Status Badge ───────────────────────────────────────────
const STATUS_CLASS = {
  PENDING:    "badge-pending",
  APPROVED:   "badge-approved",
  REJECTED:   "badge-rejected",
  FLAGGED:    "badge-flagged",
  SUCCESS:    "badge-success",
  COMPLETED:  "badge-success",   // backend uses COMPLETED not SUCCESS
  FAILED:     "badge-failed",
  PROCESSING: "badge-processing",
};

const STATUS_LABEL = {
  PENDING:    "Pending",
  APPROVED:   "Approved",
  REJECTED:   "Rejected",
  FLAGGED:    "Flagged",
  SUCCESS:    "Success",
  COMPLETED:  "Completed",
  FAILED:     "Failed",
  PROCESSING: "Processing",
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_CLASS[status] || "badge-pending"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// ── Scope Badge ────────────────────────────────────────────
// Backend sends scope as "SCOPE_1", "SCOPE_2", "SCOPE_3" strings
// OR as integers 1, 2, 3 — handle both
const SCOPE_CLASS = {
  1: "badge-s1", "SCOPE_1": "badge-s1",
  2: "badge-s2", "SCOPE_2": "badge-s2",
  3: "badge-s3", "SCOPE_3": "badge-s3",
};

const SCOPE_LABEL = {
  1: "Scope 1", "SCOPE_1": "Scope 1",
  2: "Scope 2", "SCOPE_2": "Scope 2",
  3: "Scope 3", "SCOPE_3": "Scope 3",
};

export function ScopeBadge({ scope }) {
  return (
    <span className={`badge ${SCOPE_CLASS[scope] || "badge-s1"}`}>
      {SCOPE_LABEL[scope] || `Scope ${scope}`}
    </span>
  );
}

// ── Row class for table color coding ──────────────────────
export function getRowClass(status) {
  if (status === "FLAGGED")  return "row-flagged";
  if (status === "APPROVED") return "row-approved";
  if (status === "REJECTED") return "row-rejected";
  return "";
}

// ── Approve / Reject Modal ─────────────────────────────────
export function ReviewModal({ record, action, onConfirm, onClose }) {
  const [notes, setNotes] = useState("");
  const isApprove = action === "APPROVED";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          {isApprove ? "✓ Approve Record" : "✗ Reject Record"}
        </div>
        <div className="modal-sub">
          {record.source_row_id || record.id} · {record.category} · {record.co2e_kg} kg CO₂e
          <br />
          Add a note for the audit trail (optional)
        </div>
        {/* Flag reason warning */}
        {record.flag_reason && (
          <div style={{
            background: "rgba(245,158,11,0.08)",
            border: "0.5px solid rgba(245,158,11,0.3)",
            borderRadius: 6,
            padding: "8px 10px",
            fontSize: 12,
            color: "#d97706",
            marginBottom: 12,
          }}>
            ⚠️ Flagged: {record.flag_reason}
          </div>
        )}
        <textarea
          className="modal-textarea"
          placeholder={
            isApprove
              ? "e.g. Verified against invoice #12345..."
              : "e.g. Duplicate entry, already captured in Feb upload..."
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className={`btn ${isApprove ? "btn-approve" : "btn-reject"}`}
            onClick={() => onConfirm(record.id, action, notes)}
          >
            {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Formatters ─────────────────────────────────────────────
export function fmtCO2(v) {
  return (parseFloat(v) / 1000).toFixed(2) + " tCO₂e";
}

export function fmtDate(d) {
  return d ? d.substring(0, 10) : "—";
}

export function fmtNum(v) {
  return parseFloat(v).toLocaleString("en-IN", { maximumFractionDigits: 1 });
}
