# Data Model

## Overview

The schema contains five main tables. The goal behind the design was to keep uploaded data traceable, make reviews mandatory before records are finalized, and ensure that every emission value can be traced back to its original source.

---

## Tables

### `Company`


id          UUID 
name        CharField
created_at  DateTimeField


We separated data at the company level because dashboards, uploads, and review queues should only show records belonging to the selected company. Every upload and emission record therefore stores a company reference. API endpoints filter using `company_id` so data from one company does not appear in another company’s views.

UUIDs were used instead of integer IDs because they are harder to enumerate and avoid exposing how much data exists in the system.

---

### `DataUpload`


id              UUID PK
company         FK → Company
source_type     CharField (SAP | UTILITY | TRAVEL)
file            FileField
uploaded_by     CharField
rows_processed  IntegerField
rows_failed     IntegerField
status          CharField
created_at      DateTimeField


Each upload is stored separately because analysts need to know when files were uploaded, who uploaded them, and whether processing succeeded or failed.

We keep upload history because files rarely process perfectly every time. If some rows fail while others succeed, the upload is marked as `PARTIAL_SUCCESS` rather than `COMPLETED`. This makes it easier to identify uploads that still need attention.

The original uploaded file path is also retained so parsers can reopen files later if required.

---

### `EmissionRecord`

This is the main table used throughout the system. Each row represents one normalized activity record that is ready for emission calculations and analyst review.


id                   UUID PK
company              FK → Company
upload               FK → DataUpload
source_type          CharField
scope                CharField
category             CharField
raw_data             JSONField
raw_quantity         CharField
raw_unit             CharField
activity_value       FloatField
activity_unit        CharField
normalization_notes  JSONField
confidence_score     FloatField (nullable)
parser_version       CharField
co2e_kg              FloatField
period_start         DateField
period_end           DateField
review_status        CharField
reviewer_name        CharField
reviewer_notes       TextField
reviewed_at          DateTimeField
is_edited            BooleanField
edited_at            DateTimeField
source_row_id        CharField
is_locked            BooleanField
flag_reason          TextField
created_at           DateTimeField


This table exists because uploaded files come in very different formats. SAP exports, utility bills, and travel files all look different, so we normalize them into a common structure that dashboards and review workflows can use.

### Source Tracking

Each record stores an upload reference and a source row identifier so records can always be traced back to the original file.

If the same file is uploaded again, duplicate rows are prevented using a unique constraint on upload and source row identifiers.

### Keeping Raw Values

We store the original row data inside `raw_data` and keep original quantities and units before normalization. This makes debugging easier because reviewers can compare normalized values with what actually appeared in the source file.

### Normalization Notes

Parsers add notes whenever something unusual happens during processing.

Examples:

* Unknown plant codes
* Missing fields
* Multiple possible matches
* Fallback assumptions

These notes help reviewers understand why records may need attention without looking at parser code.

### Confidence Score

Confidence scoring is only used for PDF utility extraction because PDF parsing is not always deterministic.

SAP and travel imports generally either succeed or fail explicitly, so confidence scoring was unnecessary there.

### Scope and Category

Scopes are assigned according to source type.

* SAP fuel usage → Scope 1
* Utility electricity → Scope 2
* Travel → Scope 3

Categories store more specific information such as fuel type, travel class, or electricity usage.

### Review and Lock Workflow

New records begin as `PENDING`.

Reviewers can approve or reject records.

Approved records become locked so they cannot accidentally change afterward.

This ensures emission numbers used in dashboards cannot silently change after review.

### Indexing

Indexes were added to fields frequently used in filtering and dashboard queries.

The most common query paths are:

* Company dashboard queries
* Review queue queries
* Upload lookups

---

### `FailedRow`


id             UUID 
upload         FK → DataUpload
row_number     IntegerField
error_message  TextField
raw_content    JSONField
created_at     DateTimeField


When parsers fail on individual rows, the row is stored here instead of being discarded.

Keeping failed rows makes troubleshooting easier because analysts can immediately see:

* Which row failed
* Why it failed
* What original data caused the issue

---

### `AuditLog`


id               UUID
emission_record  FK (nullable)
action           CharField
performed_by     CharField
notes            TextField
created_at       DateTimeField

Audit logs store review actions and important changes.

Whenever a reviewer approves or rejects a record, an audit entry is created with timestamps and reviewer information.
The relationship to emission records is nullable because future audit events may not always belong to a specific record.

---

# Design Decisions

### Why not create a separate raw table?

Keeping raw and normalized data together reduces joins when reviewers open records.

A separate table would have been cleaner from a normalization perspective, but it would have made review queries more complicated.

### Why store usernames as strings?

Authentication is not part of this prototype.

Using strings allowed reviewer names and uploader names to be stored without building a full authentication system first.

### Why use FloatField for emissions?

Emission factors themselves are approximations, so storing very high precision numbers does not necessarily improve accuracy.

Values can always be rounded during reporting.

### Why store periods instead of months?

Not every source follows calendar months.

Utility bills often span multiple months, SAP records may represent single-day events, and travel records can have different start and end dates.

Using date ranges preserves this information instead of forcing everything into monthly buckets.
