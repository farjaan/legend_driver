# Legend Driver App — Main Flow Specification

> **Version:** 0.0.1 · **Platform:** React Native (iOS / Android)  
> **Audience:** Product, QA, Backend, Mobile Engineering

---

## High-Level Flow

```
Login → Dashboard → Assigned Jobs → Booking Detail → Action (by type)
                                                          │
                    ┌─────────────────────────────────────┴──────────────────────────┐
                    │                                                                  │
              Self Drive Flow                                              Chauffeur Flow
    Vehicle Delivery → Inspection → Handover → Return Pickup          Accept → Arrive → Start → Complete
                    │                                                                  │
                    └──────────────────────────┬───────────────────────────────────────┘
                                               ↓
                          Earnings · Support · Profile · Documents · Settings
```

---

## 1. Splash Screen

| Area | Details |
|------|---------|
| **Purpose** | Brand entry, bootstrap, session restore |
| **UI** | App logo, app version, loading progress |
| **API** | `checkToken` · `fetchDriverProfile` · `fetchJobList` |
| **Logic** | Valid session → Dashboard · No session → Login |

**Implementation:** `src/features/splash/SplashScreen.tsx`

---

## 2. Login Screen

| Field / Control | Details |
|-----------------|---------|
| Mobile number | With country code picker |
| Send OTP | Primary CTA |
| Validation | Country code required · Phone length per region |

**Implementation:** `src/features/auth/LoginScreen.tsx`  
**OTP:** Modal (`DriverOtpModal`) — 6-digit, auto-read ready, resend timer, change number

---

## 3. OTP Verification

| Feature | Details |
|---------|---------|
| 6-digit OTP input | `OtpCodeInput` component |
| Auto-read OTP | Platform SMS listener (when enabled) |
| Resend OTP | 60s cooldown timer |
| Change number | Returns to phone field |

---

## 4. Dashboard Screen *(Most Important)*

| Section | Content |
|---------|---------|
| **Header** | Driver name · Profile photo · Online/Offline toggle |
| **Stats cards** | Today's jobs · Active jobs · Completed jobs · Monthly earnings |
| **Current assignment** | Booking ID · Customer · Vehicle · Pickup time · Booking type |
| **Actions** | View Detail · Upcoming Jobs · Earnings · Support |

**Implementation:** `src/features/home/HomeScreen.tsx`

---

## 5. Assignment List Screen

| Tab | Shows |
|-----|-------|
| **Pending** | New assignments (`assigned`) |
| **Active** | Current jobs (`accepted`, `en_route`, `arrived`, `handover_in_progress`) |
| **Completed** | Finished jobs |
| **Cancelled** | Cancelled / rejected jobs |

**Card fields:** Booking ID · Customer · Vehicle · Booking type · Pickup date

**Implementation:** `src/features/jobs/JobInboxScreen.tsx`

---

## 6. Booking Detail Screen

### Booking Information
- Booking number · Booking type · Booking status

### Customer Information
- Name · Mobile · Email · **Call button**

### Vehicle Information
- Car name · Plate number · Vehicle color

### Location Information
- Pickup address · Google Map preview · **Navigate button**

### Financial Information *(Read-only)*
- Rental amount · Deposit · Paid status  
- **Driver does NOT collect payment**

### Action Buttons
Status- and type-dependent (see flows below).

**Implementation:** `src/features/jobs/JobDetailScreen.tsx`

---

## Self Drive Flow

### 7. Vehicle Delivery Screen
Customer verification before handover:

| Step | Fields |
|------|--------|
| Booking OTP | 6-digit + Verify |
| Driving license | Capture / upload / preview |
| Customer photo | Live camera capture |
| Signature | Signature pad + Verify |

All steps complete → **Continue**

**Implementation:** `src/features/verify/HandoverVerifyScreen.tsx` + `CheckoutWizardScreen.tsx`

### 8. Vehicle Inspection Screen *(Mandatory)*

**Before delivery photos (required):**
Front · Rear · Left · Right · Dashboard · Odometer · Fuel meter · Interior · Notes (textarea)

→ **Submit Inspection** · Store evidence

**Implementation:** `src/features/handover/CheckoutWizardScreen.tsx`

### 9. Vehicle Handover Screen

**Checklist:**
- ✔ Documents given · ✔ Key given · ✔ Fuel checked · ✔ Photos uploaded · ✔ Signature collected

→ **Vehicle Delivered** · Booking status update

**Implementation:** Checkout wizard final step

### 10. Vehicle Return Pickup Screen

**Return inspection photos:** Front · Rear · Left · Right · Odometer · Fuel

**Damage report checkboxes:** Scratch · Dent · Broken part · Other  
**Damage images:** Multiple upload · Remarks textarea

→ **Submit Return** · Booking completed

**Implementation:** `src/features/handover/CheckinWizardScreen.tsx`

---

## Chauffeur Flow

### 11. Ride Assignment
Ride details + **Accept** / **Reject**  
**Implementation:** `JobDetailScreen` (assigned status)

### 12. Navigation Screen
Full-screen map · Driver marker · Pickup marker · Route  
Buttons: **Arrived** · **Call customer**  
**Implementation:** `src/features/chauffeur/ChauffeurNavigationScreen.tsx`

### 13. Start Trip Screen
OTP verification → **Start Ride** · Status: In Progress  
**Implementation:** `src/features/chauffeur/ChauffeurStartTripScreen.tsx`

