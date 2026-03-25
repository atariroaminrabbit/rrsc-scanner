# RRSC Scanner — Product Spec

**Version:** 0.2 (Draft)
**Author:** CTO
**Last Updated:** 2026-03-23

---

## 1. Overview

The RRSC Scanner is a standalone internal staff-facing check-in app for RoaminRabbit Social Club events. It replaces the current manual process (showing a registration ID + ticking off a CSV) with a QR code scanning flow that automates attendee check-in and syncs entry data back to the RoaminRabbit ERP in real time.

---

## 2. Background

The RoaminRabbit Social Club (RRSC) is a community platform that hosts curated travel events. Each registered attendee receives a unique registration ID (currently displayed in the RoaminRabbit app). At present, check-in is handled manually by registration staff cross-referencing a CSV export from the ERP.

As events scale to potentially thousands of attendees, this process does not hold up. The RRSC Scanner solves this.

---

## 3. Users


| User                       | Description                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Registration PIC (Primary) | RoaminRabbit staff assigned to an event's check-in booth. Uses the scanner app on their personal iOS or Android phone. |
| Event Manager (ERP-side)   | RoaminRabbit internal team member who configures events, assigns staff, and monitors check-in data via the ERP.        |


---

## 4. Platform

- **iOS** and **Android**
- Staff use personal phones
- **Recommended framework: Cross-platform (React Native or Flutter)**
  - Rationale: Building two separate native apps doubles build and maintenance cost for an internal tool. Cross-platform is the right call here.
  - ⚠️ **Open question for developers:** Please confirm preferred cross-platform framework based on team expertise before development begins.

---

## 5. Core Features

### 5.1 Staff Authentication & Onboarding

**Invitation flow:**

1. An Event Manager on the ERP assigns a staff member to an event and specifies their role (e.g. Registration PIC)
2. The staff member receives an **email invitation** from RoaminRabbit Events Admin
3. The email contains a deep link that opens the scanner app (or prompts to download it if not installed)
4. The staff member logs into the scanner app using their **email and an auto-generated password** provided in the invite
5. ⚠️ Deep-link handling from email to app requires careful implementation on both iOS and Android

**Login:**

- Staff log in with email + auto-generated password (issued via invite)
- Credentials are separate from the staff member's personal RoaminRabbit account
- The app only surfaces events the logged-in staff member has been assigned to

**Multi-event assignment:**

- A staff member can be assigned to multiple events simultaneously
- The app must handle this gracefully (see Section 5.2)

### 5.2 Event Selection & Navigation

**Active event context (header):**

- Upon login, the app defaults to showing the **nearest upcoming event** the staff member is assigned to
- The header displays:
  - Event name (tappable — opens the event switcher drawer)
  - Date and time of the event
  - Location of the event
  - Event status badge: `Upcoming` / `Active` / `Expired`
  - The staff member's assigned role for this event (e.g. "Registration PIC")

**Event switcher drawer:**

- Tapping the event name in the header opens a bottom drawer
- The drawer lists all events the staff member is assigned to, each showing event name and status
- Staff can tap any event to switch context
- The bottom of the drawer contains a **Log Out** option

**Bottom navigation bar (3 items):**


| Item      | Icon/Type                       | Description                                                         |
| --------- | ------------------------------- | ------------------------------------------------------------------- |
| Attendees | Tab                             | Default landing page. Shows the attendee list for the active event. |
| Scan      | Floating action button (centre) | Opens the QR scanner view                                           |
| Dashboard | Tab                             | Shows check-in stats and sync status for the active event           |


### 5.3 Attendees Tab (Default View)

- Lists all attendees registered for the currently active event
- **Primary identifier shown: Registration ID** (attendee name is secondary)
- Each row shows:
  - Registration ID
  - Attendee name
  - Check-in status: `Not Yet Checked In` / `Checked In`
- List updates in real time as scans are logged (online) or as the local cache refreshes
- Tapping any row navigates to the **Attendee Detail Screen** (see 5.3.1)
- ⚠️ For events with thousands of attendees, this list must be performant — consider pagination or virtual scrolling

### 5.3.1 Attendee Detail Screen

Accessible by tapping any attendee row in the Attendees tab.

**Displays:**

- Registration ID (primary identifier, displayed prominently)
- Attendee name
- Check-in status badge: `Checked In` / `Not Yet`
- Total entry count — number of times this attendee has been scanned in (e.g. "Checked in 2 times")

**Manual Check-In Button:**

- Visible for all attendees regardless of current check-in status
- Tapping triggers the same check-in logic as the QR scanner
- Multi-entry is supported — repeated check-ins increment the entry count
- Result is reflected inline on the screen immediately
- Phase 7: triggers the same ERP write API call as the scanner

**Out of scope (v1):**

- Editing attendee details
- Removing or voiding a check-in

### 5.4 QR Code Scanning

- Accessed via the floating **Scan** button in the bottom navigation bar
- The scanner view has two modes, toggled by the staff member:
  1. **QR Scanner (default)** — Staff point their camera at an attendee's QR code (displayed in the RoaminRabbit app)
  2. **Manual Entry** — Staff type in the attendee's unique registration ID shown on their app (input box)
- The QR code encodes the attendee's unique registration ID
- On scan or manual entry, the app calls the ERP API to validate the registration ID against the active event's attendee list

**Scan result states:**


