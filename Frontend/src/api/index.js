// api/index.js

import axios from "axios";
import {
  mockSummary,
  mockRecords,
  mockUploads,
  mockFailedRows,
  mockCompanies,
} from "../mockData";

export const DEMO_MODE = false;                              
export const API_BASE =
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:8000/api";    

const client = axios.create({ baseURL: API_BASE });

// ── Companies ─────────────────────────────────────────────
// GET /api/companies/
// Response: [{ id, name }]
export async function fetchCompanies() {
  if (DEMO_MODE) return mockCompanies;
  const { data } = await client.get("/companies/");
  return data;
}

// ── Dashboard ─────────────────────────────────────────────
// GET /api/dashboard/?company_id=UUID
// Response: { summary: { total_records, pending, approved, rejected, flagged,
//                        scope1_total_kg, scope2_total_kg, scope3_total_kg },
//             records: [...] }
export async function fetchDashboard(companyId) {
  if (DEMO_MODE) {
    return {
      summary: mockSummary,
      records: mockRecords,
    };
  }
  const { data } = await client.get(`/dashboard/?company_id=${companyId}`);
  return data;  // { summary, records }
}

// ── Review single record ───────────────────────────────────
// POST /api/records/<id>/review/
// Body: { action: "APPROVE"|"REJECT", reviewer_name, notes }
// Response: { message }
export async function reviewRecord(recordId, action, notes, reviewerName) {
  if (DEMO_MODE) return { message: "ok" };

  // Backend uses "APPROVE"/"REJECT" — not "APPROVED"/"REJECTED"
  const backendAction = action === "APPROVED" ? "APPROVE" : "REJECT";

  const { data } = await client.post(`/records/${recordId}/review/`, {
    action:        backendAction,
    reviewer_name: reviewerName,
    notes,
  });
  return data;
}

// ── Bulk review ────────────────────────────────────────────
// POST /api/records/bulk-review/
// Body: { record_ids: [...], action, reviewer_name, notes }
// Response: { message }
export async function bulkReviewRecords(ids, action, reviewerName) {
  if (DEMO_MODE) return { message: `${ids.length} records updated` };

  const backendAction = action === "APPROVED" ? "APPROVE" : "REJECT";

  const { data } = await client.post("/records/bulk-review/", {
    record_ids:    ids,
    action:        backendAction,
    reviewer_name: reviewerName,
    notes:         "Bulk approved",
  });
  return data;
}

// ── Upload file ────────────────────────────────────────────
// POST /api/upload/   (multipart/form-data)
// Fields: file, source_type, company_id, uploaded_by
// Response: { message, processed, failed }
export async function uploadFile(sourceType, file, companyId, uploadedBy) {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1500));
    const results = { SAP: [4, 1], UTILITY: [6, 0], TRAVEL: [7, 1] };
    const [processed, failed] = results[sourceType] || [0, 0];
    return { message: "Upload successful", processed, failed };
  }

  const form = new FormData();
  form.append("file",        file);
  form.append("source_type", sourceType);
  form.append("company_id",  companyId);
  form.append("uploaded_by", uploadedBy);

  const { data } = await axios.post(`${API_BASE}/upload/`, form);
  // Response: { message, processed, failed }
  return data;
}

// ── Upload history ─────────────────────────────────────────
// GET /api/uploads/?company_id=UUID
// Response: [{ id, source_type, file, uploaded_by,
//              rows_processed, rows_failed, status, created_at }]
export async function fetchUploads(companyId) {
  if (DEMO_MODE) return mockUploads;
  const { data } = await client.get(`/uploads/?company_id=${companyId}`);
  return data;
}

// ── Failed rows ────────────────────────────────────────────
// GET /api/failed-rows/?upload_id=UUID
// Response: [{ id, row_number, error_message, raw_content, created_at }]
export async function fetchFailedRows(companyId) {
  if (DEMO_MODE) return mockFailedRows;

  const { data } = await client.get(
    `/failed-rows/?company_id=${companyId}`
  );

  return data;
}


export async function fetchAuditLogs(companyId) {
  const { data } = await client.get(`/audit-logs/?company_id=${companyId}`);
  return data;
}