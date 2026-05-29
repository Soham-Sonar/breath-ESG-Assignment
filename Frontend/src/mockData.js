// mockData.js — shapes match your real Django API exactly

export const mockSummary = {
  total_records:   29,
  pending:         20,
  approved:         5,
  rejected:         2,
  flagged:          2,
  scope1_total_kg: 2682677.0,   // backend field name
  scope2_total_kg:  209920.0,
  scope3_total_kg:    9461.4,
};

export const mockRecords = [
  {
    id: "r1", source_type: "SAP", scope: "SCOPE_1", category: "Diesel",
    period_start: "2024-01-15", period_end: "2024-01-15",
    activity_value: 5000, activity_unit: "L",
    co2e_kg: 13400, review_status: "PENDING", flag_reason: null,
  },
  {
    id: "r2", source_type: "SAP", scope: "SCOPE_1", category: "Petrol",
    period_start: "2024-01-20", period_end: "2024-01-20",
    activity_value: 2000, activity_unit: "L",
    co2e_kg: 4620, review_status: "PENDING", flag_reason: null,
  },
  {
    id: "r3", source_type: "SAP", scope: "SCOPE_1", category: "NatGas",
    period_start: "2024-02-15", period_end: "2024-02-15",
    activity_value: 1200, activity_unit: "M3",
    co2e_kg: 2448, review_status: "APPROVED", flag_reason: null,
  },
  {
    id: "r4", source_type: "UTILITY", scope: "SCOPE_2", category: "Electricity",
    period_start: "2024-01-01", period_end: "2024-01-31",
    activity_value: 45230, activity_unit: "kWh",
    co2e_kg: 37088, review_status: "FLAGGED", flag_reason: "Very high CO2",
  },
  {
    id: "r5", source_type: "UTILITY", scope: "SCOPE_2", category: "Electricity",
    period_start: "2024-01-01", period_end: "2024-01-31",
    activity_value: 78450, activity_unit: "kWh",
    co2e_kg: 64329, review_status: "FLAGGED", flag_reason: "Very high CO2",
  },
  {
    id: "r6", source_type: "UTILITY", scope: "SCOPE_2", category: "Electricity",
    period_start: "2024-01-01", period_end: "2024-01-31",
    activity_value: 12300, activity_unit: "kWh",
    co2e_kg: 10086, review_status: "PENDING", flag_reason: null,
  },
  {
    id: "r7", source_type: "TRAVEL", scope: "SCOPE_3", category: "Flight Economy",
    period_start: "2024-01-10", period_end: "2024-01-12",
    activity_value: 1148, activity_unit: "km",
    co2e_kg: 292.74, review_status: "PENDING", flag_reason: null,
  },
  {
    id: "r8", source_type: "TRAVEL", scope: "SCOPE_3", category: "Flight Business",
    period_start: "2024-01-20", period_end: "2024-01-27",
    activity_value: 6740, activity_unit: "km",
    co2e_kg: 5156.1, review_status: "APPROVED", flag_reason: null,
  },
  {
    id: "r9", source_type: "TRAVEL", scope: "SCOPE_3", category: "Ground Transport",
    period_start: "2024-01-22", period_end: "2024-01-22",
    activity_value: 148, activity_unit: "km",
    co2e_kg: 13.17, review_status: "REJECTED", flag_reason: null,
  },
  {
    id: "r10", source_type: "SAP", scope: "SCOPE_1", category: "Diesel",
    period_start: "2024-02-01", period_end: "2024-02-01",
    activity_value: 8000, activity_unit: "L",
    co2e_kg: 21440, review_status: "PENDING", flag_reason: null,
  },
];

export const mockUploads = [
  {
    id: "u1", source_type: "SAP",
    file: "/media/uploads/sap_fuel_jan2024.csv",
    uploaded_by: "analyst@breathe.com",
    rows_processed: 4, rows_failed: 1,
    status: "COMPLETED",
    created_at: "2024-01-28T09:15:00Z",
  },
  {
    id: "u2", source_type: "UTILITY",
    file: "/media/uploads/msedcl_jan2024.csv",
    uploaded_by: "analyst@breathe.com",
    rows_processed: 6, rows_failed: 0,
    status: "COMPLETED",
    created_at: "2024-01-28T09:22:00Z",
  },
  {
    id: "u3", source_type: "TRAVEL",
    file: "/media/uploads/concur_q1_2024.csv",
    uploaded_by: "analyst@breathe.com",
    rows_processed: 7, rows_failed: 1,
    status: "COMPLETED",
    created_at: "2024-01-28T09:30:00Z",
  },
];

export const mockFailedRows = [
  {
    id: "f1",
    row_number: 5,
    error_message: "No emission factor for material: LUBRICANT",
    raw_content: { Material: "LUBRICANT", Quantity: "50", Unit: "KG" },
    created_at: "2024-01-28T09:15:00Z",
  },
  {
    id: "f2",
    row_number: 7,
    error_message: "Missing distance — cannot compute CO2",
    raw_content: { Trip_ID: "TR007", Travel_Type: "Flight", Origin_Code: "BLR" },
    created_at: "2024-01-28T09:30:00Z",
  },
];

export const mockCompanies = [
  { id: "c1", name: "Breathe Demo Client" },
];