| State                    | Behaviour                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Valid — first entry      | Clear visual + audio confirmation. Displays attendee name + registration ID. Logs entry to ERP.                    |
| Valid — re-entry         | Same confirmation as first entry. Logs additional entry to ERP. No blocking.                                       |
| Invalid — not registered | Error state displayed. Staff prompted to try manual entry of the unique registration ID before concluding invalid. |
| Invalid — QR unreadable  | Prompt staff to switch to manual entry mode and ask attendee for their registration ID.                            |
| Offline                  | Validated against local cache. Scan queued for ERP sync. Visual indicator shown to staff that device is offline.   |


- **Multi-entry:** All events are multi-entry. Each scan logs a new entry event. There is no blocking on repeat scans for the same attendee.

### 5.5 Dashboard Tab

**Event-level stats (all staff):**

- Last sync timestamp to the ERP API
- Total registered attendees for the event
- Total attendees checked in at least once
- Remaining attendees not yet checked in
- Check-in rate (checked in / total, displayed as percentage or ratio)

**Personal stats (logged-in staff member only):**

- Total check-ins performed by this staff member for the active event
- This staff member's proportion of total check-ins (e.g. "You've checked in 42 of 310 total check-ins")

### 5.6 Offline Mode

- If the venue has poor or no connectivity, the app must continue to function
- **Strategy:**
  - On event load (or periodically while online), the app pre-fetches and caches the full attendee list locally on the device
  - Scans made while offline are queued locally and synced to the ERP when connectivity is restored
  - Because registrations can happen mid-event (registration closes only when the event ends), the local cache can go stale — the app should re-sync the attendee list periodically when online (e.g. every 30 seconds)
- ⚠️ **Engineering note:** The offline queue must handle write conflicts gracefully (e.g. two staff scanning the same QR simultaneously). For now, all scans are logged — duplicate entries from simultaneous scans are an accepted edge case and noted for future improvement (see Section 8).

### 5.7 Re-Entry Tracking

- All events are multi-entry (no exit booth)
- Each scan by any staff member is recorded as an individual entry event
- The ERP must reflect total entry count per attendee per event
- Example: Attendee scans in at 7pm, leaves, scans back in at 9pm — ERP shows 2 entries

### 5.8 ERP Sync

- All check-in data (attendee ID, timestamp, entry count, scanning staff member) syncs back to the ERP
- The ERP registration list for an event must reflect real-time check-in status and entry count

---

## 6. ERP Requirements (Must Be Built)

The following ERP features need to be built alongside or before the scanner app backend integration:


| Feature                     | Description                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Registration validation API | Endpoint that accepts a registration ID + event ID and returns attendee name, registration ID, and validity status |
| Check-in write API          | Endpoint to log a check-in event (attendee ID, event ID, timestamp, staff ID)                                      |
| Attendee list sync API      | Endpoint to fetch the full attendee list for an event (used for offline cache pre-load and periodic refresh)       |
| Event team management page  | ERP UI to assign staff to events and define roles (e.g. Registration PIC)                                          |
| Staff invitation flow       | Invite staff via email with a deep link; staff accept and log in with their auto-generated credentials             |
| Re-entry count tracking     | ERP stores and displays total entry count per attendee per event                                                   |


⚠️ **Open question for developers:** The ERP tech stack is currently unconfirmed. Please confirm the backend framework and API architecture before finalising the integration plan. The scanner app frontend can be built first against mock APIs and integrated once the ERP endpoints are ready.

---

## 7. Connectivity & Sync Strategy


| State       | Behaviour                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| Online      | Real-time API validation on every scan. Attendee list refreshed every 30s to catch mid-event registrations. |
| Offline     | Scans validated against locally cached attendee list. Scan events queued locally.                           |
| Back online | Queued scan events flushed to ERP. Attendee list re-synced immediately.                                     |


---

## 8. Known Edge Cases & Future Improvements


| Edge Case                                       | Current Handling                             | Future Improvement                                                  |
| ----------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| Two staff scan the same QR simultaneously       | Both scans are logged (accepted for now)     | Detect and flag duplicate scans within a short time window          |
| Attendee shares QR code with another person     | Not handled — out of scope for v1            | Investigate QR invalidation after first scan or time-bound QR codes |
| Mid-event registration while scanner is offline | New registrant may not appear in local cache | Alert staff that cached list may be stale; prompt manual re-sync    |


---

## 9. Success Metrics (Firebase Analytics)

The following events should be instrumented in Firebase:

- `scanner_app_opened` — Staff opens the app
- `event_selected` — Staff selects an event
- `qr_scan_success` — Valid QR scanned
- `qr_scan_invalid` — Invalid/unrecognised QR scanned
- `qr_scan_offline` — Scan validated against local cache (offline)
- `offline_queue_flushed` — Queued scans synced on reconnect

---

## 10. Open Questions


| #   | Question                                                                | Owner                     | Status  |
| --- | ----------------------------------------------------------------------- | ------------------------- | ------- |
| 1   | What cross-platform framework should be used — React Native or Flutter? | Developers                | Open    |
| 2   | What is the ERP backend tech stack?                                     | Developers / Backend Team | Open    |
| 3   | How will staff invitations be delivered — email, SMS, or both?          | Product                   | ✅ Email |
| 4   | Can a staff member be assigned to multiple events simultaneously?       | Product                   | ✅ Yes   |


---

## 11. Out of Scope (v1)

- Exit scanning / exit booth
- Attendee-facing features (this is a staff-only tool)
- Integration with payment or eSIM flows
- Advanced reporting or analytics within the scanner app beyond the Dashboard tab (full reporting is handled via ERP)

