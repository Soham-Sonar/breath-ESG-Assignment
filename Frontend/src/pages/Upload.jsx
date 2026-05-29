// pages/Upload.jsx

import { useState } from "react";
import { uploadFile } from "../api";

const SOURCES = [
  {
    key:   "SAP",
    icon:  "🗄️",
    cls:   "upload-icon-sap",
    title: "SAP Fuel & Procurement",
    desc:  "Flat file export from SAP MM module. Required columns: Plant, Material, Quantity, Unit, Date (YYYYMMDD), Cost_Center, Document_No.",
    sample: [
      "Plant,Material,Quantity,Unit,Date,Cost_Center,Document_No",
      "1000,DIESEL,5000,L,20240115,CC-TRANSPORT,4500012345",
      "1000,PETROL,2000,L,20240120,CC-FLEET,4500012346",
      "2000,NATGAS,1200,M3,20240201,CC-FACILITY,4500012348",
    ],
  },
  {
    key:   "UTILITY",
    icon:  "⚡",
    cls:   "upload-icon-util",
    title: "Utility Electricity",
    desc:  "pdf file from utility portal (MSEDCL, BSES,etc). Required information: Account_Number, Meter_ID, kWh_Used, Start_Date, End_Date.",
    sample: [
      "Account_Number,Meter_ID,Facility_Name,kWh_Used,Start_Date,End_Date",
      "ACC-MUM-001,MTR-001,Mumbai HQ,45230,2024-01-01,2024-01-31",
      "ACC-MUM-002,MTR-002,Pune Plant,78450,2024-01-01,2024-01-31",
      "ACC-DEL-001,MTR-003,Delhi Office,12300,2024-01-01,2024-01-31",
    ],
  },
  {
    key:   "TRAVEL",
    icon:  "✈️",
    cls:   "upload-icon-travel",
    title: "Corporate Travel",
    desc:  "Concur/Navan CSV export. Required columns: Trip_ID, Employee_Name, Travel_Type, Origin_Code, Destination_Code, Distance_km, Class.",
    sample: [
      "Trip_ID,Travel_Type,Origin_Code,Destination_Code,Distance_km,Class",
      "T-2024-001,Flight,BOM,DEL,1148,Economy",
      "T-2024-003,Flight,DEL,LHR,6740,Business",
      "T-2024-004,Ground,MUM,PUNE,148,",
    ],
  },
];

// Single upload card component
function UploadCard({ source, companyId, onUploadComplete }) {
  const [fileName, setFileName]  = useState("");
  const [file, setFile]          = useState(null);
  const [status, setStatus]      = useState(null); // null | "loading" | { rows, failed } | "error"

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    setStatus(null);
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("loading");
    try {
      const result = await uploadFile(source.key, file, companyId, "analyst@breathe.com");
      setStatus({ rows: result.processed, failed: result.failed });
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="upload-card">
      {/* Icon + Title */}
      <div className={`upload-icon ${source.cls}`}>{source.icon}</div>
      <div className="upload-title">{source.title}</div>
      <div className="upload-desc">{source.desc}</div>

      {/* File selector */}
      <div
        className="file-drop"
        onClick={() => document.getElementById(`file-${source.key}`).click()}
      >
        <div style={{ fontSize: 24 }}>📎</div>
        {fileName ? (
          <div className="file-drop-name">{fileName}</div>
        ) : (
          <>
            <div className="file-drop-text" style={{ marginTop: 6 }}>
              Click to select file
            </div>
            <div className="file-drop-text">or drag and drop</div>
          </>
        )}
      </div>
<input
  type="file"

  id={`file-${source.key}`}

  accept={

    source.key === "UTILITY"

      ? ".csv,.pdf"

      : ".csv"

  }

  style={{ display: "none" }}

  onChange={handleFileChange}
/>

      {/* Upload result message */}
      {status === "loading" && (
        <div className="upload-result loading">⏳ Uploading and parsing...</div>
      )}
      {status === "error" && (
        <div className="upload-result error">
          ❌ Upload failed. Check that your file matches the expected format.
        </div>
      )}
      {status && typeof status === "object" && (
        <div className="upload-result success">
          ✅ {status.rows} rows processed
          {status.failed > 0 && ` · ${status.failed} failed`}
          {" "}· queued for review
        </div>
      )}

      {/* Upload button */}
      <button
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
        onClick={handleUpload}
        disabled={!file || status === "loading"}
      >
        {status === "loading" ? "Uploading..." : "Upload & Process"}
      </button>
    </div>
  );
}

export default function Upload({ companyId, onUploadComplete }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
        Upload CSV files from each data source. Rows are automatically parsed,
        normalized, and queued for analyst review.
      </p>

      {/* 3 Upload cards */}
      <div className="upload-grid">
        {SOURCES.map((s) => (
          <UploadCard key={s.key} source={s} companyId={companyId} onUploadComplete={onUploadComplete} />
        ))}
      </div>

      {/* Sample format reference */}

    </div>
  );
}
