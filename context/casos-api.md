# API Use Cases

- **CU_07 – Generate title request**
  - Persist new `Request` linked to `Title`, `RequestType`, and requesting graduate.
  - Initialize status history (`RequestStatusHistory`) and requirement instances (`RequestRequirementInstance`).
  - Update associated `Title` status to `In Process`.
  - Expose endpoint to create request and return identifier, timestamps, and initialized states.

- **CU_08 – Search titles to request**
  - Resolve graduate identity from authenticated user (`UserAccount` → `Graduate`/`Person`).
  - Query eligible titles (`Title`) tied to the graduate's study plans with status `Pending Request`.
  - Provide endpoint returning list with metadata (faculty, plan, request type).

- **CU_09 – Generate title expedition form**
  - Serve existing personal, contact, and graduate data for pre-fill (
    `Person`, `Contact`, `Graduate`).
  - Accept updates to the form and persist changes.
  - Trigger PDF generation request once data is confirmed.

- **CU_10 – Complete requirements**
  - Fetch pending requirement instances for a request.
  - Receive uploads/metadata for requirement fulfillment, store file reference, timestamps,
    user IDs, and increment version.
  - Update current requirement instance status and stage metadata.

- **CU_11 – Generate PDF file**
  - Aggregate finalized form data and requirement artifacts.
  - Produce PDF or orchestrate generation service, store file pointer, and return access URL.

- **CU_12 – Search mandatory requirements**
  - Retrieve obligations by request type from `RequestTypeRequirement` and `Requirement`.
  - Provide comprehensive list including descriptions and compliance flags.

- **CU_13 – Search pending requirements to upload**
  - Identify pending items by request, stage, and user control level.
  - Return prioritized list with status, version, and deadlines if any.

- **CU_14 – Search pending requirements to verify**
  - Match verifier control level to stages (`ProcessStage`) to find reviewable items.
  - Return dataset for verification queues.

- **CU_15 – Verify requirement**
  - Accept approval or rejection decisions with optional rejection reasons.
  - Update requirement instance status, create verification history entry, and
    fire notification workflow hook.

- **CU_16 – Get requirement status data**
  - Aggregate each requirement’s latest instance state for a request.
  - Provide endpoint summarizing compliance progress and overall request status.

- **CU_17 – Evaluate request status**
  - Apply business rules to determine new request status based on aggregated
    requirement states.
  - Expose service used internally after verification or completion events.

- **CU_18 – Update request status**
  - Compare new vs current status, append history entry, and persist changes in `Request`.
  - Notify stakeholders when transitions occur.

- **CU_19 – Search requests**
  - Provide filtering endpoints by ID, document number, status, type, or date range.
  - Support pagination and sorting for administrative dashboards.

- **CU_23 – Remedy requirements**
  - Allow user to re-upload artifacts for rejected requirements.
  - Reset instance state to pending review, increment compliance version, and log reason.

## Cross-cutting API considerations

- **Authentication & authorization**: Enforce role-based access via `UserAccount`,
  `ControlLevel`, and `UserRole` mapping.
- **Notifications**: Integrate with notification subsystem when requirement or request
  states change.
- **Audit trails**: Maintain history tables (`RequestStatusHistory`, `RequirementVerificationHistory`)
  for traceability across all interactions.