### 14. Active Trip Screen
Map · Distance · Duration · Status · Emergency contact · **Complete Ride**  
**Implementation:** `ChauffeurActiveTripScreen.tsx` + `TripSummaryScreen.tsx`

---

## Support Module

### 15. Ticket List Screen
Tabs: **Open** · **In Progress** · **Closed**  
Card: Ticket number · Subject · Status · Date

### 16. Create Ticket Screen
| Field | Type |
|-------|------|
| Issue category | Dropdown (Vehicle, App, Customer, Payment, Booking, Document) |
| Priority | Low / Medium / High |
| Subject | Text |
| Description | Multiline |
| Attachments | Images / PDF |
| Location | Auto-filled (optional) |

→ **Submit Ticket**

### 17. Ticket Detail Screen
Ticket info · Category · Status · Chat-style conversation · Reply + attachment + Send

**Implementation:** `src/features/support/` · Also: Breakdown tickets · Incident report · Chat

---

## Earnings Module

### 18. Earnings Screen
| Section | Content |
|---------|---------|
| Summary cards | Today · Week · Month |
| Charts | Trips · Earnings trend |
| Recent list | Per-booking earnings rows |

**Implementation:** `src/features/earnings/EarningsScreen.tsx`

---

## Profile Module

### 19. Profile Screen
**Personal:** Name · Phone · Email  
**Driver:** Employee ID · License number  
**Vehicle:** Assigned fleet vehicles

### 20. Documents Screen
| Document | Action |
|----------|--------|
| Driving license | View / Upload |
| National ID | View / Upload |
| Employee ID | View / Upload |
| Insurance | View / Upload |

**Implementation:** `src/features/profile/DocumentsScreen.tsx` · KYC wizard for full upload flow

---

## Settings Screen
- Language (EN / AR)  
- Notifications toggle  
- App version  
- Logout

**Implementation:** `src/features/profile/SettingsScreen.tsx`

---

## Recommended Extra Features

### Incident Report
Fields: Incident type · Description · Photos · Location · **SOS button**  
**Implementation:** `src/features/profile/IncidentReportScreen.tsx`

### Vehicle Checklist (Before Trip)
Tyres · Fuel · Lights · Brakes · Documents

### Driver Attendance
Check-in · Check-out (for company-employed drivers)  
**Implementation:** Shift start/end on Dashboard

---

## API Endpoints Map

| Domain | Endpoint | Screen |
|--------|----------|--------|
| Auth | `sendLoginOTP`, `verifyLoginOTP`, `fetchDriverProfile`, `logoutDriver` | Login, Splash |
| Jobs | `fetchJobList`, `fetchJobDetails`, `acceptJob`, `rejectJob`, `updateJobStatus` | Inbox, Detail |
| Handover | `verifyHandoverOtp`, `submitCheckout`, `submitCheckin` | Delivery, Inspection |
| Chauffeur | `fetchChauffeurTrip`, `startChauffeurTrip`, `endChauffeurTrip` | Trip screens |
| Earnings | `fetchDriverEarnings` | Earnings |
| Support | `fetchSupportTickets`, `createSupportTicket`, `replySupportTicket` | Support module |
| Profile | `fetchDriverSummary`, `updateDriverProfile` | Dashboard, Profile |
| Shift | `updateShiftStatus`, `postDriverLocation` | Dashboard |

Full endpoint list: `src/api/urls/endpoints.ts`

---

## Screen → File Index

| # | Screen | File |
|---|--------|------|
| 1 | Splash | `src/features/splash/SplashScreen.tsx` |
| 2 | Login | `src/features/auth/LoginScreen.tsx` |
| 3 | OTP | `src/features/auth/components/DriverOtpModal.tsx` |
| 4 | Dashboard | `src/features/home/HomeScreen.tsx` |
| 5 | Assignment List | `src/features/jobs/JobInboxScreen.tsx` |
| 6 | Booking Detail | `src/features/jobs/JobDetailScreen.tsx` |
| 7–9 | Self Drive | `HandoverVerifyScreen`, `CheckoutWizardScreen` |
| 10 | Return Pickup | `CheckinWizardScreen.tsx` |
| 11–14 | Chauffeur | `ChauffeurNavigationScreen`, `ChauffeurStartTripScreen`, `ChauffeurActiveTripScreen`, `TripSummaryScreen` |
| 15–17 | Support | `src/features/support/*` |
| 18 | Earnings | `src/features/earnings/EarningsScreen.tsx` |
| 19 | Profile | `src/features/profile/ProfileScreen.tsx` |
| 20 | Documents | `src/features/profile/DocumentsScreen.tsx` |
| — | Settings | `src/features/profile/SettingsScreen.tsx` |
| — | Incident | `src/features/profile/IncidentReportScreen.tsx` |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented with UI + local/network API |
| ⚠️ | UI complete; some APIs stubbed |
| ❌ | Not yet built |

| Feature | Status |
|---------|--------|
| Splash + auth restore | ✅ |
| Login + OTP | ✅ |
| Dashboard | ✅ |
| Job inbox (tabbed) | ✅ |
| Booking detail | ✅ |
| Self-drive handover | ✅ |
| Chauffeur trip | ✅ |
| Earnings | ✅ |
| Support tickets | ✅ |
| Documents hub | ✅ |
| Incident report | ⚠️ (local submit) |
| Live location posting | ⚠️ |
| Payment collection | ❌ (by design — driver never collects) |
