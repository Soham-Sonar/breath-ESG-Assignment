# Tradeoffs

These are some things I intentionally did not build because I wanted to prioritize the ingestion pipeline, review workflow, and core functionality.

---

## 1. Automatic Distance Calculation for Travel

Instead of calculating distances from airport codes, I require a `Distance_km` column in the travel CSV.

I skipped automatic distance calculation because it would require airport datasets, coordinate lookups, and additional logic for edge cases like missing codes or ground travel.

This means clients need distance values in their exports, but it kept the travel parser simpler and more reliable.

---

## 2. Authentication and Permissions

There is currently no authentication layer.

Reviewer names are entered manually and any user can upload or review records.

I skipped auth because building login flows, permissions, and company-level access control would take significant time without changing the core ingestion workflow.

The schema already stores reviewer and uploader information, so adding auth later should not require major changes.

---

## 3. Database-Managed Emission Factors

Emission factors are currently hardcoded inside parser files.

I skipped factor management because supporting multiple versions, sources, and yearly updates would require additional models and logic.

For a prototype, hardcoded factors made implementation faster while still allowing emissions to be calculated consistently.

Long term, factors should be stored separately and versioned properly.

---

Overall, the focus was on building:


Upload

↓

Normalize

↓

Review

↓

Audit
```

rather than solving every surrounding problem immediately.
